import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from './firebase';
import LogoBig from './assets/LogoBig.png';
import {
  Eye, EyeOff, BookOpen, Video, FileText,
  User, Mail, BadgeCheck, GraduationCap, Lock,
  AlertCircle, Info, Loader2, ArrowRight, ChevronDown
} from 'lucide-react';

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11'];

const inputBase = (err) =>
  `w-full py-3 border-2 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition-all duration-200 shadow-sm ${
    err ? 'border-red-300 bg-red-50/30' : 'border-yellow-200 hover:border-yellow-300'
  }`;

const FieldError = ({ msg }) => (
  <motion.p
    initial={{ opacity: 0, y: -4 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
  >
    <AlertCircle className="w-3 h-3 shrink-0" />
    {msg}
  </motion.p>
);

const Label = ({ children }) => (
  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1.5">
    {children}
  </label>
);

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, error, required = true, icon: Icon, children }) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    {children || (
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-yellow-400" />
          </span>
        )}
        <input
          type={type} id={id} placeholder={placeholder} value={value}
          onChange={onChange} required={required}
          className={`${inputBase(error)} ${Icon ? 'pl-10' : 'pl-4'} pr-4`}
        />
      </div>
    )}
    {error && <FieldError msg={error} />}
  </div>
);

const FeatureCard = ({ icon: Icon, label, sub }) => (
  <div className="flex items-center gap-3.5 bg-black/10 backdrop-blur-sm rounded-2xl px-4 py-3.5 border border-black/10">
    <div className="bg-black/15 rounded-xl p-2.5 shrink-0">
      <Icon className="w-4 h-4 text-yellow-900" strokeWidth={1.8} />
    </div>
    <div>
      <p className="text-sm font-bold text-yellow-900 leading-tight">{label}</p>
      <p className="text-xs text-yellow-800/70 mt-0.5">{sub}</p>
    </div>
  </div>
);

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', studentId: '', grade: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (!form.studentId.trim()) errs.studentId = 'Student ID is required.';
    if (!form.grade) errs.grade = 'Please select your grade.';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      const isAdmin = process.env.REACT_APP_ADMIN_EMAIL && form.email.trim() === process.env.REACT_APP_ADMIN_EMAIL;
      await setDoc(doc(db, "users", user.uid), {
        name: form.name.trim(), username: form.name.trim(), email: form.email.trim(),
        studentId: form.studentId.trim(), grade: form.grade,
        role: isAdmin ? 'admin' : 'student',
        status: isAdmin ? 'approved' : 'pending', paid: isAdmin, createdAt: serverTimestamp(),
      });
      if (isAdmin) {
        navigate('/AdminDashboard');
      } else {
        navigate('/pending-approval');
      }
    } catch (error) {
      const errs = {};
      if (error.code === 'auth/email-already-in-use') errs.email = 'This email is already registered.';
      else if (error.code === 'auth/invalid-email') errs.email = 'Invalid email address.';
      else if (error.code === 'auth/weak-password') errs.password = 'Password is too weak.';
      else errs.email = 'Sign up failed. Please try again.';
      setErrors(errs);
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
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/20 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-black/08 pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-4 h-4 rounded-full bg-white/40 pointer-events-none" />
        <div className="absolute top-1/3 right-28 w-2 h-2 rounded-full bg-black/20 pointer-events-none" />
        <div className="absolute bottom-1/3 left-12 w-3 h-3 rounded-full bg-white/50 pointer-events-none" />

        <div className="relative z-10">
          <img src={LogoBig} alt="The BEE Academy" className="h-14 drop-shadow" />
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-black/10 text-yellow-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Join Us Today
          </div>
          <h1
            className="text-5xl font-black text-yellow-900 leading-tight mb-4 tracking-tight"
            style={{ fontFamily: "'Georgia', serif", textShadow: '0 1px 8px rgba(255,255,255,0.4)' }}
          >
            Start your<br />journey.
          </h1>
          <p className="text-yellow-800 text-base leading-relaxed max-w-xs font-medium">
            Create your account and get access to everything you need to succeed — once approved by admin.
          </p>
        </div>

        <div className="relative z-10 space-y-2.5">
          <FeatureCard icon={BookOpen} label="Quality Content" sub="Curriculum-aligned study materials" />
          <FeatureCard icon={Video} label="Video Lessons" sub="Watch and rewatch at your own pace" />
          <FeatureCard icon={FileText} label="Practice Papers" sub="Past papers and targeted quizzes" />
        </div>

        <p className="relative z-10 text-yellow-800/40 text-xs">
          © {new Date().getFullYear()} The BEE Academy
        </p>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-y-auto"
        style={{ background: '#FFFDE7' }}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full max-w-sm py-8">

          <div className="flex justify-center mb-8 lg:hidden">
            <img src={LogoBig} alt="The BEE Academy" className="h-12" />
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-black text-gray-900 mb-1.5 tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Create Account
            </h2>
            <p className="text-sm text-gray-500">Register below — admin reviews before activation.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">

            <InputField
              label="Full Name" id="name" placeholder="e.g. Kamal Perera"
              value={form.name} onChange={set('name')} error={errors.name} icon={User}
            />

            <InputField
              label="Email Address" id="email" type="email" placeholder="student@example.com"
              value={form.email} onChange={set('email')} error={errors.email} icon={Mail}
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Student ID" id="studentId" placeholder="S-2024-001"
                value={form.studentId} onChange={set('studentId')} error={errors.studentId} icon={BadgeCheck}
              />

              <div className="space-y-1">
                <Label>Grade</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <GraduationCap className="w-4 h-4 text-yellow-400" />
                  </span>
                  <select
                    id="grade" value={form.grade} onChange={set('grade')} required
                    className={`${inputBase(errors.grade)} pl-10 pr-8 appearance-none cursor-pointer`}
                  >
                    <option value="">Grade</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-3.5 h-3.5 text-yellow-400" />
                  </span>
                </div>
                {errors.grade && <FieldError msg={errors.grade} />}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-yellow-400" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'} id="password"
                  placeholder="At least 6 characters"
                  value={form.password} onChange={set('password')} required
                  className={`${inputBase(errors.password)} pl-10 pr-12`}
                />
                <button
                  type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-300 hover:text-yellow-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <FieldError msg={errors.password} />}
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-2.5 px-3.5 py-3 bg-yellow-100 border border-yellow-300 rounded-xl">
              <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                Your account will be reviewed by an admin. You can log in once approved and payment is confirmed.
              </p>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm text-yellow-900 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? '#FDE047'
                  : 'linear-gradient(135deg, #FDE047 0%, #FACC15 50%, #EAB308 100%)',
              }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account…</span></>
                : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-7 flex items-center gap-3">
            <div className="flex-1 h-px bg-yellow-200" />
            <span className="text-xs text-gray-400 font-semibold">Already a member?</span>
            <div className="flex-1 h-px bg-yellow-200" />
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/Signin" className="font-black text-yellow-600 hover:text-yellow-700 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
