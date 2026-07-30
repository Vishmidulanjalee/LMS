import React from 'react';
import MonthMarksUI from './MonthMarksUI';

const SOURCES = [{ collection: 'marks1011', grade: 'Grade 10 & 11' }];

const JuneMarks = () => <MonthMarksUI month="June" sources={SOURCES} filters={['Grade 10 & 11']} />;

export default JuneMarks;
