/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../services/apiClient";
import {
  adminLogin as adminLoginRequest,
  clearSession,
  me,
  readStoredUser,
  userLogin as userLoginRequest,
  userRegister as userRegisterRequest,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setAuthReady(true);
      return () => {
        mounted = false;
      };
    }

    me()
      .then((sessionUser) => {
        if (mounted) setUser(sessionUser);
      })
      .catch(() => {
        clearSession();
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setAuthReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const adminLogin = async ({ email, password }) => {
    try {
      const sessionUser = await adminLoginRequest({ email, password });
      setUser(sessionUser);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Admin login failed" };
    }
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const registerUser = async ({ name, email, password }) => {
    try {
      const sessionUser = await userRegisterRequest({ name, email, password });
      setUser(sessionUser);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Registration failed" };
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      const sessionUser = await userLoginRequest({ email, password });
      setUser(sessionUser);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message || "Login failed" };
    }
  };

  const logoutUser = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAdmin: user?.role === "admin",
      login: adminLogin,
      logout,
      user,
      isUserLoggedIn: user?.role === "user",
      isAuthReady: authReady,
      adminLogin,
      registerUser,
      loginUser,
      logoutUser,
    }),
    [authReady, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
