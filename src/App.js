import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your Dashboard component
import Homework from './Homework';
import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';
import TeacherHomework from './TeacherPages/TeacherHomework';
import Marks from './Marks';
import TeacherDashboard from './TeacherPages/TeacherDashboard';
import TeacherMarks from './TeacherPages/TeacherMarks';
import Homework6 from "./Grade6/Homework6";
import GradeSelect from "./GradeSelect";
import Dashboard6 from "./Grade6/Dashboard6";
import TeacherDashboard6 from "./Teacher6/Dashboard";
import GradeSelectTeacher from "./GradeSelectTeacher";
import TeacherHomework6 from "./Teacher6/Homework";
import HomeworkSubmission from './HomeworkSubmission'; // Import the HomeworkSubmission component
import TeacherMarks6 from "./Teacher6/Marks";
import Marks6 from "./Grade6/Marks6";
import Submission6 from './Grade6/Submission6';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} /> {/* Notes route */}
        <Route path="/Signup" element={<SignUp />} /> {/* SignIn is the first page */}
        <Route path="/Signin" element={<Signin />} /> {/* Notes route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Main dashboard route */}
        <Route path="/Marks" element={<Marks />} /> {/* Marks route */}
        <Route path="/homework" element={<Homework />} /> {/* Homework route */}
        <Route path="/teacher/homework" element={<TeacherHomework />} /> {/* Teacher homework route */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> {/* Teacher dashboard route */}
        <Route path="/teacher/marks" element={<TeacherMarks />} /> {/* Teacher marks route */}
        <Route path="/Grade6/Homework6" element={<Homework6 />} /> {/* Homework6 route */}
        <Route path="/GradeSelect" element={<GradeSelect />} /> {/* GradeSelect route */}
        <Route path="/Grade6/Dashboard6" element={<Dashboard6 />} /> {/* Dashboard6 route */}
        <Route path="/Teacher6/Dashboard" element={<TeacherDashboard6 />} /> {/* TeacherDashboard6 route */}
        <Route path="/Teacher6/Homework" element={<TeacherHomework6 />} /> {/* TeacherHomework6 route */}
        <Route path="/GradeSelectTeacher" element={<GradeSelectTeacher />} /> {/* GradeSelectTeacher route */}  
        <Route path="/HomeworkSubmission" element={<HomeworkSubmission />} />
        <Route path="/Teacher6/Marks" element={<TeacherMarks6 />} />
        <Route path="/Grade6/Marks6" element={<Marks6 />} />
        <Route path="/Grade6/Submission6" element={<Submission6 />} />
        

        

        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;


