import React, { useState } from 'react';
import axios from 'axios';

// This is the AddCourse component for adding a new course
const AddCourse = () => {
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // This block is Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseId === '' || courseName === '') {
      setError('All fields are required!');
      return;
    }

    // This is to make a POST request to add the new course
    axios.post('http://20.205.16.84:9999/courses', {
      id: courseId,
      name: courseName
    })
    .then(response => {
      setSuccess('Course added successfully!');
      setError('');
      setCourseId('');
      setCourseName('');
    })
    .catch(error => {
      setError('There was an error adding the course.');
      setSuccess('');
    });
  };

  return (
    <div className="container add-course">
      <h1>Add Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course ID:</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddCourse;
