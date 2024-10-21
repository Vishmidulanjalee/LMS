import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import logo from './assets/beelogo.png';
import notesIcon from './assets/notes.png'; // Import the notes icon
import homeworkIcon from './assets/homework.png'; // Import the homework icon
import marksIcon from './assets/marks.png'; // Import the marks icon
import otherIcon from './assets/other.png'; // Import the other icon 


const Homework = () => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(today.getDate() + 3); // Set due date to 3 days after today

  const homeworkData = [
    { id: 1, title: 'Creative Writing: A day in a magical forest', submissionLink: 'https://submission-link1.com', pdfLink: '/pdf/homework1.pdf' },
    { id: 2, title: 'Creative Writing: A day in a magical forest', submissionLink: 'https://submission-link2.com', pdfLink: '/pdf/homework2.pdf' },
  ].map(hw => ({ ...hw, dueDate: dueDate.toLocaleDateString() })); // Add dueDate to each homework object

  const containerStyle = {
    display: 'flex',
    height: '100vh',
  };

  const contentStyle = {
    flex: 1,
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const thStyle = {
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
  };

  const tdStyle = {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
  };

  const pdfBoxStyle = {
    width: '150px',
    height: '150px',
    border: '1px solid #ddd',
    overflow: 'hidden',
    position: 'relative',
  };

  const downloadLinkStyle = {
    display: 'block',
    textAlign: 'center',
    marginTop: '5px',
    fontSize: '14px',
    color: '#007BFF',
    textDecoration: 'none',
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="nav-menu">
          <Link to="/notes" className="nav-link">
            <img src={notesIcon} alt="Notes" style={{ width: '20px', marginRight: '8px' }} /> 
            Notes
          </Link>
          <Link to="/homework" className="nav-link active">
            <img src={homeworkIcon} alt="Homework" style={{ width: '20px', marginRight: '8px' }} /> 
            Homework
          </Link>
          <Link to="/marks" className="nav-link">
            <img src={marksIcon} alt="Marks" style={{ width: '20px', marginRight: '8px' }} /> 
            Marks
          </Link>
          <Link to="/other" className="nav-link">
            <img src={otherIcon} alt="Other" style={{ width: '20px', marginRight: '8px' }} /> 
            Other
          </Link>
        </nav>
        <div className="logout">
          <button className="logout-button">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={contentStyle}>
        <h2>Homework</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Homework</th>
              <th style={thStyle}>PDF</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Submission Link</th>
            </tr>
          </thead>
          <tbody>
            {homeworkData.map((hw) => (
              <tr key={hw.id}>
                <td style={tdStyle}>{hw.title}</td>
                <td style={tdStyle}>
                  <div style={pdfBoxStyle}>
                    <embed src={hw.pdfLink} width="100%" height="100%" type="application/pdf" />
                    <a href={hw.pdfLink} download style={downloadLinkStyle}>Download PDF</a>
                  </div>
                </td>
                <td style={tdStyle}>{hw.dueDate}</td>
                <td style={tdStyle}>
                  <a href={hw.submissionLink} target="_blank" rel="noopener noreferrer">Submit here</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Internal CSS for Sidebar */}
      <style jsx="true">
        {`
          .sidebar {
            width: 250px;
            background-color: #ffffff;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 10vh;
          }

          .logo img {
            width: 80%;
            height: auto;
        
          }

          .nav-menu {
            margin-top: 1px; /* Adjusted to move it higher */
          }

          .nav-link {
            display: block;
            margin-bottom: 15px;
            font-size: 18px;
            color: #333;
            text-decoration: none;
            padding: 10px 15px;
          }

          .nav-link.active {
            background-color: #F3C623;
            border-radius: 10px;
          }

          .logout {
            margin-top: 10px; /* Adjusted to move it higher */
          }

          .logout-button {
            width: 100%; /* Increased width to 100% */
            background-color: #000000;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 80px;
          }
        `}
      </style>
    </div>
  );
};

export default Homework;


