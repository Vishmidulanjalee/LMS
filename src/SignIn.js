import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from "firebase/auth";  // Updated import
import { auth } from './firebase'; // Import only auth
import LogoBig from './assets/LogoBig.png';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    try {
      // Use signInWithEmailAndPassword to authenticate users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // If sign-in is successful, navigate to the dashboard
      navigate('/dashboard');
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-yellow-200">
      {/* Left Section */}
      <motion.div 
        className="w-1/2 p-12 flex flex-col justify-center items-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold mb-4">Welcome</h1>
        <p className="text-xl mb-20">Sign in to start your learning</p>
        <img 
          src={LogoBig}
          alt="The Bee Academy Logo" 
          width={500} 
          height={500}
          className="mb-0"
        />
      </motion.div>

      {/* Right Section */}
      <motion.div 
        className="w-1/2 bg-white p-12 flex flex-col justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-5xl font-bold ml-10">Sign In</h2>
        <form className="space-y-8 ml-10" onSubmit={handleSignIn}>
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

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between w-4/5">
            <div className="flex items-center -mt-5">
              <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm -mt-5">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-secondary">Forgot password?</Link>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button type="submit" className="w-4/5 flex justify-center py-2 px-4 mt-16 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Sign In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 w-4/5 pl-16 text-center text-sm text-gray-600">
          Don't have an account? {' '}
          <Link to="/signup" className="font-medium text-primary hover:text-secondary">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signin;
