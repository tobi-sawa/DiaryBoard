import React from 'react';
import './Profile.css'; // Import the CSS file for Profile component styles

// This block is a Profile component for displaying user profile information
const Profile = () => {
  return (
    <div className="container profile">
      <h1>Profile</h1>
      <p>Name: Ritsumei Taro</p>
      <p>Student ID: XXXXXXXXXX</p>
      <p>Ritsumeikan University, Information System Science and Engineering course student</p>
      <p>I was born in Japan. </p>
      <p>I speak English and Japanese. </p>
    </div>
  );
};

export default Profile;
