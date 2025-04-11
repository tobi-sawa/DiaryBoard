import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupsPage = () => {
  const [groupName, setGroupName] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [age, setAge] = useState("1"); // 初期値: 小学1年生
  const [memberCount, setMemberCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const country_map = [
    "Japan", "United States", "Portugal", "Spain", "China", "Taiwan", 
    "South Korea", "Philippines", "Vietnam", "Indonesia", "Nepal", 
    "France", "Germany", "Italy", "Russia", "India", "Brazil", "Mexico", 
    "Turkey", "Australia", "Peru",
  ];

  // 年齢を学年ラベルに変換
  const getGradeLabel = (age) => {
    if (age >= 1 && age <= 6) {
      return `Elementary${age}`;
    } else if (age >= 7 && age <= 9) {
      return `Junior${age - 6}`;
    } else if (age === 10) {
      return "Other";
    }
    return "";
  };

  const handleCountryChange = (e) => {
    const value = e.target.value;
    setSelectedCountries((prev) =>
      prev.includes(value) ? prev.filter((country) => country !== value) : [...prev, value]
    );
  };

  const handleCreateGroup = async () => {
    try {
      const gradeLabel = getGradeLabel(Number(age));

      const teamData = {
        team_name: groupName,
        team_id: invitePassword,
        country: selectedCountries,
        age: gradeLabel, // 学年ラベル
        member_count: memberCount,
      };

      console.log("送信するデータ:", teamData);

      const response = await axios.post('http://localhost:8000/team_register', teamData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/teacher_startpage");
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("ERROR occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  const handleGoBack = () => {
    navigate("/teacher_startpage");
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #FFA500, #4CAF50)",
      color: "#fff",
      padding: "40px",
      width: "600px",
      margin: "50px auto",
      borderRadius: "15px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    },
    input: {
      width: "90%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      margin: "10px 0",
    },
    select: {
      width: "95%",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      margin: "10px 0",
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
    checkboxGroup: {
      textAlign: "left",
      marginBottom: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Team create</h2>

      <div>
        <label htmlFor="groupName" style={{ display: "block", marginBottom: "10px" }}>
          Team name
        </label>
        <input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={styles.input}
        />
      </div>

      <div>
        <label htmlFor="invitePassword" style={{ display: "block", marginBottom: "10px" }}>
          Invite password
        </label>
        <input
          id="invitePassword"
          type="password"
          value={invitePassword}
          onChange={(e) => setInvitePassword(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.checkboxGroup}>
        <label htmlFor="country" style={{ display: "block", marginBottom: "10px" }}>
          Country
        </label>
        {country_map.map((country) => (
          <div key={country}>
            <input
              type="checkbox"
              value={country}
              checked={selectedCountries.includes(country)}
              onChange={handleCountryChange}
              id={country}
            />
            <label htmlFor={country} style={{ marginLeft: "8px" }}>
              {country}
            </label>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="age" style={{ display: "block", marginBottom: "10px" }}>
          Age
        </label>
        <select
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.select}
        >
          {[
            "1", "2", "3", "4", "5", "6", // 小学1年生から6年生
            "7", "8", "9", // 中学1年生から3年生
            "10", // Other
          ].map((ageOption) => (
            <option key={ageOption} value={ageOption}>
              {ageOption === "10" ? "Other" : ageOption < 7 ? `Element${ageOption}` : `Junior${ageOption - 6}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="memberCount" style={{ display: "block", marginBottom: "10px" }}>
          Member count
        </label>
        <input
          id="memberCount"
          type="number"
          value={memberCount}
          onChange={(e) => setMemberCount(Number(e.target.value))}
          style={styles.input}
        />
      </div>

      {successMessage && <div style={{ color: "green", marginBottom: "10px" }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}

      <button onClick={handleGoBack} style={{ ...styles.button, backgroundColor: "#4CAF50" }}>
        ◀ Back
      </button>

      <button onClick={handleCreateGroup} style={styles.button}>
        New！🆕
      </button>
    </div>
  );
};

export default GroupsPage;
