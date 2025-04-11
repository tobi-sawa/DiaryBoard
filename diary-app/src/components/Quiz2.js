import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quiz2 = () => {
  const [categories, setCategories] = useState([
    { id: 1, label: "Q1 : " },
    { id: 2, label: "Q2 : " },
    { id: 3, label: "Q3 : " },
    { id: 4, label: "Q4 : " },
    { id: 5, label: "Q5 : " },
    { id: 6, label: "Q6 : " },
    { id: 7, label: "Q7 : " },
    { id: 8, label: "Q8 : " },
    { id: 9, label: "Q9 : " },
    { id: 10, label: "Q10 : " },
  ]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("ERROR:もう一度ログインしてください");
          return;
        }

        const response = await axios.get("http://localhost:8000/get_quizzes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const quizzes = response.data.quizzes;
        const updatedCategories = categories.map((category, index) => {
          if (quizzes[index]) {
            category.label = `Q${index + 1}: ${quizzes[index].question}`;
          }
          return category;
        });

        setCategories(updatedCategories);
      } catch (error) {
        console.error("ERROR:", error);
        setError("ERROR : もう一度お試しください");
      }
    };

    fetchQuizzes();
  }, []);

  const handleSelect = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((category) => category !== id));
    } else {
      if (selectedCategories.length < 5) {
        setSelectedCategories([...selectedCategories, id]);
        setError("");
      } else {
        setError("※Please select 5 quizzes : クイズは5つ選択してください");
      }
    }
  };

  const handleSaveQuiz = async () => {
    if (selectedCategories.length !== 5) {
      setError("※Please select 5 quizzes : クイズは5つ選択してください");
      return;
    }

    setIsSaving(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 4; // 約25秒で100%に到達
      });
    }, 1000);
    

    const selectedQuizzes = { selected_quizzes: selectedCategories };

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("ERROR:もう一度ログインしてください");
        setIsSaving(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/save_quiz",
        selectedQuizzes,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("OK！: クイズを保存しました");
      navigate('/Chat');
    } catch (error) {
      console.error("ERROR:", error);
      setError("ERROR : もう一度お試しください");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "30px",
        width: "90%",
        maxWidth: "400px",
        margin: "50px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "20px", marginBottom: "15px" }}>Quiz Select</h1>
      <p style={{ fontSize: "14px", color: "#555" }}>Please select 5 quizzes</p>
      <div style={{ margin: "20px 0" }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            style={{
              display: "block",
              margin: "5px 0",
              padding: "10px",
              width: "100%",
              backgroundColor: selectedCategories.includes(category.id) ? "#FFA500" : "#FFF",
              border: "2px solid #FFA500",
              borderRadius: "8px",
              color: selectedCategories.includes(category.id) ? "#FFF" : "#FFA500",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      {isSaving && (
        <div style={{ margin: "20px 0", width: "100%", height: "10px", backgroundColor: "#ccc" }}>
          <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "#4CAF50", transition: "width 1s" }}></div>
        </div>
      )}
      {error && (
        <p style={{ textAlign: "center", color: "#FF0000", marginTop: "15px", fontSize: "12px" }}>
          {error}
        </p>
      )}
      <button
        onClick={handleSaveQuiz}
        disabled={isSaving}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: isSaving ? "#ccc" : "#4CAF50",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: isSaving ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {isSaving ? "Saving quizzes now..." : "Save quizzes"}
      </button>
    </div>
  );
};

export default Quiz2;
