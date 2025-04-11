import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import JSZip from "jszip";

const Answer3= () => {
  const { diaryId } = useParams();
  const [sameQuiz, setSameQuiz] = useState();
  const [differentQuiz, setDifferentQuiz] = useState();
  const [judgement, setJudgement] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [correctChoice, setCorrectChoice] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const sameQuizResponse = await axios.get(`http://localhost:8000/get_same_quiz/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSameQuiz(sameQuizResponse.data.quizzes[2]);

      const differentQuizResponse = await axios.get(`http://localhost:8000/get_different_quiz/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDifferentQuiz(differentQuizResponse.data.quizzes[2]);

      const judgementResponse = await axios.get(`http://localhost:8000/get_judgement3/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJudgement(judgementResponse.data.judgement);
      setSelectedChoice(judgementResponse.data.selected_choice);
      setCorrectChoice(judgementResponse.data.correct_choice);

      await fetchAudio();
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  const fetchAudio = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://localhost:8000/get_quiz_audio3/${diaryId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "arraybuffer",
      });

      const zip = await JSZip.loadAsync(response.data);
      const audioFilePromises = [];
      zip.forEach((relativePath, file) => {
        const filePromise = file.async("blob").then((blob) => {
          return { name: relativePath, url: URL.createObjectURL(blob) };
        });
        audioFilePromises.push(filePromise);
      });

      const audioFilesArray = await Promise.all(audioFilePromises);
      setAudioFiles(audioFilesArray);
    } catch (err) {
      console.error("ERROR", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [diaryId]);

  const handleSubmit = () => {
    navigate(`/Question4/${diaryId}`);
  };

  if (!sameQuiz || !differentQuiz || audioFiles.length === 0) {
    return <div>Loading...</div>;
  }

  const mergedChoices = [];
  const sameChoices = Object.entries(sameQuiz.choices);
  const differentChoices = Object.entries(differentQuiz.choices);
  const maxLength = Math.max(sameChoices.length, differentChoices.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < sameChoices.length) mergedChoices.push({ key: sameChoices[i][0], text: sameChoices[i][1], type: "same" });
    if (i < differentChoices.length) mergedChoices.push({ key: differentChoices[i][0], text: differentChoices[i][1], type: "different" });
  }

  const getChoiceStyle = (choice) => {
    if (selectedChoice && correctChoice) {
      if (selectedChoice.toUpperCase() === choice.key.toUpperCase()) {
        return { backgroundColor: "#4CAF50", color: "#fff" };
      }
      if (choice.key.toUpperCase() === correctChoice.toUpperCase()) {
        return { backgroundColor: "#F44336", color: "#fff" };
      }
    }
    return {};
  };

  const playAudio = (choiceKey) => {
    const audioName = `${choiceKey}.mp3`;
    const file = audioFiles.find(file => file.name === audioName);
    if (file) {
      const audio = new Audio(file.url);
      audio.play();
    } else {
      console.error(`Audio file not found: ${audioName}`);
    }
  };

  return (
    <div style={styles.container}>
      {judgement !== null && (
        <div
          style={{
            ...styles.judgement,
            color: "#fff",
          }}
        >
          <h2>{judgement ? "⭕" : "❌"}</h2>
        </div>
      )}
      {sameQuiz && (
        <h3>Q3 <u>{sameQuiz.question}</u></h3>
      )}
      <div style={styles.options}>
        {mergedChoices.map((choice, index) => (
          <div
            key={index}
            style={{
              ...styles.option,
              ...getChoiceStyle(choice),
            }}
          >
            <p>{choice.key.toUpperCase()}. {choice.text}</p>
            {index % 2 === 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); playAudio(choice.key); }}
                style={styles.audioButton}
              >
                Voice 🗣️
              </button>
            )}
          </div>
        ))}
      </div>
      {selectedChoice && (
        <div style={styles.resultBox}>
          <p><strong>Your Select:</strong> {selectedChoice.toUpperCase()}</p>
          <p><strong>Correct:</strong> {correctChoice}</p>
        </div>
      )}
      <button onClick={handleSubmit} style={styles.submitButton}>
        Next!!!
      </button>
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
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  audioButton: {
    marginLeft: "10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#FFA500",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  },
  judgement: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#E0F7FA",
    textAlign: "center",
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: "30px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    padding: "15px 30px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Answer3;
