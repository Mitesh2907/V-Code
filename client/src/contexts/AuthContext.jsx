import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vcode-user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      // ignore parse errors
      console.error('Failed to read auth from localStorage', err);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
    };
    
    setUser(mockUser);
    localStorage.setItem('vcode-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    setUser(mockUser);
    localStorage.setItem('vcode-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vcode-user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};