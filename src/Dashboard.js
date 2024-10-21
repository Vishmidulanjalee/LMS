import React, { useState, useEffect } from 'react';
import notesIcon from './assets/notes.png';
import homeworkIcon from './assets/homework.png';
import otherIcon from './assets/other.png';
import marksIcon from './assets/marks.png';
import image1 from './assets/img1.jpg'; 
import image2 from './assets/img2.jpg';
import image3 from './assets/img3.jpg';
import youtubeIcon from './assets/youtube.png'; 
import tiktokIcon from './assets/tiktok.png'; 
import facebookIcon from './assets/facebook.png';
 

function Dashboard() {
  const userName = "John Doe";
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const currentDate = `${day}/${month}/${year}`; 

  const images = [image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#ffffff',
    flexWrap: 'wrap', // Adjust for smaller screens
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // Two columns for larger screens
    marginTop: '20px',
    gap: '20px',
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Two cards per row
    gap: '20px',
  };

  // Media query for responsiveness
  const responsiveContainerStyle = {
    ...cardContainerStyle,
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr', // Stack cards for smaller screens
    },
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '140px',
    width: '90%', // Ensure the card takes full width in a row
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
  };

  const yellowCardStyle = {
    ...cardStyle,
    backgroundColor: '#F3C623',
  };

  const boxStyle = {
    backgroundColor: '#e0e0e0',
    padding: '0px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
  };

  const footerStyle = {
    textAlign: 'center',
    backgroundColor: '#edc842',
    borderTop: '1px solid #ddd',
    marginTop: '10px',
    padding: '4px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const [notesCardColor, setNotesCardColor] = useState('#fff');
  const [homeworkCardColor, setHomeworkCardColor] = useState('#fff');
  const [marksCardColor, setMarksCardColor] = useState('#fff');
  const [otherCardColor, setOtherCardColor] = useState('#fff');

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '40px', margin: '0' }}>Welcome Back, {userName}</h1>
          <p style={{ margin: '0' }}>{currentDate}</p>
        </div>
        <div>
          <img
            src="logo"
            alt="User Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        {/* Left Panel (Cards) */}
        <div style={responsiveContainerStyle}>
          {/* Notes Card */}
          <div
            style={{ ...yellowCardStyle, backgroundColor: notesCardColor }}
            onMouseEnter={() => setNotesCardColor('#F3C623')}
            onMouseLeave={() => setNotesCardColor('#fff')}
<<<<<<< HEAD
            onClick={() => window.location.href = './NotesPage/Notes'} // Navigate to notes page
=======
            onClick={() => window.location.href = '/notes'} 
>>>>>>> 93bcce296cb0200ff97083aac46668367d0c15f3
          >
            <img src={notesIcon} alt="Notes Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Notes</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Access important notes to help with your lessons</p>
          </div>

          {/* Homework Card */}
          <div
            style={{ ...cardStyle, backgroundColor: homeworkCardColor }}
            onMouseEnter={() => setHomeworkCardColor('#F3C623')}
            onMouseLeave={() => setHomeworkCardColor('#fff')}
            onClick={() => window.location.href = '/homework'}
          >
            <img src={homeworkIcon} alt="Homework Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Homework</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Review and submit your homework here</p>
          </div>

          {/* Marks Card */}
          <div
            style={{ ...cardStyle, backgroundColor: marksCardColor }}
            onMouseEnter={() => setMarksCardColor('#F3C623')}
            onMouseLeave={() => setMarksCardColor('#fff')}
<<<<<<< HEAD
            onClick={() => window.location.href = '/MarksPages/MarksPages'} // Navigate to marks page
=======
            onClick={() => window.location.href = '/marks'}
>>>>>>> 93bcce296cb0200ff97083aac46668367d0c15f3
          >
            <img src={marksIcon} alt="Marks Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Marks</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>View your latest marks and track progress</p>
          </div>

          {/* Other Card */}
          <div
            style={{ ...cardStyle, backgroundColor: otherCardColor }}
            onMouseEnter={() => setOtherCardColor('#F3C623')}
            onMouseLeave={() => setOtherCardColor('#fff')}
            onClick={() => window.location.href = '/other'}
          >
            <img src={otherIcon} alt="Other Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Other</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Explore additional resources and options</p>
          </div>
        </div>

        {/* Right Panel (Dynamic Image Slider) */}
        <div style={boxStyle}>
          <div style={{ height: '400px', overflow: 'hidden' }}>
            <img 
              src={images[currentIndex]} 
              alt={`Slider Image ${currentIndex + 1}`} 
              style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div style={footerStyle}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
          <a href="https://www.youtube.com/@Gishandhananjaya-1998" target="_blank" rel="noopener noreferrer">
            <img src={youtubeIcon} alt="YouTube" style={{ width: '26px', height: '26px' }} />
          </a>
          <a href="https://www.tiktok.com/@gishan_dhananjaya?_t=8qL7YuZroyl&_r=1" target="_blank" rel="noopener noreferrer">
            <img src={tiktokIcon} alt="TikTok" style={{ width: '26px', height: '26px' }} />
          </a>
          <a href="https://www.facebook.com/share/iBFQfxsLKHUiHFhc/" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" style={{ width: '26px', height: '26px' }} />
          </a>
        </div>
        <p style={{ margin: '0', textAlign: 'center', fontSize: '15px' }}>
          &copy; {new Date().getFullYear()} Gishan Dhananjaya - All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;


