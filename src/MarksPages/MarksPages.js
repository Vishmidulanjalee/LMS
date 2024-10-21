import React from 'react';
import { Link } from 'react-router-dom';
import './MarksPages.css'; // Import your custom styles here

const MarksPage = () => {
  const marks = [
    { fileName: 'Grammer_test_marks.pdf' },
    { fileName: 'Grammer_test_marks.pdf' },
    { fileName: 'Grammer_test_marks.pdf' },
    { fileName: 'Grammer_test_marks.pdf' },
  ];

  return (
    <div className="marks-page-container">
      <aside className="sidebar">
        <div className="logo"> 
          <img src="path_to_logo" alt="Logo" />
        </div>
        <nav className="nav-menu">
          <Link to="/notes" className="nav-link">Notes</Link>
          <Link to="/homework" className="nav-link">Homework</Link>
          <Link to="/marks" className="nav-link active">Marks</Link>
          <Link to="/other" className="nav-link">Other</Link>
        </nav>
        <div className="logout">
          <button className="logout-button">Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <h2>Grade 6</h2>
          <h1>Marks</h1>
        </header>

        <section className="marks-grid">
          {marks.map((mark, index) => (
            <div className="mark-card" key={index}>
              <img src="path_to_pdf_icon" alt="PDF Icon" className="pdf-icon" />
              <p>{mark.fileName}</p>
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

export default MarksPage;
