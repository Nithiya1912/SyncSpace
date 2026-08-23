import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  fetchCurrentUser,
} from "../services/authService";
import { getToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setStatus("guest");
      return;
    }

    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        setStatus("authenticated");
      })
      .catch(() => {
        logoutRequest();
        setStatus("guest");
      });
  }, []);

  const login = useCallback(async (credentials) => {
    const u = await loginRequest(credentials);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const register = useCallback(async (details) => {
    const u = await registerRequest(details);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = { user, status, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}