import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
<<<<<<< HEAD
import NotesPage from './NotesPage/Notes';// Import the Notes component
import MarksPages from './MarksPages/MarksPages';
=======
import Notes from './Notes'; // Import the Notes component
import Homework from './Homework';
>>>>>>> 93bcce296cb0200ff97083aac46668367d0c15f3


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Main dashboard route */}
<<<<<<< HEAD
       <Route path="/NotesPage/Notes" element={<NotesPage />} /> {/* Notes route */}
        <Route path="/MarksPages/MarksPages" element={<MarksPages />} /> {/* Marks route */}
=======
        <Route path="/notes" element={<Notes />} /> {/* Notes page route */}
        <Route path="/homework" element={<Homework />} /> {/* Notes page route */}
        
>>>>>>> 93bcce296cb0200ff97083aac46668367d0c15f3
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

