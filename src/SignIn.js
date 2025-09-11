import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from './firebase';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setResetMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Save user data in localStorage to persist authentication
      localStorage.setItem('user', JSON.stringify({ email }));

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-100 px-4">
      <motion.div 
        className="w-full max-w-sm bg-white px-6 py-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-3 text-lg text-gray-600">Welcome back! Please enter your details</p>
        </div>

        <form className="mt-4 space-y-6 w-full" onSubmit={handleSignIn}>
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

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="h-4 w-4 border-gray-300 text-primary focus:ring-secondary" />
            <label htmlFor="remember" className="text-sm font-medium text-gray-700">Remember me</label>
          </div>

          <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-md">Sign In</button>
        </form>

        {resetMessage && <p className="mt-4 text-center text-sm text-green-500">{resetMessage}</p>}
      </motion.div>
    </div>
  );
};

export default Signin;
