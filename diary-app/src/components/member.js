import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Member = () => {
    const [users, setUsers] = useState([]);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/get_all_user");
            const userData = response.data.users;
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleTeamDetails = (teamId) => {
        setExpandedTeam(expandedTeam === teamId ? null : teamId);
    };

    const toggleUserDetails = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    const groupedUsers = users.reduce((acc, user) => {
        if (!acc[user.team_id]) {
            acc[user.team_id] = [];
        }
        acc[user.team_id].push(user);
        return acc;
    }, {});

    return (
        <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <button onClick={() => navigate('/teacher_startpage')} style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#FFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}>
              ◀ Back
            </button>

            <div style={{ width: "100%", maxWidth: "600px", marginTop: "50px" }}>
                <h1>Members</h1>
                {Object.entries(groupedUsers).map(([teamId, teamUsers]) => (
                    <div key={teamId} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", marginBottom: "10px", width: "100%" }}>
                        <div
                            onClick={() => toggleTeamDetails(teamId)}
                            style={{
                                cursor: 'pointer',
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "5px",
                                backgroundColor: "#d3d3d3"
                            }}
                        >
                            <span>Team ID: {teamId}</span>
                            <span>{expandedTeam === teamId ? "▲" : "▼"}</span>
                        </div>
                        {expandedTeam === teamId && (
                            <ul style={{ padding: 0, listStyleType: "none" }}>
                                {teamUsers.map((user) => (
                                    <li key={user.user_id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px", marginBottom: "10px", width: "100%" }}>
                                        <div
                                            onClick={() => toggleUserDetails(user.user_id)}
                                            style={{
                                                cursor: 'pointer',
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "5px",
                                                backgroundColor: "#f0f0f0"
                                            }}
                                        >
                                            <span>{user.is_admin === 1 ? "Teacher" : "Student"}: {user.user_id}</span>
                                            <span>username: {user.name}</span>

                                            <span>{expandedUser === user.user_id ? "▲" : "▼"}</span>
                                        </div>
                                        {expandedUser === user.user_id && (
                                            <div style={{ padding: "10px", backgroundColor: "#e6f7ff", border: "1px solid #4CAF50", borderRadius: "5px", marginTop: "5px" }}>
                                                <p>Password: {user.password}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Member;
