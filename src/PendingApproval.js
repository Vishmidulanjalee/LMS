import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoBig from './assets/LogoBig.png';

const PendingApproval = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 p-6">
    <motion.div
      className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <img src={LogoBig} alt="The BEE Academy" className="h-16 mx-auto mb-6" />

      <div className="flex items-center justify-center mb-5">
        <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
          <svg className="h-10 w-10 text-amber-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Received!</h1>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Thank you for registering with <span className="font-semibold text-yellow-500">The BEE Academy</span>. Your application is now under review by our admin team.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6 space-y-3">
        {[
          ['Step 1', 'Account Created', 'Your account has been created successfully.', true],
          ['Step 2', 'Admin Review', 'The admin will review your application.', false],
          ['Step 3', 'Payment Confirmation', 'Once approved, complete your monthly payment.', false],
          ['Step 4', 'Access Granted', 'Log in and start learning!', false],
        ].map(([step, title, desc, done]) => (
          <div key={step} className="flex items-start gap-3">
            <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-400' : 'bg-gray-200'}`}>
              {done
                ? <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <div className="h-2 w-2 rounded-full bg-gray-400" />
              }
            </div>
            <div>
              <p className={`text-xs font-semibold ${done ? 'text-green-600' : 'text-gray-500'}`}>{step} — {title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mb-6">
        You will be able to sign in once your account is approved and payment is confirmed. Check back later.
      </p>

      <Link
        to="/Signin"
        className="inline-block w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition duration-200 text-sm"
      >
        Back to Sign In
      </Link>
    </motion.div>
  </div>
);

export default PendingApproval;
