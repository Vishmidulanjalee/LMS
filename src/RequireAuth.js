import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a simple function to check if the user is logged in or not
const isAuthenticated = () => {
  // You can replace this logic with your actual authentication logic
  return localStorage.getItem('user') ? true : false; // For example, check if 'user' exists in localStorage
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/Signin" />; // If not authenticated, redirect to SignIn
};

export default PrivateRoute;
