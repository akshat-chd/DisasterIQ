// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuthStatus } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For checking auth on load

  useEffect(() => {
    // On app load, check if we have a valid session cookie
    checkAuthStatus()
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    // apiLogin now returns the user data directly
    const response = await apiLogin(username, password);
    setUser(response.data); // Set the user directly from the response
  };

 const register = async (username, password) => {
   await apiRegister(username, password);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);