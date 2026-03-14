import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from './firebase';
import LogoBig from './assets/LogoBig.png';
import {
  Eye, EyeOff, BookOpen, Video, BarChart2,
  Clock, CreditCard, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL;

const StatusBanner = ({ type, message }) => {
  const config = {
    pending: {
      classes: 'bg-yellow-50 border-yellow-300 text-yellow-800',
      icon: <Clock className="w-4 h-4 shrink-0 mt-0.5 text-yellow-500" />,
    },
    unpaid: {
      classes: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <CreditCard className="w-4 h-4 shrink-0 mt-0.5 text-sky-500" />,
    },
    error: {
      classes: 'bg-red-50 border-red-200 text-red-700',
      icon: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />,
    },
  };
  const { classes, icon } = config[type];
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium ${classes}`}
    >
      {icon}
      <p className="leading-snug">{message}</p>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, label, sub }) => (
  <div className="flex flex-col items-center gap-2 bg-black/10 backdrop-blur-sm rounded-2xl p-5 border border-black/10">
    <div className="bg-black/15 rounded-xl p-2.5">
      <Icon className="w-5 h-5 text-yellow-900" strokeWidth={1.8} />
    </div>
    <p className="text-yellow-900 font-bold text-sm leading-tight text-center">{label}</p>
    <p className="text-yellow-800/70 text-xs text-center leading-tight">{sub}</p>
  </div>
);

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      // Admin check: Firestore role (primary) or env-var email (fallback)
      const isAdmin = (docSnap.exists() && docSnap.data().role === 'admin')
        || (ADMIN_EMAIL && email === ADMIN_EMAIL);

      if (isAdmin) {
        navigate('/AdminDashboard');
        return;
      }

      if (!docSnap.exists()) {
        setStatus({ type: 'error', message: 'Account record not found. Please contact admin.' });
        setLoading(false);
        return;
      }

      const data = docSnap.data();

      if (data.status !== 'approved') {
        setStatus({ type: 'pending', message: 'Your account is pending admin approval. You will be notified once approved.' });
        setLoading(false);
        return;
      }

      if (!data.paid) {
        setStatus({ type: 'unpaid', message: 'Your account is approved but payment has not been confirmed. Please contact admin.' });
        setLoading(false);
        return;
      }

      navigate('/Dashboard2');

    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setStatus({ type: 'error', message: 'No account found with this email.' });
      } else if (error.code === 'auth/wrong-password') {
        setStatus({ type: 'error', message: 'Incorrect password. Please try again.' });
      } else if (error.code === 'auth/invalid-email') {
        setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      } else if (error.code === 'auth/too-many-requests') {
        setStatus({ type: 'error', message: 'Too many failed attempts. Please try again later.' });
      } else {
        setStatus({ type: 'error', message: 'Sign in failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#FFFDE7' }}>

      {/* ── Left Panel ── */}
      <motion.div
        className="hidden lg:flex lg:w-[44%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #FDE047 0%, #FACC15 45%, #EAB308 100%)' }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/20 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/08 pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-4 h-4 rounded-full bg-white/40 pointer-events-none" />
        <div className="absolute top-1/3 right-28 w-2 h-2 rounded-full bg-black/20 pointer-events-none" />
        <div className="absolute bottom-1/3 left-12 w-3 h-3 rounded-full bg-white/50 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <img src={LogoBig} alt="The BEE Academy" className="h-14 drop-shadow" />
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <div className="inline-block bg-black/10 text-yellow-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Student Portal
          </div>
          <h1
            className="text-5xl font-black text-yellow-900 leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "'Georgia', serif", textShadow: '0 1px 8px rgba(255,255,255,0.4)' }}
          >
            Welcome<br />Back.
          </h1>
          <p className="text-yellow-800 text-base leading-relaxed max-w-xs font-medium">
            Sign in to continue your learning journey — your lessons, recordings, and materials are waiting.
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          <FeatureCard icon={BookOpen} label="Study Materials" sub="PDFs & notes" />
          <FeatureCard icon={Video} label="Video Lessons" sub="Recorded & live" />
          <FeatureCard icon={BarChart2} label="Track Progress" sub="Your results" />
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16"
        style={{ background: '#FFFDE7' }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img src={LogoBig} alt="The BEE Academy" className="h-12" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2
              className="text-3xl font-black text-gray-900 mb-1.5 tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Sign In
            </h2>
            <p className="text-sm text-gray-500">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-sm hover:border-yellow-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-yellow-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-sm hover:border-yellow-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status Banner */}
            {status && <StatusBanner type={status.type} message={status.message} />}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-yellow-900 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#FDE047'
                  : 'linear-gradient(135deg, #FDE047 0%, #FACC15 50%, #EAB308 100%)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-7 flex items-center gap-3">
            <div className="flex-1 h-px bg-yellow-200" />
            <span className="text-xs text-gray-400 font-semibold">New here?</span>
            <div className="flex-1 h-px bg-yellow-200" />
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/Signup"
              className="font-black text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
