import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizCategorySelector = () => {
  const categories = [
    { id: 1, label: "culture(ぶんか)" },
    { id: 2, label: "language（ことば)" },
    { id: 3, label: "number(すうじ)" },
    { id: 4, label: "myself(じぶん)" },
    { id: 5, label: "geography(ちり)" },
    { id: 6, label: "history(れきし)" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((category) => category !== id));
    } else {
      if (selectedCategories.length < 2) {
        setSelectedCategories([...selectedCategories, id]);
        setError("");
      } else {
        setError("You can select up to 2 categories. : カテゴリを2つ選択してください。");
      }
    }
  };

  const handleQuizStart = async () => {
    if (selectedCategories.length !== 2) {
      setError("Please select 2 categories.");
      return;
    }

    setIsLoading(true);
    setError("");

    const newQuizRequest = {
      category1: Number(selectedCategories[0]),
      category2: Number(selectedCategories[1]),
    };

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("Please log in again.: もう一度ログインしてください。");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/generate_quiz",
        newQuizRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`OK！: クイズを作成しました${selectedCategories.join(", ")}`);
      navigate("/Quiz2");
    } catch (error) {
      console.error("ERROR:", error);

      if (error.response) {
        setError(`ERROR: ${error.response.data.error || error.response.data.message}`);
      } else {
        setError(`ERROR: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "40px",
        width: "350px",
        margin: "50px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>QUIZ ✅ </h1>
      <p style={{ fontSize: "16px", color: "#555" }}>
        <strong></strong>Select 2 categories for the quiz.
      </p>
      <div style={{ margin: "20px 0" }}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelect(category.id)}
            disabled={isLoading}
            style={{
              display: "block",
              margin: "10px auto",
              padding: "15px",
              width: "80%",
              backgroundColor: selectedCategories.includes(category.id) ? "#FFA500" : "#FFF",
              border: "2px solid #FFA500",
              borderRadius: "8px",
              color: selectedCategories.includes(category.id) ? "#FFF" : "#FFA500",
              fontSize: "16px",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s, color 0.3s",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleQuizStart}
        disabled={isLoading}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          backgroundColor: isLoading ? "#ccc" : "#FFA500",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {isLoading ? "Making Quiz now..." : "Make Quiz！"}
      </button>
      {error && (
        <p style={{ textAlign: "center", color: "#FF0000", marginTop: "20px", fontSize: "14px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default QuizCategorySelector;
