import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Ranking = () => {
  const [quizRanking, setQuizRanking] = useState([]);
  const [diaryRanking, setDiaryRanking] = useState([]);
  const [combinedRanking, setCombinedRanking] = useState([]); // State for combined ranking
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // 現在のユーザーIDを格納するステート
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const token = localStorage.getItem("access_token"); // トークンを取得

        // Fetch quiz ranking
        const quizResponse = await axios.get("http://localhost:8000/get_quiz_ranking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch diary ranking
        const diaryResponse = await axios.get("http://localhost:8000/get_diary_ranking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Fetch combined ranking
        const combinedResponse = await axios.get("http://localhost:8000/get_combined_ranking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Quiz Ranking Data:", quizResponse.data); // デバッグ用
        console.log("Diary Ranking Data:", diaryResponse.data); // デバッグ用
        console.log("Combined Ranking Data:", combinedResponse.data); // デバッグ用

        setQuizRanking(quizResponse.data.ranking);
        setDiaryRanking(diaryResponse.data.ranking);
        setCombinedRanking(combinedResponse.data.ranking); // Set combined ranking
        setCurrentUserId(quizResponse.data.current_user_id); // 現在のユーザーIDを設定
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ranking:", err.response ? err.response.data : err.message); // エラー内容をログに記録
        setError("ランキングの取得中にエラーが発生しました。");
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Quiz Ranking✅</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Correct</th>
          </tr>
        </thead>
        <tbody>
          {quizRanking.map((user, index) => (
            <tr
              key={index}
              style={user.id === currentUserId ? styles.currentUserRow : {}}
            >
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.nickname || "未設定"}</td>
              <td style={styles.td}>{user.answer_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 style={styles.header}>Diary Ranking✉️</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Diary Count</th>
          </tr>
        </thead>
        <tbody>
          {diaryRanking.map((user, index) => (
            <tr
              key={index}
              style={user.id === currentUserId ? styles.currentUserRow : {}}
            >
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.nickname || "未設定"}</td>
              <td style={styles.td}>{user.diary_count ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 style={styles.header}>Total Ranking🏆</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Rank</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {combinedRanking.map((user, index) => (
            <tr
              key={index}
              style={user.id === currentUserId ? styles.currentUserRow : {}}
            >
              <td style={styles.td}>{index + 1}</td>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.nickname || "未設定"}</td>
              <td style={styles.td}>{user.combined_score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={styles.backButton} onClick={() => navigate("/Chat")}>
      ◀ Back
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  header: {
    fontSize: "28px",
    color: "#2E8B57",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    backgroundColor: "#FFA500",
    color: "#fff",
    fontSize: "18px",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
    fontSize: "16px",
    textAlign: "center",
  },
  loading: {
    fontSize: "20px",
    color: "#2E8B57",
  },
  error: {
    fontSize: "18px",
    color: "red",
  },
  backButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  currentUserRow: {
    backgroundColor: "#28a745", // 現在のユーザーの行を緑に
    color: "white", // 白い文字
  },
};

export default Ranking;
