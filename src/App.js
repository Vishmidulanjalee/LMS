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
 

function App() {
  const userName = "Jhon Doe";
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Add leading zero if necessary
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();
  const currentDate = `${day}/${month}/${year}`; // Format as dd/mm/yyyy
  
  const images = [image1, image2, image3]; // Corrected variable names
  const [currentIndex, setCurrentIndex] = useState(0); // State for current image index
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
    }, 5000); // Change image every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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
    
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // Left panel is wider (2 parts), right panel is narrower (1 part)
    marginTop: '20px',
    gap: '20px', // Gap between the two panels
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // 2 columns for the cards
    gap: '20px', // Space between cards
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
    height: '140px', // Height of the cards
    width:'80%',
    margin: '0',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
  };

  const yellowCardStyle = {
    ...cardStyle,
    backgroundColor: '#F3C623',
  };

  const boxStyle = {
    backgroundColor: '#e0e0e0', // Color for the box
    padding: '0px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto', // Height adjusts to content
  };

  const footerStyle = {
    textAlign: 'center',
    backgroundColor: '#F3C623',
    borderTop: '1px solid #ddd',
    marginTop: '10px',
    padding: '5px 0', // Reduced vertical padding
    width: '100%', // Full width
    display: 'flex',
    flexDirection: 'column', // Arrange content vertically
    alignItems: 'center', // Center items horizontally
  };
  
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
            src="https://via.placeholder.com/40"
            alt="User Profile"
            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        {/* Left Panel (Cards) */}
        <div style={cardContainerStyle}>
          {/* Notes Card */}
          <div
            style={{ ...yellowCardStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3C623')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <img src={notesIcon} alt="Notes Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Notes</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Access important notes to help with your lessons</p>
          </div>

          {/* Homework Card */}
          <div
            style={{ ...cardStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3C623')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <img src={homeworkIcon} alt="Homework Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Homework</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Review and submit your homework here</p>
          </div>

          {/* Marks Card */}
          <div
            style={{ ...cardStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3C623')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <img src={marksIcon} alt="Marks Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Marks</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>View your latest marks and track progress</p>
          </div>

          {/* Other Card */}
          <div
            style={{ ...cardStyle }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3C623')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            <img src={otherIcon} alt="Other Icon" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
            <h3 style={{ fontSize: '25px', margin: '0' }}>Other</h3>
            <p style={{ fontSize: '17px', margin: '0' }}>Explore additional resources and options</p>
          </div>
        </div>

        {/* Right Panel (Dynamic Image Slider and Additional Images) */}
        <div style={boxStyle}>
          {/* Dynamic Image Slider */}
          <div style={{ height: '400px', overflow: 'hidden' }}> {/* Adjust height as needed */}
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
      <img src={youtubeIcon} alt="YouTube" style={{ width: '30px', height: '30px' }} />
    </a>
    <a href="https://www.tiktok.com/@gishan_dhananjaya?_t=8qL7YuZroyl&_r=1" target="_blank" rel="noopener noreferrer">
      <img src={tiktokIcon} alt="TikTok" style={{ width: '30px', height: '30px' }} />
    </a>
    <a href="https://www.facebook.com/share/iBFQfxsLKHUiHFhc/" target="_blank" rel="noopener noreferrer">
      <img src={facebookIcon} alt="Facebook" style={{ width: '30px', height: '30px' }} />
    </a>
  </div>
 

<p style={{ margin: '0', textAlign: 'center',fontSize:'15px' }}>© The Bee Academy. All rights reserved.</p>
</div>
 
</div>

  );
}

export default App;
