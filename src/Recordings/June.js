import React from 'react';
import MonthRecordingsUI from './MonthRecordingsUI';

const FOLDERS = [
  'Write to Bright - Essays',
  'Write to Bright - Notes, Notices & Graphs',
  'Grammar Hammer',
  'Paper Shaper',
];

const June = () => <MonthRecordingsUI month="June" gradeFilter="Grade 10 & 11" folders={FOLDERS} />;

export default June;
