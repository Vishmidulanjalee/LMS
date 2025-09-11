import React from 'react';
import { Navigate } from 'react-router-dom';

// This function checks if the user is authenticated by looking for a stored user token
const isAuthenticated = () => {
  return localStorage.getItem('user');  // You can modify this logic to fit your needs
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/Signin" />; // Redirect to SignIn if not authenticated
};

export default PrivateRoute;
