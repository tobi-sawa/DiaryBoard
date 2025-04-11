import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";

const Question3 = () => {
  const { diaryId } = useParams();
  const [quiz, setQuiz] = useState();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectAnswer, setSelectAnswer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isTitleUpdated, setIsTitleUpdated] = useState(false); // ← 追加
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://localhost:8000/get_same_quiz/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizzes = response.data.quizzes;
      if (quizzes && quizzes.length > 2) {
        const sortedQuizzes = quizzes.sort((a, b) => a.quiz_id - b.quiz_id);
        setQuiz(sortedQuizzes[2]);
      } else {
        console.error("クイズが3問以上存在しません");
      }
    } catch (err) {
      console.error("クイズ取得エラー:", err);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [diaryId]);

  const handleOptionChange = (key) => {
    setSelectedOption(key);
    setSelectAnswer(key);
  };

  const submitAnswer = async () => {
    if (selectAnswer == null) {
      alert("Please select an answer. : 答えを選択してください。");
      return false;
    }

    const token = localStorage.getItem("access_token");
    const answerData = {
      quiz_id: quiz.quiz_id,
      diary_id: quiz.diary_id,
      choices: selectAnswer,
    };

    try {
      const response = await axios.post("http://localhost:8000/create_answer", answerData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.is_title_updated) {
        setNewTitle(response.data.updated_title);
        setIsTitleUpdated(true); // ← 称号獲得時のみ true
        setShowPopup(true);
      } else {
        setIsTitleUpdated(false); // ← 称号獲得なしなら false
        navigate(`/Answer3/${quiz.diary_id}`, { state: { selectedOption } }); // 即時遷移
      }

      return true;
    } catch (err) {
      console.error("ERROR:", err);
      return false;
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate(`/Answer3/${quiz.diary_id}`, { state: { selectedOption } });
  };

  const handleSubmit = async () => {
    const success = await submitAnswer();
    if (!success) {
      alert("Please select an answer. : 答えを選択してください。");
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h3>Q3 <u>{quiz.question}</u></h3>
      <div style={styles.options}>
        {Object.entries(quiz.choices).map(([key, option], index) => (
          <div key={index} style={styles.option}>
            <input
              type="radio"
              id={`option-${index}`}
              name="quiz"
              value={option}
              onChange={() => handleOptionChange(key)}
            />
            <label htmlFor={`option-${index}`} style={styles.label}>
              {key.toUpperCase()}. {option}
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} style={styles.submitButton}>
        Answer✅
      </button>

      {showPopup && isTitleUpdated && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={400}
            recycle={false}
          />
          <div style={styles.popupOverlay}>
            <div style={styles.popupContent}>
              <h2>🎉 おめでとうございます！ 🎉</h2>
              <p>
                新しい称号を獲得しました！  
                <strong>{newTitle}</strong>
              </p>
              <button style={styles.submitButton} onClick={handleClosePopup}>
                閉じる
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "100px",
    maxWidth: "1000px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#F9F9F9",
    margin: "0 auto",
  },
  options: {
    marginTop: "20px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  label: {
    marginLeft: "10px",
    flexGrow: 1,
    color: "#333",
  },
  submitButton: {
    marginTop: "30px",
    backgroundColor: "#FFA500",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popupContent: {
    background: "#fff",
    color: "#333",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    zIndex: 1001,
  },
};

export default Question3;
