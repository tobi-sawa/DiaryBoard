import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [teamId, setTeamId] = useState('');
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [teamError, setTeamError] = useState('');
  const [userError, setUserError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
  
    // エラーステートをリセット
    setTeamError('');
    setUserError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setSuccess('');
  
    // 入力チェック
    if (!teamId) {
      setTeamError("チームIDが必要です！");
      return;
    }
  
    if (!userId) {
      setUserError("ユーザーIDが必要です！");
      return;
    }
  
    if (!newPassword) {
      setPasswordError("新しいパスワードが必要です！");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("パスワードが一致しません！");
      return;
    }
  
    try {
      const response = await axios.put('http://localhost:8000/reset_password', {
        team_id: teamId,
        user_id: userId,
        new_password: newPassword,
      });
  
      if (response.status === 200) {
        setSuccess("OK！パスワードを変更しました！");
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error("ERROR:", error.response?.data); // デバッグ用ログ
  
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.detail || "パスワードのリセットに失敗しました";
  
      if (statusCode === 404) {
        setTeamError("No Team ID : チームIDが見つかりません");
      } else if (statusCode === 400) {
        setUserError("No User ID : ユーザーIDが見つかりません");
      } else {
        setPasswordError(errorMessage);
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "40px",
        width: "400px",
        margin: "50px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        backgroundColor: "#FFF",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>New Password ✨</h1>
  
      <form onSubmit={handlePasswordReset}>
        {/* Team ID 入力欄 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", display: "block", marginBottom: "8px", color: "#555" }}>
            Team ID:
          </label>
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
          {teamError && <p style={{ color: "red", fontSize: "14px" }}>{teamError}</p>}
          
        </div>
  
        {/* User ID 入力欄 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", display: "block", marginBottom: "8px", color: "#555" }}>
            User ID:
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
          {userError && <p style={{ color: "red", fontSize: "14px" }}>{userError}</p>}
        </div>
  
        {/* New Password 入力欄 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", display: "block", marginBottom: "8px", color: "#555" }}>
            New Password:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
          {passwordError && <p style={{ color: "red", fontSize: "14px" }}>{passwordError}</p>}
        </div>
  
        {/* Confirm New Password 入力欄 */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "16px", display: "block", marginBottom: "8px", color: "#555" }}>
            Confirm New Password:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          />
          {confirmPasswordError && <p style={{ color: "red", fontSize: "14px" }}>{confirmPasswordError}</p>}
        </div>
  
        {/* Reset Password ボタン */}
        <button
          type="submit"
          style={{
            padding: "12px 25px",
            backgroundColor: "#FFA500",
            color: "#FFF",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          New Password！🆕
        </button>
      </form>
  
      {success && <p style={{ color: "green", marginTop: "20px" }}>{success}</p>}
  
      {/* Back ボタン */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          border: "1px solid #4caf50",
          borderRadius: "5px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ◀ Back
      </button>
    </div>
  );
};

export default ResetPassword;
