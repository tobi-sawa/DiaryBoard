import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const languageOptions = [
    { id: 1, label: "日本語" },
    { id: 2, label: "English" },
    { id: 3, label: "Português" },
    { id: 4, label: "Español" },
    { id: 5, label: "简体中文 (Simplified Chinese)" },
    { id: 6, label: "繁體中文 (Traditional Chinese)" },
    { id: 7, label: "한국어" },
    { id: 8, label: "Tagalog" },
    { id: 9, label: "Tiếng Việt" },
    { id: 10, label: "Bahasa Indonesia" },
    { id: 11, label: "नेपाली" },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.post("http://localhost:8000/verify_token", {},
          {headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        const { user_name, learn_language, nickname } = response.data;
        setUsername(user_name);
        setLanguage(learn_language);
        setNickname(nickname);
      } catch (error) {
        console.error("ユーザープロファイルの取得中にエラーが発生しました:", error);
        alert("ユーザー情報の取得に失敗しました。再度ログインしてください。");
        navigate("/");
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleUsernameChange = (e) => setUsername(e.target.value);

  const handleLanguageChange = (e) => setLanguage(Number(e.target.value));

  const handleBack = () => navigate("/Chat");

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:8000/get_profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user_name: currentUserName, learn_language: currentLearnLanguage } = response.data;
      const updatedData = {
        user_name: username !== currentUserName ? username : null,
        learn_language: language !== currentLearnLanguage ? language : null,
      };
      const updateResponse = await axios.put(
        "http://localhost:8000/change_profile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(updateResponse.data.message);
    } catch (error) {
      console.error("プロフィール更新中にエラーが発生しました:", error);
      alert(error.response?.data?.detail || "ERROR");
    }
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #FFA500, #4CAF50)",
      color: "#fff",
      padding: "30px 30px",
      width: "350px",
      margin: "20px auto",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    input: {
      width: "88%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      margin: "10px 0",
    },
    select: {
      width: "93%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      margin: "10px 0",
    },
    displayOnly: {
      width: "89%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      margin: "10px auto",
      backgroundColor: "#eee",
      color: "#333",
      textAlign: "center",
    },
    button: {
      padding: "12px 36px",
      backgroundColor: "#FFA500",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      margin: "10px 5px",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2>My Profile</h2>
      <div style={styles.displayOnly}>
        <strong>Nickname:</strong> {nickname || "称号が設定されていません"}
      </div>

      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          style={styles.input}
        />
      </div>

      <div>
        <label htmlFor="language">Learn Language</label>
        <select id="language" value={language} onChange={handleLanguageChange} style={styles.select}>
          <option value="">Please select</option>
          {languageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={updateProfile} style={styles.button}>New！🆕</button>
      <button onClick={handleBack} style={{ ...styles.button, backgroundColor: "#4CAF50" }}>◀ Back</button>
    </div>
  );
};

export default Setting;
