import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
import NotesPage from './NotesPage/Notes'; // Import the Notes component
import Homework from './Homework';
import MarksPages from './MarksPages/MarksPages';
import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} /> {/* SignIn is the first page */}
        <Route path="/Signin" element={<Signin />} /> {/* Notes route */}
        <Route path="/WelcomeScreen" element={<WelcomeScreen />} /> {/* Notes route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Main dashboard route */}
        <Route path="/NotesPage/Notes" element={<NotesPage />} /> {/* Notes route */}
        <Route path="/MarksPages/MarksPages" element={<MarksPages />} /> {/* Marks route */}
        <Route path="/homework" element={<Homework />} /> {/* Homework route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;


