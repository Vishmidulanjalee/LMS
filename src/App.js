import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet

import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';
import GradeSelect from "./GradeSelect";
import StudentTypeSelection from './StudentTypeSelection';

import SidebarNew from './SidebarNew';
import Dashboard2 from './Dashboard2';

import AdminDasboard from './AdminDasboard';
import UploadRecordings from './UploadRecordings';

import WatchVideosFolder from './WatchVideosFolder';
import MarkSheets from './MarkSheets';
import Documents from './Documents';

import GuestDashboard from './GuestDashboard';
import AdminDashboardGuest from './AdminDashboardGuest';

import Essays from './Essays';
import Seminar from './Seminar';

import Quiz from './Quiz';

import UploadMarks from './UploadMarks';
import UploadDocument from './UploadDocuments';

import June from './June';
import July from './July'; 
import August from './August';
import September from './September';

import JuneMarks from './JuneMarks';
import JulyMarks from './JulyMarks';
import AugustMarks from './AugustMarks';

import PastPapers from './PastPapers';
import ModelPapers from './ModelPapers';
import ProvincialPapers from './ProvincialPapers';

import PaperMint from './PaperMint';
import Apara from './Apara';
import Tutes from './Tutes';
import Other from './Others';

import PrivateRoute from './RequirAuth'; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Helmet>
        <title>The BEE Academy</title> {/* Dynamic site title */}
      </Helmet>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/GuestDashboard" element={<GuestDashboard />} />
        <Route path="/GradeSelect" element={<GradeSelect />} />
        <Route path="/SidebarNew" element={<SidebarNew />} />
        <Route path="/StudentTypeSelection" element={<StudentTypeSelection />} />

        {/* Protected Routes */}
        <Route path="/Dashboard2" element={<PrivateRoute element={<Dashboard2 />} />} />
        <Route path="/Essays" element={<PrivateRoute element={<Essays />} />} />
        <Route path="/Seminar" element={<PrivateRoute element={<Seminar />} />} />
        <Route path="/AdminDashboardGuest" element={<PrivateRoute element={<AdminDashboardGuest />} />} />
        <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDasboard />} />} />
        <Route path="/UploadRecordings" element={<PrivateRoute element={<UploadRecordings />} />} />
        <Route path="/UploadMarks" element={<PrivateRoute element={<UploadMarks />} />} />
        <Route path="/UploadDocuments" element={<PrivateRoute element={<UploadDocument />} />} />
        <Route path="/PastPapers" element={<PrivateRoute element={<PastPapers />} />} />
        <Route path="/ModelPapers" element={<PrivateRoute element={<ModelPapers />} />} />
        <Route path="/ProvincialPapers" element={<PrivateRoute element={<ProvincialPapers />} />} />
        <Route path="/WatchVideosFolder" element={<PrivateRoute element={<WatchVideosFolder />} />} />
        <Route path="/MarkSheets" element={<PrivateRoute element={<MarkSheets />} />} />
        <Route path="/Documents" element={<PrivateRoute element={<Documents />} />} />
        <Route path="/June" element={<PrivateRoute element={<June />} />} />
        <Route path="/July" element={<PrivateRoute element={<July />} />} />
        <Route path="/August" element={<PrivateRoute element={<August />} />} />
        <Route path="/September" element={<PrivateRoute element={<September />} />} />
        <Route path="/Quiz" element={<PrivateRoute element={<Quiz />} />} />

        <Route path="/marks/june" element={<PrivateRoute element={<JuneMarks />} />} />
        <Route path="/marks/july" element={<PrivateRoute element={<JulyMarks />} />} />
        <Route path="/marks/august" element={<PrivateRoute element={<AugustMarks />} />} />

        <Route path="/docs/papermint" element={<PrivateRoute element={<PaperMint />} />} />
        <Route path="/docs/apara" element={<PrivateRoute element={<Apara />} />} />
        <Route path="/docs/tutes" element={<PrivateRoute element={<Tutes />} />} />
        <Route path="/docs/other" element={<PrivateRoute element={<Other />} />} />

        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
