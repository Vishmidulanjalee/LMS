import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from './firebase'; // Import auth and db directly
import LogoBig from './assets/LogoBig.png';

const Signup = () => {
  const [username, setUsername] = useState(''); // Added state for username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store user data in Firestore, including the username
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
      });
      console.log("User saved:", { username, email: user.email });
      
  
      // Navigate to the sign-in page after successful sign-up
      navigate('/signIn');
    } catch (error) {
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
  
      // Handle specific errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          // Allow navigation even if the email is already in use
          setEmailError('This email is already in use. You can sign in.');
          navigate('/signIn');  // Navigate to sign-in
          break;
        case 'auth/invalid-email':
          setEmailError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setPasswordError('Password should be at least 6 characters.');
          break;
        default:
          setEmailError('Failed to sign up. Please try again.');
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
        <p className="text-xl mb-20">Sign up to start your learning</p>
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
        <h2 className="text-5xl font-bold  ml-10">Sign Up</h2>
        <form className="space-y-8 ml-10" onSubmit={handleSignUp}>
          {/* Username Field */}
          <div className="mt-20">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {/* Email Field */}
          <div className="mb-10">
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

          {/* Sign Up Button */}
          <div>
        <button 
           type="submit" 
            className="w-4/5 flex justify-center py-2 px-4 mt-16 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
         Sign Up
        </button>
      </div>

        </form>

        <p className="mt-4 w-4/5 pl-16 text-center text-sm text-gray-600 ">
          Already have an account? {' '}
          <Link to="/signin" className="font-medium text-primary hover:text-secondary">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
