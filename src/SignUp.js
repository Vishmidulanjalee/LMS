import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from './firebase';
import LogoBig from './assets/LogoBig.png';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
      });
      navigate('/signIn');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setEmailError('This email is already in use. You can sign in.');
          navigate('/signIn');
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

  const PasswordInput = (
    <div className="relative mt-1 w-4/5">
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
      {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
    </div>
  );

  return (
    <div>
      {isSmallScreen ? (
        <div className="flex min-h-screen items-center justify-center bg-yellow-100 px-4 sm:px-6 lg:px-8">
          <motion.div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Sign Up</h2>
              <p className="mt-3 text-lg text-gray-600">Please enter your details to start learning</p>
            </div>

            <form className="mt-12 space-y-6" onSubmit={handleSignUp}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
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
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                {PasswordInput}
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember_me" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="remember_me" className="text-sm text-gray-700">Remember me</label>
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md">Sign Up</button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary hover:text-secondary">Sign In</Link>
            </p>

            <div className="mt-12 flex justify-center">
              <img src={LogoBig} alt="Logo" className="w-full max-w-[300px]" />
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="flex min-h-screen bg-gradient-to-br from-white to-yellow-200">
          <motion.div className="w-1/2 p-12 flex flex-col justify-center items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-4">Welcome</h1>
            <p className="text-xl mb-20">Sign up to start your learning</p>
            <img src={LogoBig} alt="Logo" width={500} />
          </motion.div>

          <motion.div className="w-1/2 bg-white p-12 flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 ml-10">Sign Up</h2>
            <form className="space-y-6 ml-10" onSubmit={handleSignUp}>
              {/* Username Field */}
              <div className="mt-15">

                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-4/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                {PasswordInput}
              </div>

              <div className="flex items-center space-x-2 w-4/5">
                <input type="checkbox" id="remember_me" className="h-4 w-4 rounded border-gray-300" />
                <label htmlFor="remember_me" className="text-sm text-gray-700">Remember me</label>
              </div>

              <button type="submit" className="w-4/5 bg-primary hover:bg-secondary text-white py-2 px-4 rounded-md mt-4">Sign Up</button>
            </form>

            <p className="mt-4 w-4/5 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-primary hover:text-secondary">Sign In</Link>
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Signup;

