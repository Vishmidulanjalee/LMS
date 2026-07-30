import React from 'react';
import MonthRecordingsUI from './MonthRecordingsUI';

const FOLDERS = ['Revision Tute Class', 'Essay Class Recordings'];

const July = () => <MonthRecordingsUI month="July" gradeFilter="Grade 10 & 11" folders={FOLDERS} />;

export default July;
