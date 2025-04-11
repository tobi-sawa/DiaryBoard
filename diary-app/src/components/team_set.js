import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamSetting = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [age, setAge] = useState("1");
  const navigate = useNavigate();

  const countryOptions = [
    "Japan", "United States", "Portugal", "Spain", "China", "Taiwan",
    "South Korea", "Philippines", "Vietnam", "Indonesia", "Nepal",
    "France", "Germany", "Italy", "Russia", "India", "Brazil", "Mexico",
    "Turkey", "Australia", "Peru"
  ];

  const getGradeLabel = (age) => {
    if (age >= 1 && age <= 6) return `Elementary ${age}`;
    if (age >= 7 && age <= 9) return `Junior ${age - 6}`;
    if (age === 10) return "Other";
    return "";
  };

  const handleCountryChange = (event) => {
    const value = event.target.value;
    setSelectedCountries(prev =>
      prev.includes(value) ? prev.filter(country => country !== value) : [...prev, value]
    );
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const updateTeamSettings = async () => {
    const gradeLabel = getGradeLabel(parseInt(age));
    try {
      const token = localStorage.getItem("access_token");
      const updateResponse = await axios.put(
        "http://localhost:8000/change_team_set",
        { country: selectedCountries, age: gradeLabel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(updateResponse.data.message);
      navigate("/teacher_page");
    } catch (error) {
      console.error("チーム設定更新中にエラーが発生しました:", error);
      alert(error.response?.data?.detail || "ERROR");
    }
  };

  const handleBack = () => {
    navigate("/Teacher_page");
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #FFA500, #4CAF50)",
      color: "#fff",
      padding: "20px",
      width: "90%",
      maxWidth: "400px",
      margin: "30px auto",
      borderRadius: "15px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    },
    checkboxGroup: {
      textAlign: "left",
      marginBottom: "20px",
      display: "block",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
    },
    checkboxLabel: {
      marginLeft: "8px",
    },
    select: {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "8px",
      margin: "10px 0",
    },
    button: {
      padding: "12px 20px",
      width: "100%",
      backgroundColor: "#FFA500",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      margin: "5px 0",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Team Settings</h2>

      <div style={styles.checkboxGroup}>
        <label style={{ display: "block", marginBottom: "10px" }}>Country</label>
        {countryOptions.map((country) => (
          <div key={country} style={styles.checkboxContainer}>
            <input
              type="checkbox"
              value={country}
              checked={selectedCountries.includes(country)}
              onChange={handleCountryChange}
              id={country}
            />
            <label htmlFor={country} style={styles.checkboxLabel}>
              {country}
            </label>
          </div>
        ))}
      </div>

      <div>
        <label style={{ marginBottom: "10px", display: "block" }}>Age</label>
        <select value={age} onChange={handleAgeChange} style={styles.select}>
          {[...Array(10).keys()].map(i => (
            <option key={i} value={i + 1}>
              {getGradeLabel(i + 1)}
            </option>
          ))}
          <option value="10">Other</option>
        </select>
      </div>
      <button onClick={handleBack} style={{ ...styles.button, backgroundColor: "#4CAF50" }}>
        ◀ Back
      </button>
      <button onClick={updateTeamSettings} style={styles.button}>
        New！🆕
      </button>
    </div>
  );
};

export default TeamSetting;