import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet


import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';

import GradeSelect from "./GradeSelect";

import Homework6 from "./Grade6/Homework6";
import Dashboard6 from "./Grade6/Dashboard6";
import Marks6 from "./Grade6/Marks6";
import Submission6 from "./Grade6/Submission6";

import Dashboard7 from './Grade 7/Dashboard7';
import Homework7 from './Grade 7/Homework7';
import Marks7 from './Grade 7/Marks7';
import Submission7 from './Grade 7/Submission7';

import Dashboard8 from './Grade 8/Dashboard8';
import Homework8 from './Grade 8/Homework8';
import Marks8 from './Grade 8/Marks8';
import Submission8 from './Grade 8/Submission8';

import GradeSelectTeacher from "./GradeSelectTeacher";

import TeacherDashboard6 from "./Teacher6/Dashboard";
import TeacherHomework6 from "./Teacher6/Homework";
import TeacherMarks6 from "./Teacher6/Marks";

import TeacherDashboard7 from './Teacher7/Dashboard';
import TeacherHomework7 from './Teacher7/Homework';
import TeacherMarks7 from './Teacher7/Marks';

import TeacherDashboard8 from './Teacher8/Dashboard';
import TeacherHomework8 from './Teacher8/Homework';
import TeacherMarks8 from './Teacher8/Marks';
import Dashboard from './Dashboard';

import OtherGrade from './OtherGrade';


function App() {
  return (
    <Router>
       <Helmet>
        <title>The BEE Academy</title> {/* Dynamic site title */}
      </Helmet>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} /> {/* Notes route */}
        <Route path="/Signup" element={<SignUp />} /> {/* SignIn is the first page */}
        <Route path="/Signin" element={<Signin />} /> {/* Notes route */}

      

        <Route path="/GradeSelect" element={<GradeSelect />} /> {/* GradeSelect route */}

        <Route path="/Grade6/Dashboard6" element={<Dashboard6 />} /> {/* Dashboard6 route */}
        <Route path="/Grade6/Homework6" element={<Homework6 />} /> {/* Homework6 route */}
        <Route path="/Grade6/Marks6" element={<Marks6 />} /> {/* Marks6 route */}
        <Route path="/Grade6/Submission6" element={<Submission6 />} /> {/* Submission6 route */}

        <Route path="/Grade7/Dashboard7" element={<Dashboard7 />} /> {/* Dashboard7 route */}
        <Route path="/Grade7/Homework7" element={<Homework7 />} /> {/* Homework7 route */}
        <Route path="/Grade7/Marks7" element={<Marks7 />} /> {/* Marks7 route */}
        <Route path="/Grade7/Submission7" element={<Submission7 />} /> {/* Submission7 route */}

        <Route path="/Grade8/Dashboard8" element={<Dashboard8 />} /> {/* Dashboard8 route */}
        <Route path="/Grade8/Homework8" element={<Homework8 />} /> {/* Homework8 route */}
        <Route path="/Grade8/Marks8" element={<Marks8 />} /> {/* Marks8 route */}
        <Route path="/Grade8/Submission8" element={<Submission8 />} /> {/* Submission8 route */}

        <Route path="/OtherGrade" element={<OtherGrade />} /> {/* OtherGrade route */}

        <Route path="/GradeSelectTeacher" element={<GradeSelectTeacher />} /> {/* GradeSelectTeacher route */} 

        <Route path="/Teacher6/Dashboard" element={<TeacherDashboard6 />} /> {/* TeacherDashboard6 route */}
        <Route path="/Teacher6/Homework" element={<TeacherHomework6 />} /> {/* TeacherHomework6 route */}
        <Route path ="/Teacher6/Marks" element={<TeacherMarks6 />} /> {/* TeacherMarks6 route */}

        <Route path="/Teacher7/Dashboard" element={<TeacherDashboard7 />} /> {/* TeacherDashboard7 route */}
        <Route path="/Teacher7/Homework" element={<TeacherHomework7 />} /> {/* TeacherHomework7 route */}
        <Route path="/Teacher7/Marks" element={<TeacherMarks7 />} /> {/* TeacherMarks7 route */}
         
        <Route path="/Teacher8/Dashboard" element={<TeacherDashboard8 />} /> {/* TeacherDashboard8 route */}
        <Route path="/Teacher8/Homework" element={<TeacherHomework8 />} /> {/* TeacherHomework8 route */}
        <Route path="/Teacher8/Marks" element={<TeacherMarks8 />} /> {/* TeacherMarks8 route */}

        <Route path="/dashboard" element={<Dashboard/>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;


