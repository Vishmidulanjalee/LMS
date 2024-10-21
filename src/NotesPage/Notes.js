import React from 'react';
import { Link } from 'react-router-dom';
import './NotesPage.css';
const Notes = () => {
  const notes = [
    { title: 'English Grammar Basics', date: '12/08/2024', institution: 'SVAITHA Institute' },
    { title: 'English Grammar Basics', date: '13/08/2024', institution: 'SYASA Institute' },
    { title: 'English Grammar Basics', date: '14/08/2024', institution: 'The BEE Academy' },
    { title: 'English Grammar Basics', date: '15/08/2024', institution: 'OMNI Institute' },
    { title: 'English Grammar Basics', date: '16/08/2024', institution: 'My Online School' },
    { title: 'English Grammar Basics', date: '18/08/2024', institution: 'The BEE Academy' },
  ];

  return (
    <div className="notes-page-container">
      <aside className="sidebar">
        <div className="logo"> 
          <img src="path_to_logo" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <Link to="/notes" className="nav-link active">Notes</Link>
          <Link to="/homework" className="nav-link">Homework</Link>
          <Link to="/marks" className="nav-link">Marks</Link>
          <Link to="/other" className="nav-link">Other</Link>
        </nav>
        <div className="logout">
          <button className="logout-button">Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Grade 6</h2>
          <h1>Notes</h1>
        </header>

        <section className="notes-grid">
          {notes.map((note, index) => (
            <div className="note-card" key={index}>
              <h3>{note.title}</h3>
              <p>{note.institution}</p>
              <p>{note.date}</p>
              <div className="card-icons">
                <span className="view-icon">👁️</span>
                <span className="download-icon">⬇️</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="profile-picture">
        <img src="path_to_profile_pic" alt="User" />
      </div>
    </div>
  );
};

export default Notes;
