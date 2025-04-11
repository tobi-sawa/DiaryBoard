import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Result = () => {
  const { diaryId } = useParams();
  const [correctCount, setCorrectCount] = useState(0);
  const [userNickname, setUserNickname] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 結果を取得する関数
  const fetchResults = async () => {
    try {
      console.log("結果を取得中...");
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("ログイン情報がありません。再度ログインしてください。");
      }

      console.log("ローカルストレージに結果がないためAPIを呼び出します");

      const response = await axios.get(`http://localhost:8000/quiz_correct_count/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("APIレスポンス:", response.data);

      // 取得したデータをstateにセット
      setCorrectCount(response.data.correct_count);
      setUserNickname(response.data.user_nickname);
      setTotalScore(response.data.total_score);

      // 結果をローカルストレージに保存
      localStorage.setItem("quiz_results", JSON.stringify(response.data));
    } catch (error) {
      console.error("API呼び出しエラー:", error);
      setErrorMessage(error.response?.data?.detail || "結果の取得中にエラーが発生しました。");
    }
  };

  useEffect(() => {
    console.log("useEffectが呼ばれました");
    fetchResults();

    return () => {
      console.log("コンポーネントがアンマウントされました。結果を削除します。");
      try {
        localStorage.removeItem("quiz_results");
        console.log("ローカルストレージのデータが削除されました");
      } catch (error) {
        console.error("ローカルストレージの削除に失敗しました:", error);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Result Announcement🎉</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div style={styles.resultBox}>
        <h3>Nickname: {userNickname}</h3>
        <h3>Total Score: {totalScore}</h3>
        <h2>This Round's Results: {correctCount} / 5</h2>
      </div>
      <p style={styles.congratulations}>Thanks for playing!👏</p>
      <button style={styles.button} onClick={() => navigate("/Chat")}>
        Go to Homepage 🏠
      </button>
    </div>
  );
};

const styles = {
  container: {
    background: "linear-gradient(135deg, #FFA500, #4CAF50)",
    color: "#fff",
    padding: "40px",
    width: "350px",
    margin: "40px auto",
    borderRadius: "15px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  resultBox: {
    backgroundColor: "#fff",
    color: "#333",
    padding: "20px",
    borderRadius: "10px",
    margin: "20px 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#FFA500",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    margin: "10px 5px",
    transition: "all 0.3s ease",
  },
};

export default Result;
