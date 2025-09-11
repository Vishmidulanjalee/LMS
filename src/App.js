import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Import Helmet

import SignUp from './SignUp';
import Signin from './SignIn';
import WelcomeScreen from './WelcomeScreen';
import Dashboard from './Dashboard';
import GradeSelect from "./GradeSelect";
import StudentTypeSelection from './StudentTypeSelection'; // Import the StudentTypeSelection component

import SidebarNew from './SidebarNew'; // Import the new Sidebar component
import Dashboard2 from './Dashboard2';

import AdminDasboard from './AdminDasboard';
import UploadRecordings from './UploadRecordings';

import WatchVideosFolder from './WatchVideosFolder';
import MarkSheets from './MarkSheets';
import Documents from './Documents';

import GuestDashboard from './GuestDashboard';

import AdminDashboardGuest from './AdminDashboardGuest'; // Import the AdminDashboardGuest component

import Essays from './Essays';
import Seminar from './Seminar';

import Quiz from './Quiz';

import UploadMarks from './UploadMarks';
import UploadDocument from './UploadDocuments';

import June from './June';
import July from './July'; 
import August from './August'; // Import the August component
import September from './September';

import JuneMarks from './JuneMarks'; // Import the JuneMarks component
import JulyMarks from './JulyMarks'; // Import the JulyMarks component
import AugustMarks from './AugustMarks'; // Import the AugustMarks component

import PastPapers from './PastPapers';
import ModelPapers from './ModelPapers';
import ProvincialPapers from './ProvincialPapers';

import PaperMint from './PaperMint';
import Apara from './Apara';
import Tutes from './Tutes';
import Other from './Others';

import PrivateRoute from './RequireAuth'; // Import the PrivateRoute component

function App() {
  return (
    <Router>
       <Helmet>
        <title>The BEE Academy</title> {/* Dynamic site title */}
      </Helmet>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} /> {/* Notes route */}
        <Route path="/Signup" element={<SignUp />} /> {/* SignIn is the first page */}
        <Route path="/Signin" element={<Signin />} /> {/* SignIn route */}
        <Route path="/GuestDashboard" element={<GuestDashboard />} /> {/* GuestDashboard route */}

        <Route path="/GradeSelect" element={<GradeSelect />} /> {/* GradeSelect route */}

        <Route path="/SidebarNew" element={<SidebarNew />} /> {/* SidebarNew route */}

        <Route path="/StudentTypeSelection" element={<StudentTypeSelection />} /> {/* StudentTypeSelection route */}

        <Route path="/Dashboard2" element={<Dashboard2 />} /> {/* Dashboard2 route */}

        <Route path="/Essays" element={<Essays />} /> {/* Essays route */}
        <Route path="/Seminar" element={<Seminar />} /> {/* Seminar route */}

        <Route path="/AdminDashboardGuest" element={<AdminDashboardGuest />} /> {/* AdminDashboardGuest route */}

        <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDasboard />} />} /> {/* AdminDasboard route */}
        <Route path="/UploadRecordings" element={<PrivateRoute element={<UploadRecordings />} />} /> {/* UploadRecordings route */}
        <Route path="/UploadMarks" element={<PrivateRoute element={<UploadMarks />} />} /> {/* UploadMarks route */}
        <Route path="/UploadDocuments" element={<PrivateRoute element={<UploadDocument />} />} /> {/* UploadDocument route */}

        <Route path="/PastPapers" element={<PrivateRoute element={<PastPapers />} />} /> {/* PastPapers route */}
        <Route path="/ModelPapers" element={<PrivateRoute element={<ModelPapers />} />} /> {/* ModelPapers route */}
        <Route path="/ProvincialPapers" element={<PrivateRoute element={<ProvincialPapers />} />} /> {/* ProvincialPapers route */}

        <Route path="/WatchVideosFolder" element={<PrivateRoute element={<WatchVideosFolder />} />} /> {/* WatchVideosFolder route */}
        <Route path="/MarkSheets" element={<PrivateRoute element={<MarkSheets />} />} /> {/* MarkSheets route */}
        <Route path="/Documents" element={<PrivateRoute element={<Documents />} />} /> {/* Documents route */}

        <Route path="/June" element={<PrivateRoute element={<June />} />} /> {/* June route */}
        <Route path="/July" element={<PrivateRoute element={<July />} />} /> {/* July route */}
        <Route path="/August" element={<PrivateRoute element={<August />} />} /> {/* August route */}
        <Route path="/September" element={<PrivateRoute element={<September />} />} /> {/* September route */}

        <Route path="/Quiz" element={<PrivateRoute element={<Quiz />} />} /> {/* Quiz route */}

        <Route path="/marks/june" element={<PrivateRoute element={<JuneMarks />} />} />
        <Route path="/marks/july" element={<PrivateRoute element={<JulyMarks />} />} />
        <Route path="/marks/august" element={<PrivateRoute element={<AugustMarks />} />} />

        <Route path="/docs/papermint" element={<PrivateRoute element={<PaperMint />} />} />
        <Route path="/docs/apara" element={<PrivateRoute element={<Apara />} />} />
        <Route path="/docs/tutes" element={<PrivateRoute element={<Tutes />} />} />
        <Route path="/docs/other" element={<PrivateRoute element={<Other />} />} />

        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} /> {/* Protected Dashboard */}
      </Routes>
    </Router>
  );
}

export default App;


