import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  // Check for token in cookies (you can adapt this based on your authentication method)
  const token = Cookies.get("token"); // Replace 'token' with the actual name of the cookie

  // If token doesn't exist, redirect to the sign-in page
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the child component (protected page)
  return children;
};

export default ProtectedRoute;
