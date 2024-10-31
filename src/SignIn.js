import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './firebase';
import LogoBig from './assets/LogoBig.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setResetMessage('');

    if (email === 'dhananjaya.gishan@gmail.com') {
      navigate('/GradeSelectTeacher');
      return;
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        navigate('/GradeSelect');
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

  return ( 
    <div>
      {isSmallScreen ? (
        <div className="flex min-h-screen items-center justify-center bg-yellow-100 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold  text-gray-900 sm:text-4xl">Sign In</h2>
          <p className="mt-3 text-lg text-gray-600">Welcome back! Please enter your details</p>
        </div>
        <form className="mt-1 space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-8">
            <div>
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
              {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 mb-6">
              <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-seconadry"
            />
              <label htmlFor="remember" className="text-sm font-medium text-gray-700 ">
                Remember me
              </label>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md">
            Sign In
            </button>
          </div>
          
        </form>

        {resetMessage && <p className="mt-4 text-center text-sm text-green-500">{resetMessage}</p>}
        <div className=" mt-2">
          <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-secondary">
            Sign Up
          </Link>
          </p>
        </div>
        

        <div className="mt-12 flex justify-center">
          <img 
            src={LogoBig}
            alt="The Bee Academy Logo" 
            className="w-full max-w-[300px] sm:max-w-[400px]"
          />
        </div>
      </motion.div>
    </div>

      ) : (
        <div>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-white to-yellow-200 md:flex-row">
      {/* Left Section */}
      <motion.div 
        className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 md:p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-4 text-center text-4xl font-bold md:text-6xl">Welcome</h1>
        <p className="mb-10 text-center text-lg md:mb-20 md:text-xl">Sign in to start your learning</p>
        <img 
          src={LogoBig}
          alt="The Bee Academy Logo" 
          className="mb-0 w-full max-w-[300px] md:max-w-[500px]"
        />
      </motion.div>

      {/* Right Section */}
      <motion.div 
        className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="mb-4 text-center text-4xl font-bold md:text-left md:text-5xl">Sign In</h2>
        <form className="space-y-6" onSubmit={handleSignIn}>
          {/* Email Field */}
          <div className='mt-20 mb-10'>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" 
              placeholder="example@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-seconadry"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium text-gray-700"
            >
              Remember me
            </label>
          </div>

          {/* Sign In Button */}
          <div>
            <button type="submit" className="w-4/5 rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50">
              Sign In
            </button>
          </div>
        </form>

        {resetMessage && <p className="mt-4 w-4/5 pl-16 text-center text-sm text-green-500">{resetMessage}</p>}

        {/* Sign Up Link */}
        <p className="mt-4 w-4/5 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-secondary">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
