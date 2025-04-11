import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Teacher_page = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [openUserId, setOpenUserId] = useState(null);
    const navigate = useNavigate();
    const tokenRef = useRef(localStorage.getItem("authToken") || null);

    const fetchUsers = async () => {
        if (!tokenRef.current) return;

        try {
            const response = await axios.get("http://localhost:8000/get_student_inf", {
                headers: { Authorization: `Bearer ${tokenRef.current}` },
            });

            const userData = response.data;
            setTeachers(userData.filter(user => user.is_admin));
            setStudents(userData.filter(user => !user.is_admin));
        } catch (error) {
            console.error("Error fetching users:", error);
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
                const response = await axios.post("http://localhost:8000/verify_token", {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.valid) {
                    fetchUsers();
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

    const toggleAccordion = (userId) => {
        setOpenUserId(openUserId === userId ? null : userId);
    };

    const UserList = ({ title, users }) => (
        <div style={{ marginTop: "20px" }}>
            <h3 style={{ textAlign: "center", color: users.length > 0 ? "black" : "#777" }}>
                {title} ({users.length})
            </h3>
            {users.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>No User</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {users.map((user) => (
                        <div key={user.user_id} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <div
                                style={{
                                    padding: "12px",
                                    backgroundColor: "#ffcc30",
                                    border: "1px solid #ffb74d",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                    cursor: "pointer",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "5px",
                                }}
                                onClick={() => toggleAccordion(user.user_id)}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "14px", color: "#555" }}>{user.user_id}</span>
                                        <span style={{ fontSize: "18px", color: "black", fontWeight: "bold" }}>
                                            {user.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/Diary_and_Quiz/${user.user_id}`);
                                        }}
                                        style={{
                                            padding: "5px 15px",
                                            backgroundColor: "#4caf50",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Diary & Quiz
                                    </button>
                                </div>
                            </div>
                            {openUserId === user.user_id && (
                                <div
                                    style={{
                                        padding: "8px",
                                        backgroundColor: "#f9f9f9",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        marginTop: "5px",
                                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <p><strong>Quiz Count:</strong> {user.answer_count}</p>
                                    <p><strong>Diary Count:</strong> {user.diary_count}</p>
                                    <p><strong>Nickname:</strong> {user.nickname || "None"}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: "15px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center" }}>Teacher Page</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={() => navigate("/Chat")}
                    style={{
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
                <button
                    onClick={() => navigate("/team_set")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#FFA500",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Team Settings
                </button>
            </div>

            {/* 教員リスト */}
            <UserList title="Teacher" users={teachers} />

            {/* 生徒リスト */}
            <UserList title="Students" users={students} />
        </div>
    );
};

export default Teacher_page;