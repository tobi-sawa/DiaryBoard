import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizHistoryPage = () => {
  const [quizData, setQuizData] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuiz, setTotalQuiz] = useState(0);
  const [percent, setPercent] = useState(0);
  const [openSetIndex, setOpenSetIndex] = useState(null);
  const navigate = useNavigate();
  const tokenRef = useRef(localStorage.getItem("authToken") || null);

  const dictionary = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d"
  };

  const fetchQuizData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_answer_quiz", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });

      const formattedData = response.data.correct_count;
      setQuizData(formattedData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const fetchTotalAnswerData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get_total_answer", {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
        },
      });
      setCorrectCount(response.data.correct_count);
      setTotalQuiz(response.data.total_quiz);
      setPercent(response.data.persent);
    } catch (error) {
      console.error("Error fetching total answer data:", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/startpage");
        return;
      }
      tokenRef.current = token;
      try {
        const response = await axios.post(
          "http://localhost:8000/verify_token",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.valid) {
          fetchQuizData();
          fetchTotalAnswerData();
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

  const toggleQuiz = (diaryId) => {
    setOpenSetIndex(openSetIndex === diaryId ? null : diaryId);
  };

  return (
    <div style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>My Quiz History</h2>

      {/* Quiz Stats */}
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          backgroundColor: "#ffffff",
          borderRadius: "15px",
          marginBottom: "15px",
          fontSize: "16px",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>
          <strong style={{ color: "#28a745", fontSize: "20px" }}>Correct Count:</strong>
          <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "24px" }}>
            {correctCount}
          </span>
        </div>
        <div>
          <strong style={{ color: "#28a745", fontSize: "20px" }}>Total count:</strong>
          <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "24px" }}>
            {totalQuiz}
          </span>
        </div>
        <div>
          <strong style={{ color: "#28a745", fontSize: "20px" }}>Correct Rate:</strong>
          <span style={{ color: "#28a745", fontWeight: "bold", fontSize: "24px" }}>
            {percent.toFixed(1)}%
          </span>
        </div>
      </div>

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

      {Object.keys(quizData).length === 0 ? (
        <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>
          No Quiz...😢
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "10px" }}>
          {Object.entries(quizData).map(([diaryId, diaryData]) => (
            <div key={diaryId} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#ffcc30",
                  border: "1px solid #ffb74d",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#000",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative"
                }}
                onClick={() => toggleQuiz(diaryId)}
              >
                <span style={{ fontSize: "12px", color: "#555" }}>
                  {diaryData.answer_date}
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "15px",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {diaryData.title}
                  <span style={{ fontSize: "14px", color: "#333", fontWeight: "normal" }}>
                    User：{diaryData.name}
                  </span>
                </span>
                <span style={{ fontSize: "16px", color: "black", cursor: "pointer" }}>
                  {openSetIndex === diaryId ? "▲" : "▼"}
                </span>
              </div>

              {openSetIndex === diaryId && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    backgroundColor: "#f7f7f7",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                  }}
                >
                  {diaryData.questions.map((quiz, qIndex) => (
                    <div
                      key={qIndex}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid gray",
                        marginBottom: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <p>
                        <strong>Q{qIndex + 1} :</strong> {quiz.question}
                      </p>
                      <div style={{ marginTop: "10px" }}>
                        {["a", "b", "c", "d"].map((option) => {
                          const correctAnswerKey = dictionary[quiz.correct]; // `quiz.correct` から正解データを取得
                          const isCorrect = option === correctAnswerKey;
                          const isSelected = option === quiz.choice;

                          let backgroundColor = "";
                          if (isSelected && isCorrect) {
                            backgroundColor = "lightgreen";  // 正解かつ選択済み
                          } else if (isSelected && !isCorrect) {
                            backgroundColor = "lightcoral";  // 誤答だが選択済み
                          } else if (isCorrect) {
                            backgroundColor = "lightgreen";  // 正解で未選択
                          }

                          // 各選択肢の値を取得
                          const choiceValue = quiz[option];

                          return (
                            <p key={option} style={{ margin: "5px 0", backgroundColor }}>
                              <strong>{option}:</strong> {choiceValue}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizHistoryPage;