import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/check", { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false); // Handle error appropriately
      }
    };

    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Optionally, show a loading state while checking auth
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
