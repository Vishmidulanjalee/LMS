import React from 'react';
import MonthMarksUI from './MonthMarksUI';

const SOURCES = [{ collection: 'marksheets', grade: null }];

const JulyMarks = () => <MonthMarksUI month="July" sources={SOURCES} />;

export default JulyMarks;
