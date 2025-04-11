import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// This is the AddCourse component for adding a new course
const Login = () => {
  const[teamId,setTeamId] = useState('')
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // This block is Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId === '' || password === '') {
      setError('All fields are required!');
      return;
    }

    // This is to make a POST request to add the new course

    axios.post('http://localhost:8000/token', 
      new URLSearchParams({
        team_id: teamId,
        username: userId,
        password: password
      }), 
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
      .then(response => {
        if (response.data.access_token) {
          setSuccess('Login successfully!');
          setError('');
          navigate('/Chat'); // Redirect to home page on successful login
        } else {
          setError('Login failed. Invalid credentials.');
          setSuccess('');
        }

    })
    .catch(error => {
      setError('You can not log in');
      setSuccess('');
    });
  };

  return (
    <div className="container add-course">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Team ID:</label>
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
