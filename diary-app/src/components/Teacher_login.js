import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Teacher_login = () => {
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // フォーム送信の処理
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '') {
            setError('ERROR: パスワードを入力してください');
            setSuccess('');
            return;
        }

        // POSTリクエストを送信
        axios.post('http://localhost:8000/teacher_login',
            {password: password},
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(response => {
                if (response.data.message === "Successful") {
                    setSuccess('OK! ログインに成功しました！');
                    setError('');
                    navigate('/teacher_startpage');  // ログイン成功後に/teacher_startpageに遷移
                } else {
                    setError('ERROR: パスワードが違います');
                    setSuccess('');
                }
            })
            .catch(error => {
                setError('ERROR: ログインに失敗しました');
                setSuccess('');
            });
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
                backgroundColor: "#FFF",
            }}
        >
            <button
                onClick={() => navigate('/StartPage')}
                style={{
                    padding: "10px 10px",
                    backgroundColor: "#007BFF",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    backgroundColor: "#4CAF50", // 緑色
                    marginBottom: "20px",
                    transition: "background-color 0.3s",
                    textAlign: "left", // 左寄せ
                    display: "block",
                }}
            >
                ◀ Back
            </button>
            <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Administrator Login</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "16px", display: "block", marginBottom: "8px", color: "#555" }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: "80%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            fontSize: "16px",
                        }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                    <button
                        type="submit"
                        style={{
                            width:"80%",
                            padding: "10px",
                            backgroundColor: "#4CAF50",
                            backgroundColor: "#FF9800", // オレンジ色
                            color: "#FFF",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "20px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            flex: "1",
                            margin: "5 5px",
                        }}
                    >
                        Go！🚀
                    </button>
                </div>
            </form>
            {success && <p style={{ color: "green", marginTop: "20px" }}>{success}</p>}
            {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
        </div>
    );
};

export default Teacher_login;
