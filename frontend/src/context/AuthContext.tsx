import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { User } from "../types/user";
import authService from "../services/authService";
import { isTokenExpired } from "../utils/jwt";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "client" | "freelancer"
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* =====================================================
     CHECK EXISTING SESSION
  ===================================================== */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");

    if (storedUser && authToken) {
      // Check if token has expired
      if (isTokenExpired(authToken)) {
        // Clear expired session
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
      } else {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error(
            "Failed to restore user session:",
            error
          );

          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
        }
      }
    }

    setIsLoading(false);
  }, []);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = async (
    email: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);

      // authService stores token and user in localStorage
      const user = res as unknown as User;
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: "client" | "freelancer"
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // Call API to create account
      await authService.register(
        email,
        password,
        firstName,
        lastName,
        role
      );

      // After successful registration, log the user in to get token
      const loginRes = await authService.login(email, password);
      const user = loginRes as unknown as User;
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem("authToken");

    localStorage.removeItem("user");

    setUser(null);
  };

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,

        isLoading,

        isAuthenticated: !!user,

        login,

        register,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =====================================================
   USE AUTH
===================================================== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};