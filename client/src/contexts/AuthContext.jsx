import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../configs/api"; // axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 App reload hone par user restore karo
useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("vcode-token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("vcode-token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  initAuth();
}, []);

  // 🔐 LOGIN
const login = async (email, password) => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = res.data;

    localStorage.setItem("vcode-token", token);
    localStorage.setItem("vcode-user", JSON.stringify(user));
    setUser(user);

    return user;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};




  // 📝 REGISTER
  const signup = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        fullName,
        email,
        password,
        confirmPassword,
      });

      localStorage.setItem("vcode-token", data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("vcode-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
