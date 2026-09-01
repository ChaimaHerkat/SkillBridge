import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { User } from "../types/user";

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
        localStorage.removeItem("mockPassword");
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
      const storedUser = localStorage.getItem("user");
      const storedPassword =
        localStorage.getItem("mockPassword");

      /*
        No registered user found
      */
      if (!storedUser) {
        throw new Error(
          "No account found. Please create an account first."
        );
      }

      const parsedUser: User = JSON.parse(storedUser);

      /*
        Check email
      */
      if (
        parsedUser.email.toLowerCase() !==
        email.toLowerCase()
      ) {
        throw new Error(
          "Incorrect email or password."
        );
      }

      /*
        Check password
      */
      if (storedPassword !== password) {
        throw new Error(
          "Incorrect email or password."
        );
      }

      /*
        Login successful
      */
      setUser(parsedUser);

      localStorage.setItem(
        "authToken",
        "mock-token"
      );

    } catch (error) {
      throw error;
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
      /*
        Check if an account already exists
      */
      const existingUser =
        localStorage.getItem("user");

      if (existingUser) {
        const parsedUser: User =
          JSON.parse(existingUser);

        if (
          parsedUser.email.toLowerCase() ===
          email.toLowerCase()
        ) {
          throw new Error(
            "An account with this email already exists."
          );
        }
      }

      /*
        Create new user
      */
      const newUser: User = {
        id: Date.now().toString(),

        username: email
          .split("@")[0]
          .toLowerCase(),

        email: email,

        firstName: firstName,

        lastName: lastName,

        role: role,

        createdAt: new Date(),

        updatedAt: new Date(),
      };

      /*
        Save user
      */
      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );

      /*
        Save password temporarily
        ONLY for mock development
      */
      localStorage.setItem(
        "mockPassword",
        password
      );

      /*
        Create mock authentication token
      */
      localStorage.setItem(
        "authToken",
        "mock-token"
      );

      /*
        Update application state
      */
      setUser(newUser);

    } catch (error) {
      throw error;
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

    localStorage.removeItem("mockPassword");

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