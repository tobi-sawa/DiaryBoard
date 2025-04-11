import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState(""); // チーム名を格納するステート
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // ← 追加
  const emojis = ["👍", "❤️", "😂", "😲", "😢"];
  const diaryContainerRef = useRef(null);
  const tokenRef = useRef(null); // Use a ref to store the token


  // チーム名を取得
  const fetchTeamName = useCallback(async () => {
    if (!tokenRef.current) return; // トークンがない場合は終了
    try {
      const response = await axios.get("http://localhost:8000/get_team_name", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      setTeamName(response.data.team_name); // チーム名をステートにセット
      setUserName(response.data.user_name); // ← 追加
    } catch (error) {
      console.error("Error fetching team name:", error);
    }
  }, []);

  const fetchDiaries = useCallback(async () => {
    if (!tokenRef.current) return;
    try {
      const response = await axios.get("http://localhost:8000/get_diaries", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      const diaryData = response.data.diaries;
      const formattedMessages = diaryData.map((diary) => ({
        user_name: diary.user_name,
        diary_id: diary.diary_id,
        title: diary.title,
        content: diary.content,
        diary_time: diary.diary_time,
        reactions: diary.reactions || {},
      }));
      
      setMessages(formattedMessages);
  
      // **データがセットされた後に最下部にスクロール**
      setTimeout(() => {
        if (diaryContainerRef.current) {
          diaryContainerRef.current.scrollTop = diaryContainerRef.current.scrollHeight;
        }
      }, 0);
  
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  }, []);
  

  const isInitialLoad = useRef(true); // 初回表示フラグ

  // 初回のみ最下部へスクロール
  useEffect(() => {
    if (diaryContainerRef.current && isInitialLoad.current) {
      diaryContainerRef.current.scrollTop = diaryContainerRef.current.scrollHeight;
      isInitialLoad.current = false; // 初回スクロール後はフラグを無効化
    }
  }, [messages]);
  
  // ユーザーが最下部にいる場合のみスクロールを維持
  useEffect(() => {
    if (diaryContainerRef.current) {
      const isUserAtBottom =
        diaryContainerRef.current.scrollTop + diaryContainerRef.current.clientHeight >=
        diaryContainerRef.current.scrollHeight - 10;
      if (isUserAtBottom) {
        diaryContainerRef.current.scrollTop = diaryContainerRef.current.scrollHeight;
      }
    }
  }, [messages]);
  
  // Verify token and fetch diaries once
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/startpage");
        return;
      }
      tokenRef.current = token; // Store the token in the ref
      try {
        const response = await axios.post("http://localhost:8000/verify_token", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.valid) {
          fetchDiaries(); // Fetch diaries if token is valid
          fetchTeamName(); // チーム名を取得
        } else {
          navigate("/startpage");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/startpage");
      }
    };

    verifyToken(); // Verify token on mount
  }, [fetchDiaries, fetchTeamName, navigate]);

  const addReaction = async (messageId, emoji) => {
    if (!diaryContainerRef.current) return;
  
    // 現在のスクロール位置を保存
    const previousScrollTop = diaryContainerRef.current.scrollTop;
    const previousScrollHeight = diaryContainerRef.current.scrollHeight;
  
    // UI上で即座に反映させる
    const updatedMessages = messages.map((message) => {
      if (message.diary_id === messageId) {
        const updatedReactions = { ...message.reactions };
        updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1;
        return { ...message, reactions: updatedReactions };
      }
      return message;
    });
  
    setMessages(updatedMessages);
  
    // スクロール位置を復元
    setTimeout(() => {
      if (diaryContainerRef.current) {
        // 新しい要素の追加による高さの変化を考慮
        const newScrollHeight = diaryContainerRef.current.scrollHeight;
        diaryContainerRef.current.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
      }
    }, 0);
  
    // サーバーへリクエストを送信
    const payload = { diary_id: messageId, emoji };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/add_reaction",
        payload,
        { headers: { Authorization: `Bearer ${tokenRef.current}` } }
      );
  
      if (response.status === 200) {
        console.log("Reaction successfully updated on the server.");
  
        // サーバーから最新のリアクションデータを取得
        const updatedMessagesFromServer = messages.map((message) => {
          if (message.diary_id === messageId) {
            return { ...message, reactions: response.data.reactions };
          }
          return message;
        });
  
        setMessages(updatedMessagesFromServer);
  
        // 再度スクロール位置を復元
        setTimeout(() => {
          if (diaryContainerRef.current) {
            const newScrollHeight = diaryContainerRef.current.scrollHeight;
            diaryContainerRef.current.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight);
          }
        }, 0);
      } else {
        console.error("Error updating reaction on the server:", response.data);
      }
    } catch (error) {
      console.error("Error updating reaction on the server:", error);
    }
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleTeacherPageRedirect = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/startpage");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/verify_token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // is_adminがTrueの場合に教員ページに遷移
      if (response.data.is_admin) {
        navigate("/teacher_page");
      } else {
        alert("You are not authorized to access this page. : このページにアクセスする権限がありません。");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      alert("Please login again.");
      navigate("/startpage");
    }
  };

  const handleMenuItemClick = (item) => {
    switch (item) {
      case "Ranking🏆":
        navigate("/Ranking");
        break;
      case "Diary✉️":
        navigate("/log");
        break;
      case "Quiz✅":
        navigate("/Quiz_log")
        break;
      case "Setting⚙️":
        navigate("/Setting");
        break;
      case "ログアウト":
        navigate("/StartPage");
        break;
      case "Teacher Page👨‍  🏫":
        handleTeacherPageRedirect();
        break;
      default:
        break;
    }
  };


  const [loading, setLoading] = useState(false); // ロード状態を管理

  const sendAndAddDiary = async () => {
    if (newMessage.trim() === "" || newTitle.trim() === "") return;
    setLoading(true);
    const newDiary = { title: newTitle, content: newMessage };
    try {
      const response = await axios.post("http://localhost:8000/add_diary", newDiary, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (response.data.status) {
        fetchDiaries();
        setNewMessage("");
        setNewTitle("");
        alert("OK! Diary sent successfully.✉️ : 日記が送信されました。");
        navigate("/Quiz1");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error posting diary:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleQuizClick = async (diaryId) => {
    try {
      const response = await axios.get(`http://localhost:8000/get_same_quiz/${diaryId}`, {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      console.log(response.data);
      navigate(`/Question1/${diaryId}`);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          height: "100vh",
          backgroundColor: "#fff",
          boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
          transition: "transform 0.3s",
          overflowX: "hidden",
          zIndex: 1000,
          position: "fixed",
          left: menuOpen ? "0" : "-250px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {menuOpen && (
          <div style={{ padding: "20px", flexGrow: 1 }}>
            <h3 style={{ margin: "0 0 20px" }}>
              <br />
              <br />
              <br />
              <br />
              <br />
              Menu</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {["Ranking🏆", "Diary✉️", "Quiz✅", "Setting⚙️"].map((item) => (
                <li
                  key={item}
                  onClick={() => handleMenuItemClick(item)}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    color: "#007BFF",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={toggleMenu}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#F44336",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Close✖
            </button>
          </div>
        )}
        {/* Logout and Teacher Page Buttons at the Bottom */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <button
            onClick={handleTeacherPageRedirect}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "#FFA500", // Orange color
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Teacher Page👨‍  🏫
          </button>
          <button
            onClick={() => handleMenuItemClick("ログアウト")}
            style={{
              width: "100%",
              padding: "10px 20px",
              backgroundColor: "#FFA500", // Orange color
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout...🚪 
          </button>
        </div>
      </div>




      {/* Menu Button */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          left: "20px",
          zIndex: 1100,
        }}
      >
        <button
          onClick={toggleMenu}
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "10px", marginTop: "60px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ textAlign: "center" }}>{teamName} {userName || "Unknown"}</h1>
          <h2 style={{ textAlign: "center" }}>🌟 Let’s Share with Everyone!🌟</h2>

          {/* Display Diaries */}
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888", fontSize: "16px" }}>
              No Diary yet...😢
            </p>
          ) : (
            <div
              ref={diaryContainerRef}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                height: "400px",
                overflowY: "scroll",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#F9F9F9",
              }}
            >
              {messages.map((message) => (
                <div key={message.diary_id} style={{ marginBottom: "20px" }}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px",
                      borderRadius: "10px",
                      boxShadow: "0 2px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p style={{ margin: 0, color: "#333" }}>Name: {message.user_name}</p>
                    <h4>{message.title}</h4>
                    <p style={{ fontSize: "14px" }}>{message.content}</p>
                    <span style={{ fontSize: "12px", color: "#999" }}>{message.diary_time}</span>

                    {/* Reaction Buttons */}
                    <div style={{ marginTop: "10px" }}>
                      {emojis.map((emoji, index) => {
                        const reactionKey = Object.keys(message.reactions)[index];
                        return (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              addReaction(message.diary_id, emoji);
                            }}
                            style={{
                              marginRight: "2px",
                              border: "none",
                              background: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                            }}
                          >
                            {emoji} {message.reactions[reactionKey] || 0}
                          </button>
                        );
                      })}
                    </div>

                    {/* クイズへボタン */}
                    <button
                      onClick={() => handleQuizClick(message.diary_id)}
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: "#FFA500",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Quiz！
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="titleInput" style={{ display: "block", marginBottom: "5px" }}>
              Title
            </label>
            <input
              id="titleInput"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder=""
              style={{
                width: "97%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />
            <label htmlFor="contentInput" style={{ display: "block", marginBottom: "5px" }}>
              Content
            </label>
            <textarea
              id="contentInput"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder=""
              style={{
                width: "97%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "none",
                overflow: "hidden",
              }}
              rows={1}
            />
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              Write more than 100 words！ : 100文字以上書こう！
            </p>
            </div>
          <button
            onClick={sendAndAddDiary}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: loading ? "#ccc" : "#4CAF50",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending now... 📮" : "Send diary✉️"}
          </button>
        </div>
      </div>
      {/* Media Queries */}
      <style>
        {`
          @media (max-width: 768px) {
            .sidebar {
              width: 200px;
            }
            .menu-button {
              width: 30px;
              height: 30px;
            }
            .main-content {
              padding: 5px;
              margin-top: 50px;
            }
            .diary-container {
              height: 300px;
            }
            .input-area input,
            .input-area textarea {
              width: 95%;
            }
            .input-area button {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatApp;