import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './firebase';
import LogoBig from './assets/LogoBig.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setResetMessage('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (email === 'dhananjayagishan@gmail.com') {
        navigate('/AdminDashboard');
      } else {
        navigate('/Dashboard2');
      }
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setEmailError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setPasswordError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setEmailError('Please enter a valid email address.');
          break;
        default:
          setEmailError('Failed to sign in. Please try again.');
          setPasswordError('');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError('Please enter your email to reset password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setEmailError('Failed to send password reset email.');
    }
  };

  const renderPasswordField = () => (
    <div className="mt-6 w-full">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
      <div className="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          id="password" 
          name="password" 
          className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <div 
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.974 9.974 0 012.174-3.309m1.659-1.526A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.221 5.308M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3-3v3m0 0l3 3m-3-3l-3 3" />
            </svg>
          )}
        </div>
      </div>
      {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
    </div>
  );

  return (
    <div>
      {isSmallScreen ? (
        <div className="flex min-h-screen items-center justify-center bg-yellow-100 px-4">
          <motion.div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-3 text-lg text-gray-600">Welcome back! Please enter your details</p>
            </div>
            <form className="mt-1 space-y-6 w-full" onSubmit={handleSignIn}>
              <div className="w-full">
                <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="example@gmail.com" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
              {renderPasswordField()}
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="h-4 w-4 border-gray-300 text-primary focus:ring-secondary" />
                <label htmlFor="remember" className="text-sm font-medium text-gray-700">Remember me</label>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md">Sign In</button>
            </form>
            {resetMessage && <p className="mt-4 text-center text-sm text-green-500">{resetMessage}</p>}
            {/*<p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="font-medium text-primary hover:text-secondary">Sign Up</Link>
            </p> */}
          </motion.div>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-yellow-200 md:flex-row">
          <motion.div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 md:p-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">Welcome</h1>
            <p className="text-lg md:text-xl text-center mb-10 md:mb-20">Sign in to start your learning</p>
            <img src={LogoBig} alt="The Bee Academy Logo" className="w-full max-w-[300px] md:max-w-[500px]" />
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 ml-10">Sign In</h2>

            <form className="space-y-6 ml-10" onSubmit={handleSignIn}>
              <div className="w-4/5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
              </div>

              <div className="w-4/5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a9.974 9.974 0 012.174-3.309m1.659-1.526A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 01-4.221 5.308M15 12a3 3 0 00-3-3m0 0a3 3 0 00-3 3m3-3v3m0 0l3 3m-3-3l-3 3" />
                      </svg>
                    )}
                  </div>
                </div>
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
              </div>

              <div className="flex items-center space-x-2 w-4/5">
                <input type="checkbox" id="remember" className="h-4 w-4 border-gray-300 text-primary focus:ring-secondary" />
                <label htmlFor="remember" className="text-sm font-medium text-gray-700">Remember me</label>
              </div>

              <div className="w-4/5">
                <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md">
                  Sign In
                </button>
              </div>
            </form>

            {/*<p className="mt-4 w-4/5 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="font-medium text-primary hover:text-secondary">Sign Up</Link>
            </p> */}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Signin;
