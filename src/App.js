import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
import NotesPage from './NotesPage/Notes'; // Import the Notes component
import Homework from './Homework';
import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';
import TeacherHomework from './TeacherPages/TeacherHomework';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} /> {/* Notes route */}
        <Route path="/Signup" element={<SignUp />} /> {/* SignIn is the first page */}
        <Route path="/Signin" element={<Signin />} /> {/* Notes route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Main dashboard route */}
        <Route path="/Marks" element={<Marks />} /> {/* Marks route */}
        <Route path="/NotesPage/Notes" element={<NotesPage />} /> {/* Notes route */}
        <Route path="/homework" element={<Homework />} /> {/* Homework route */}
        <Route path="/teacher/homework" element={<TeacherHomework />} /> {/* Teacher homework route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;


