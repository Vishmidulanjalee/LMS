import React from 'react';
import MonthRecordingsUI from './MonthRecordingsUI';

const FOLDERS = ['Write to Bright 1', 'Write to Bright 2', 'Grammar Hammer', 'Paper Shaper'];

const May = () => <MonthRecordingsUI month="May" gradeFilter="Grade 10 & 11" folders={FOLDERS} />;

export default May;
