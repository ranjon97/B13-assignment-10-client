import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authApi } from "@/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (payload) => {
    const registeredUser = await authApi.register(payload);
    setUser(registeredUser);
    return registeredUser;
  };

  const login = async (payload) => {
    const loggedInUser = await authApi.login(payload);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginWithGoogleToken = async (idToken) => {
    const loggedInUser = await authApi.googleLogin(idToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    role: user?.role || null,
    isBlocked: user?.status === "blocked",
    register,
    login,
    loginWithGoogleToken,
    logout,
    refreshUser: loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
