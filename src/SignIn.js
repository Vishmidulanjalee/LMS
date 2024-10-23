import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from './firebase'; // Import auth and db directly
import LogoBig from './assets/LogoBig.png';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      });

      navigate('/signin');
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already in use.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError('Failed to sign up. Please try again.');
      }
    }
  };

  return (
    <div className="container">
      <motion.div className="left-section" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <h1>Welcome</h1>
        <p>Create an account to start learning</p>
        <img src={LogoBig} alt="The Bee Academy Logo" width={500} height={500} className="mb-0" />
      </motion.div>

      <motion.div className="right-section" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form className="space-y-8" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <button type="submit" className="button">Sign Up</button>
          </div>
        </form>
        <p className="footer">
          Already have an account? <Link to="/signin" className="font-medium text-primary hover:text-secondary">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
