import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet


import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';

import GradeSelect from "./GradeSelect";

import SidebarNew from './SidebarNew'; // Import the new Sidebar component

import Dashboard2 from './Dashboard2';

import AdminDasboard from './AdminDasboard';

import UploadRecordings from './UploadRecordings';

import WatchVideosFolder from './WatchVideosFolder';
import MarkSheets from './MarkSheets';
import Documents from './Documents';



import UploadVideosFolder from './UploadVideosFolder';
import UploadMarks from './UploadMarks';
import UploadDocument from './UploadDocuments';

import June from './June';
import July from './July'; 

import JuneMarks from './JuneMarks'; // Import the JuneMarks component
import JulyMarks from './JulyMarks'; // Import the JulyMarks component


import Homework6 from "./Grade 6/Homework6";
import Dashboard6 from "./Grade 6/Dashboard6";
import Marks6 from "./Grade 6/Marks6";
import Submission6 from "./Grade 6/Submission6";
import Notes6 from "./Grade 6/Notes6";

import Dashboard7 from './Grade 7/Dashboard7';
import Homework7 from './Grade 7/Homework7';
import Marks7 from './Grade 7/Marks7';
import Submission7 from './Grade 7/Submission7';
import Notes7 from './Grade 7/Notes7';

import Dashboard8 from './Grade 8/Dashboard8';
import Homework8 from './Grade 8/Homework8';
import Marks8 from './Grade 8/Marks8';
import Submission8 from './Grade 8/Submission8';
import Notes8 from './Grade 8/Notes8';

import Dashboard9 from './Grade 9/Dashboard9';
import Homework9 from './Grade 9/Homework9';
import Marks9 from './Grade 9/Marks9';
import Submission9 from './Grade 9/Submission9';
import Notes9 from './Grade 9/Notes9';

import Dashboard10 from './Grade 10/Dashboard10';
import Homework10 from './Grade 10/Homework10';
import StudentMarks10 from './Grade 10/Marks10';
import Submission10 from './Grade 10/Submission10';
import Notes10 from './Grade 10/Notes10';

import Dashboard11 from './Grade 11/Dashboard11';
import Homework11 from './Grade 11/Homework11';
import Marks11 from './Grade 11/Marks11';
import Submission11 from './Grade 11/Submission11';
import Notes11 from './Grade 11/Notes11';

import OtherGrade from "./OtherGrade";


import GradeSelectTeacher from "./GradeSelectTeacher";

import TeacherDashboard6 from "./Teacher6/Dashboard";
import TeacherHomework6 from "./Teacher6/Homework";
import TeacherMarks6 from "./Teacher6/Marks";
import TeacherNotes6 from "./Teacher6/Notes";

import TeacherDashboard7 from './Teacher7/Dashboard';
import TeacherHomework7 from './Teacher7/Homework';
import TeacherMarks7 from './Teacher7/Marks';
import TeacherNotes7 from './Teacher7/Notes';

import TeacherDashboard8 from './Teacher8/Dashboard';
import TeacherHomework8 from './Teacher8/Homework';
import TeacherMarks8 from './Teacher8/Marks';
import TeacherNotes8 from './Teacher8/Notes';

import TeacherDashboard9 from './Teacher9/Dashboard';
import TeacherHomework9 from './Teacher9/Homework';
import TeacherMarks9 from './Teacher9/Marks';
import TeacherNotes9 from './Teacher9/Notes';

import TeacherDashboard10 from './Teacher10/Dashboard';
import TeacherHomework10 from './Teacher10/Homework';
import TeacherMarks10 from './Teacher10/Marks';
import TeacherNotes10 from './Teacher10/Notes';

import TeacherDashboard11 from './Teacher11/Dashboard';
import TeacherHomework11 from './Teacher11/Homework';
import TeacherMarks11 from './Teacher11/Marks';
import TeacherNotes11 from './Teacher11/Notes';

import PaperMint from './PaperMint';
import Apara from './Apara';
import Tutes from './Tutes';
import Other from './Others';





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

        <Route path="/SidebarNew" element={<SidebarNew />} /> {/* SidebarNew route */}


        <Route path="/Dashboard2" element={<Dashboard2 />} /> {/* Dashboard2 route */}

        <Route path="/AdminDashboard" element={<AdminDasboard />} /> {/* AdminDasboard route */}

        <Route path="/UploadRecordings" element={<UploadRecordings />} /> {/* UploadRecordings route */}
        <Route path="/UploadMarks" element={<UploadMarks />} /> {/* UploadMarks route */}
        <Route path="/UploadDocuments" element={<UploadDocument />} /> {/* UploadDocument route */}


       

        <Route path="/UploadVideosFolder" element={<UploadVideosFolder />} /> {/* UploadVideosFolder route */}

        <Route path="/WatchVideosFolder" element={<WatchVideosFolder />} /> {/* WatchVideosFolder route */}
        <Route path="/MarkSheets" element={<MarkSheets />} /> {/* MarkSheets route */}
        <Route path="/Documents" element={<Documents />} /> {/* Documents route */}

        <Route path="/June" element={<June />} /> {/* June route */}
        <Route path="/July" element={<July />} /> {/* July route */}

        <Route path="/marks/june" element={<JuneMarks />} />
        <Route path="/marks/july" element={<JulyMarks />} /> {/* JulyMarks route */}

        <Route path="/docs/papermint" element={<PaperMint />} />
        <Route path="/docs/apara" element={<Apara />} />
        <Route path="/docs/tutes" element={<Tutes />} />
        <Route path="/docs/other" element={<Other />} />


        {/* Grade 6 routes */}

        


        <Route path="/Grade6/Dashboard6" element={<Dashboard6 />} /> {/* Dashboard6 route */}
        <Route path="/Grade6/Homework6" element={<Homework6 />} /> {/* Homework6 route */}
        <Route path="/Grade6/Marks6" element={<Marks6 />} /> {/* Marks6 route */}
        <Route path="/Grade6/Submission6" element={<Submission6 />} /> {/* Submission6 route */}
        <Route path='/Grade6/Notes6' element={<Notes6 />} /> {/* Notes6 route */}

        <Route path="/Grade7/Dashboard7" element={<Dashboard7 />} /> {/* Dashboard7 route */}
        <Route path="/Grade7/Homework7" element={<Homework7 />} /> {/* Homework7 route */}
        <Route path="/Grade7/Marks7" element={<Marks7 />} /> {/* Marks7 route */}
        <Route path="/Grade7/Submission7" element={<Submission7 />} /> {/* Submission7 route */}
        <Route path='/Grade7/Notes7' element={<Notes7 />} /> {/* Notes7 route */}

        <Route path="/Grade8/Dashboard8" element={<Dashboard8 />} /> {/* Dashboard8 route */}
        <Route path="/Grade8/Homework8" element={<Homework8 />} /> {/* Homework8 route */}
        <Route path="/Grade8/Marks8" element={<Marks8 />} /> {/* Marks8 route */}
        <Route path="/Grade8/Submission8" element={<Submission8 />} /> {/* Submission8 route */}
        <Route path='/Grade8/Notes8' element={<Notes8 />} /> {/* Notes8 route */}

        <Route path="/Grade9/Dashboard9" element={<Dashboard9 />} /> {/* Dashboard9 route */}
        <Route path="/Grade9/Homework9" element={<Homework9 />} /> {/* Homework9 route */}
        <Route path="/Grade9/Marks9" element={<Marks9 />} /> {/* Marks9 route */}
        <Route path="/Grade9/Submission9" element={<Submission9 />} /> {/* Submission9 route */}
        <Route path='/Grade9/Notes9' element={<Notes9 />} /> {/* Notes9 route */}

        <Route path="/Grade10/Dashboard10" element={<Dashboard10 />} /> {/* Dashboard10 route */}
        <Route path="/Grade10/Homework10" element={<Homework10 />} /> {/* Homework10 route */}
        <Route path="/Grade10/Marks10" element={<StudentMarks10 />} /> {/* Marks10 route */}
        <Route path="/Grade10/Submission10" element={<Submission10 />} /> {/* Submission10 route */}
        <Route path='/Grade10/Notes10' element={<Notes10 />} /> {/* Notes10 route */}

        <Route path="/Grade11/Dashboard11" element={<Dashboard11 />} /> {/* Dashboard11 route */}
        <Route path="/Grade11/Homework11" element={<Homework11 />} /> {/* Homework11 route */}
        <Route path="/Grade11/Marks11" element={<Marks11 />} /> {/* Marks11 route */}
        <Route path="/Grade11/Submission11" element={<Submission11 />} /> {/* Submission11 route */}
        <Route path='/Grade11/Notes11' element={<Notes11 />} /> {/* Notes11 route */}

        <Route path="/OtherGrade" element={<OtherGrade />} /> {/* Other in grade selector route */}

        <Route path="/GradeSelectTeacher" element={<GradeSelectTeacher />} /> {/* GradeSelectTeacher route */} 

        <Route path="/Teacher6/Dashboard" element={<TeacherDashboard6 />} /> {/* TeacherDashboard6 route */}
        <Route path="/Teacher6/Homework" element={<TeacherHomework6 />} /> {/* TeacherHomework6 route */}
        <Route path ="/Teacher6/Marks" element={<TeacherMarks6 />} /> {/* TeacherMarks6 route */}
        <Route path ="/Teacher6/Notes" element={<TeacherNotes6 />} /> {/* TeacherNotes6 route */}

        <Route path="/Teacher7/Dashboard" element={<TeacherDashboard7 />} /> {/* TeacherDashboard7 route */}
        <Route path="/Teacher7/Homework" element={<TeacherHomework7 />} /> {/* TeacherHomework7 route */}
        <Route path="/Teacher7/Marks" element={<TeacherMarks7 />} /> {/* TeacherMarks7 route */}
        <Route path='/Teacher7/Notes' element={<TeacherNotes7 />} /> {/* TeacherNotes7 route */}
         
        <Route path="/Teacher8/Dashboard" element={<TeacherDashboard8 />} /> {/* TeacherDashboard8 route */}
        <Route path="/Teacher8/Homework" element={<TeacherHomework8 />} /> {/* TeacherHomework8 route */}
        <Route path="/Teacher8/Marks" element={<TeacherMarks8 />} /> {/* TeacherMarks8 route */}
        <Route path="/Teacher8/Notes" element={<TeacherNotes8 />} /> {/* TeacherNotes8 route */}

        <Route path="/Teacher9/Dashboard" element={<TeacherDashboard9 />} /> {/* TeacherDashboard8 route */}
        <Route path="/Teacher9/Homework" element={<TeacherHomework9 />} /> {/* TeacherHomework8 route */}
        <Route path="/Teacher9/Marks" element={<TeacherMarks9 />} /> {/* TeacherMarks8 route */}
        <Route path="/Teacher9/Notes" element={<TeacherNotes9 />} /> {/* TeacherNotes8 route */}

        <Route path="/Teacher10/Dashboard" element={<TeacherDashboard10 />} /> {/* TeacherDashboard8 route */}
        <Route path="/Teacher10/Homework" element={<TeacherHomework10 />} /> {/* TeacherHomework8 route */}
        <Route path="/Teacher10/Marks" element={<TeacherMarks10 />} /> {/* TeacherMarks8 route */}
        <Route path="/Teacher10/Notes" element={<TeacherNotes10 />} /> {/* TeacherNotes8 route */}

        <Route path="/Teacher11/Dashboard" element={<TeacherDashboard11 />} /> {/* TeacherDashboard8 route */}
        <Route path="/Teacher11/Homework" element={<TeacherHomework11 />} /> {/* TeacherHomework8 route */}
        <Route path="/Teacher11/Marks" element={<TeacherMarks11 />} /> {/* TeacherMarks8 route */}
        <Route path="/Teacher11/Notes" element={<TeacherNotes11 />} /> {/* TeacherNotes8 route */}



        <Route path="/dashboard" element={<Dashboard/>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;


