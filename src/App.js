import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
import NotesPage from './NotesPage/Notes';// Import the Notes component
import MarksPages from './MarksPages/MarksPages';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Main dashboard route */}
       <Route path="/NotesPage/Notes" element={<NotesPage />} /> {/* Notes route */}
        <Route path="/MarksPages/MarksPages" element={<MarksPages />} /> {/* Marks route */}
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

