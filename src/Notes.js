// Notes.js
import React from 'react';
import notesIcon from './assets/notes.png';

function Notes() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Notes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src={notesIcon} alt="Notes Icon" style={{ width: '50px', height: '50px' }} />
        <p>Here you can access important notes to help with your lessons.</p>
      </div>
    </div>
  );
}

export default Notes;
