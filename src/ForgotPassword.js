import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import LogoBig from './assets/LogoBig.png';
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFFDE7' }}>

      {/* Decorative blobs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FDE04755 0%, transparent 70%)' }} />
      <div className="fixed -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #FACC1544 0%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-yellow-100 overflow-hidden relative z-10"
      >
        {/* Yellow top stripe */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #FDE047, #FACC15, #EAB308)' }} />

        <div className="p-8 sm:p-10">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={LogoBig} alt="The BEE Academy" className="h-11" />
          </div>

          {sent ? (
            /* ── Success State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FDE047, #FACC15)' }}>
                  <CheckCircle className="w-8 h-8 text-yellow-900" strokeWidth={2} />
                </div>
              </div>
              <h2
                className="text-2xl font-black text-gray-900 mb-2 tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Email Sent!
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              <p className="text-sm font-bold text-yellow-700 mb-6 break-all">{email}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                Check your inbox (and spam folder). The link expires in 1 hour.
              </p>
              <Link
                to="/Signin"
                className="inline-flex items-center gap-2 text-sm font-black text-yellow-900 py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #FDE047, #FACC15, #EAB308)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="mb-8 text-center">
                <h2
                  className="text-2xl font-black text-gray-900 mb-2 tracking-tight"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Forgot Password?
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-black text-gray-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-yellow-400" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      placeholder="student@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 border-yellow-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition-all hover:border-yellow-300 shadow-sm"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-medium leading-snug">{error}</p>
                  </motion.div>
                )}

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
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Sending…</span></>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex-1 h-px bg-yellow-100" />
                <div className="flex-1 h-px bg-yellow-100" />
              </div>

              <p className="mt-5 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <Link to="/Signin" className="font-black text-yellow-600 hover:text-yellow-700 transition-colors">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
