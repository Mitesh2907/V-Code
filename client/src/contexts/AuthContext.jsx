import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../configs/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("vcode-token");
      const savedUser = localStorage.getItem("vcode-user");

      // Step 1: restore from localStorage
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Step 2: stop if no token
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Step 3: verify with backend
        const { data } = await api.get("/auth/me");

        const normalizedUser = {
          ...data.user,
          fullName: data.user.fullName || data.user.full_name,
        };

        setUser(normalizedUser);
        localStorage.setItem("vcode-user", JSON.stringify(normalizedUser));
      } catch (error) {
        // Step 4: clear invalid token
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

      // ✅ normalize user
      const normalizedUser = {
        ...user,
        fullName: user.fullName || user.full_name,
      };

      // ✅ save token + user
      localStorage.setItem("vcode-token", token);
      localStorage.setItem("vcode-user", JSON.stringify(normalizedUser));

      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
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

      // ✅ normalize user
      const normalizedUser = {
        ...user,
        fullName: user.fullName || user.full_name,
      };

      // ✅ save token + user
      localStorage.setItem("vcode-token", token);
      localStorage.setItem("vcode-user", JSON.stringify(normalizedUser));

      setUser(normalizedUser);

      return normalizedUser;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
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