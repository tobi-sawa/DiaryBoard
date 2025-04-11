import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [messages, setMessages] = useState([]);
  const [diaryCount, setDiaryCount] = useState(0); // 追加: 日記の数を管理
  const [openDiaryId, setOpenDiaryId] = useState(null); // 開かれた日記IDを管理
  const navigate = useNavigate();
  const tokenRef = useRef(localStorage.getItem("authToken") || null); // トークンをlocalStorageから取得

  // 日記を取得する関数
  const fetchDiaries = async () => {
    if (!tokenRef.current) return; // トークンがセットされていない場合は処理を終了

    try {
      const response = await axios.get("http://localhost:8000/get_my_diary", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`, // トークンをヘッダーに含める
        },
      });

      const diaryData = response.data.diaries;
      setDiaryCount(response.data.diary_count); // 追加: diary_count をセット

      if (diaryData.length === 0) {
        setMessages([]);
      } else {
        const formattedMessages = diaryData
          .sort((a, b) => new Date(b.diary_time) - new Date(a.diary_time))
          .map((diary) => ({
            user_name: diary.user_name,
            diary_id: diary.diary_id,
            title: diary.title,
            content: diary.content,
            diary_time: diary.diary_time,
            reactions: diary.reactions || {},
          }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching diaries:", error);
    }
  };

  // トークン確認と日記取得
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/startpage");
        return;
      }
      tokenRef.current = token;
      try {
        const response = await axios.post("http://localhost:8000/verify_token", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.valid) {
          fetchDiaries(); // トークンが有効なら日記を取得
        } else {
          navigate("/startpage");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/startpage");
      }
    };

    verifyToken();
  }, []);

  // 日記を表示/非表示切り替え
  const toggleDiary = (diaryId) => {
    setOpenDiaryId(openDiaryId === diaryId ? null : diaryId);
  };

  const deleteDiary = async (diaryId) => {
    if (!tokenRef.current) return;

    // ユーザーに確認メッセージを表示
    const confirmDelete = window.confirm("本当にこの日記を削除しますか？");

    if (!confirmDelete) return; // ユーザーがキャンセルした場合は何もしない

    try {
      // ゴミ箱アイコンがクリックされた時にAPIを呼び出す
      const response = await axios.put(
        `http://localhost:8000/delete_diary/${diaryId}`,  // diary_id を URL に含める
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenRef.current}`,  // トークンをヘッダーに含める
          },
        }
      );

      // 返ってきたレスポンスをコンソールに表示
      console.log(response.data);

      if (response.data.message === "Diary Deleted Successfully!") {
        // 非表示にした日記をリストから削除
        setMessages(messages.filter((message) => message.diary_id !== diaryId));

        // 日記数を1減らす
        setDiaryCount((prevCount) => prevCount - 1);

        // 再度日記を取得
        fetchDiaries();
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };



  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>My Diary History✉️</h2>
      <h3 style={{ textAlign: "center", color: "#333" }}>
        My Diary: {diaryCount}
      </h3>
      <button
        onClick={() => navigate("/Chat")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ◀ Back
      </button>
      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>
          No diary... 😢
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "30px" }}>
          {messages.map((message) => (
            <div key={message.diary_id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
  style={{
    padding: "5px",
    backgroundColor: "#ffcc30", // 薄いオレンジ
    border: "1px solid #ffb74d", // より薄いオレンジ
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  }}
  onClick={() => toggleDiary(message.diary_id)}
>

                <span style={{ fontSize: "14px", color: "#555" }}>
                  {message.diary_time}
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "25px",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column", // 縦方向に配置
                    alignItems: "center", // 中央揃え
                  }}
                >
                  {message.title}
                  <span style={{ fontSize: "16px", color: "#333", fontWeight: "normal" }}>
                    Name：{message.user_name}
                  </span>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // 親のクリックイベントを停止
                      deleteDiary(message.diary_id); // ゴミ箱アイコンをクリックで削除
                    }}
                    style={{
                      fontSize: "20px",
                      cursor: "pointer",
                      padding: "5px",
                      border: "2px solid white",
                      borderRadius: "4px",
                      backgroundColor: "white",
                    }}
                  >
                    🚮
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "black",
                      cursor: "pointer",
                    }}
                  >
                    {openDiaryId === message.diary_id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {openDiaryId === message.diary_id && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "15px",
                    backgroundColor: "#f7f7f7",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    boxShadow: "0 2px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <p><strong>Content:</strong> {message.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
