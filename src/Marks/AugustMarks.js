import React from 'react';
import MonthMarksUI from './MonthMarksUI';

const SOURCES = [{ collection: 'marksheets', grade: null }];

const AugustMarks = () => <MonthMarksUI month="August" sources={SOURCES} />;

export default AugustMarks;
