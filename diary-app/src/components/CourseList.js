
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This block shows CourseList component for displaying the list of courses
// They are state to store course data, manage loading indicator, and state to manage error messages.
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // this block is useEffect hook to fetch courses when the component mounts
  useEffect(() => {
    axios.get('http://20.205.16.84:9999/courses')
      .then(response => {
        setCourses(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was an error fetching the courses.');
        setLoading(false);
      });
  }, []);

  // It displays loading message if data is still being fetched
  if (loading) {
    return <div className="container course-list"><h1>Course List</h1><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="container course-list"><h1>Course List</h1><p>{error}</p></div>;
  }

  // It displays the list of courses if data is successfully fetched
  return (
    <div className="container course-list">
      <h1>Course List</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>{course.id}: {course.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
