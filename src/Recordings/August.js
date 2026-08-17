import React from 'react';
import MonthRecordingsUI from './MonthRecordingsUI';

const FOLDERS = ['Past Paper Class', 'QQ Class', 'Write to Bright Class'];

const August = () => <MonthRecordingsUI month="August" gradeFilter="Grade 10 & 11" folders={FOLDERS} />;

export default August;
