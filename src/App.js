import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
import Notes from './Notes'; // Import the Notes component
import Homework from './Homework';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Main dashboard route */}
        <Route path="/notes" element={<Notes />} /> {/* Notes page route */}
        <Route path="/homework" element={<Homework />} /> {/* Notes page route */}
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;

