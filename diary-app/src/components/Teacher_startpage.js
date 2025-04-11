import React from 'react';
import { useNavigate } from 'react-router-dom';

const Teacher_startpage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255, 165, 0, 0.8), rgba(76, 175, 80, 0.8))",
      color: "#fff",
      padding: "20px",
      width: "90%",
      maxWidth: "400px",
      margin: "50px auto",
      borderRadius: "15px",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
    }}>
      <button onClick={() => navigate('/StartPage')} style={{
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "#FFF",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        marginBottom: "20px",
        transition: "background-color 0.3s",
        textAlign: "left",
        display: "block",
      }}>
        ◀ Back
      </button>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Welcome to the Registration Page</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
        <button onClick={() => navigate('/newlogin')} style={{
          padding: "15px",
          backgroundColor: "#FFA500",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}>
          Student🆕
        </button>
        <button onClick={() => navigate('/Teacher_newlogin')} style={{
          padding: "15px",
          backgroundColor: "#FFA500",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}>
          Teacher🆕
        </button>
        <button onClick={() => navigate('/register')} style={{
          padding: "15px",
          backgroundColor: "#FFA500",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}>
          Team👥
        </button>
        <button onClick={() => navigate('/member')} style={{
          padding: "15px",
          backgroundColor: "#FFA500",
          color: "#FFF",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}>
          Member
        </button>
      </div>
    </div>
  );
};

export default Teacher_startpage;