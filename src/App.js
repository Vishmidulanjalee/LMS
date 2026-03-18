import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import SignUp from './SignUp';
import Signin from './SignIn';
import StudentTypeSelection from './StudentTypeSelection';
import Dashboard2 from './Dashboard2';

import AdminDasboard from './Admin/AdminDasboard';
import UploadRecordings from './Admin/UploadRecordings';
import AdminDashboardGuest from './Admin/AdminDashboardGuest';
import UploadMarks from './Admin/UploadMarks';
import UploadDocument from './Admin/UploadDocuments';
import StudentApprovals from './Admin/StudentApprovals';
import ApprovedStudents from './Admin/ApprovedStudents';
import PendingApproval from './PendingApproval';

import WatchVideosFolder from './WatchVideosFolder';
import MarkSheets from './MarkSheets';

// Guest Pages
import GuestDashboard from './GuestPages/GuestDashboard';
import Essays from './GuestPages/Essays';
import Seminar from './GuestPages/Seminar';
import Quiz from './GuestPages/Quiz';
import PastPapers from './GuestPages/PastPapers';
import ModelPapers from './GuestPages/ModelPapers';
import ProvincialPapers from './GuestPages/ProvincialPapers';
import Home from './home';


import January from './Recordings/January';
import February from './Recordings/February';
import March from './Recordings/March';

// Marks by Month
import JulyMarks from './Marks/JulyMarks';
import AugustMarks from './Marks/AugustMarks';

import Tutes from './Tutes';
import ForgotPassword from './ForgotPassword';
import PrivateRoute from './RequirAuth';
import AdminRoute from './AdminRoute';

function App() {
  return (
    <Router>
      <Helmet>
        <title>The BEE Academy</title>
      </Helmet>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/GuestDashboard" element={<GuestDashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/StudentTypeSelection" element={<StudentTypeSelection />} />

        {/* Protected Student Routes */}
        <Route path="/Dashboard2" element={<PrivateRoute element={<Dashboard2 />} />} />
        <Route path="/Essays" element={<PrivateRoute element={<Essays />} />} />
        <Route path="/Seminar" element={<PrivateRoute element={<Seminar />} />} />
        <Route path="/WatchVideosFolder" element={<PrivateRoute element={<WatchVideosFolder />} />} />
        <Route path="/MarkSheets" element={<PrivateRoute element={<MarkSheets />} />} />
        <Route path="/PastPapers" element={<PrivateRoute element={<PastPapers />} />} />
        <Route path="/ModelPapers" element={<PrivateRoute element={<ModelPapers />} />} />
        <Route path="/ProvincialPapers" element={<PrivateRoute element={<ProvincialPapers />} />} />
        <Route path="/Quiz" element={<PrivateRoute element={<Quiz />} />} />
        <Route path="/docs/tutes" element={<PrivateRoute element={<Tutes />} />} />

        {/* Recordings by Month */}
       
        <Route path="/January" element={<PrivateRoute element={<January />} />} />
        <Route path="/February" element={<PrivateRoute element={<February />} />} />
        <Route path="/March" element={<PrivateRoute element={<March />} />} />


        {/* Marks by Month */}
        <Route path="/marks/july" element={<PrivateRoute element={<JulyMarks />} />} />
        <Route path="/marks/august" element={<PrivateRoute element={<AugustMarks />} />} />

        {/* Admin Routes */}
        <Route path="/AdminDashboard" element={<AdminRoute element={<AdminDasboard />} />} />
        <Route path="/AdminDashboardGuest" element={<AdminRoute element={<AdminDashboardGuest />} />} />
        <Route path="/StudentApprovals" element={<AdminRoute element={<StudentApprovals />} />} />
        <Route path="/ApprovedStudents" element={<AdminRoute element={<ApprovedStudents />} />} />
        <Route path="/UploadRecordings" element={<AdminRoute element={<UploadRecordings />} />} />
        <Route path="/UploadMarks" element={<AdminRoute element={<UploadMarks />} />} />
        <Route path="/UploadDocuments" element={<AdminRoute element={<UploadDocument />} />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
      </Routes>
    </Router>
  );
}

export default App;
