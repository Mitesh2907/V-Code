import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 App reload hone par user restore
  useEffect(() => {
  const initAuth = async () => {
    const token = localStorage.getItem("vcode-token");
    const savedUser = localStorage.getItem("vcode-user");

    // 🔥 Step 1: pehle localStorage se user set karo
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 🔥 Step 2: agar token nahi hai to stop
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 🔥 Step 3: backend se verify karo
      const { data } = await api.get("/auth/me");

      setUser(data.user);
      localStorage.setItem("vcode-user", JSON.stringify(data.user));
    } catch (error) {
      // 🔥 Step 4: agar token invalid ho to clear karo
      localStorage.removeItem("vcode-token");
      localStorage.removeItem("vcode-user");
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
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = data;

      localStorage.setItem("vcode-token", token);
      localStorage.setItem("vcode-user", JSON.stringify(user));
      setUser(user);

      return user;
    } catch (error) {
      // 🔥 Backend ka clear message UI tak bhejo (toast ke liye)
      const message =
        error.response?.data?.message || "Invalid email or password";
      throw new Error(message);
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

      const { token, user } = data;

      localStorage.setItem("vcode-token", token);
      localStorage.setItem("vcode-user", JSON.stringify(user));
      setUser(user);

      return user;
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("vcode-token");
    localStorage.removeItem("vcode-user");
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
