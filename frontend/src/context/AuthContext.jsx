import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('coop365_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token) => {
    const userObj = typeof userData === 'object' ? userData : { phone: userData };
    setUser(userObj);
    localStorage.setItem('coop365_user', JSON.stringify(userObj));
    if (token) {
      localStorage.setItem('coop365_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('coop365_user');
    localStorage.removeItem('coop365_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
