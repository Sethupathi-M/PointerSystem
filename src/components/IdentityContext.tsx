"use client";

import { Identity } from "@/generated/prisma";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType extends Identity {
  isLoggedIn: boolean;
  user: Identity | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const defaultAuthContext: AuthContextType = {
  id: "",
  name: "",
  description: "",
  requiredPoints: 0,
  isActive: false,
  createdAt: new Date(),
  isLoggedIn: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  fetchUser: async () => {},
};

export const IdentityContext =
  createContext<AuthContextType>(defaultAuthContext);

export const IdentityProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Identity | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch user data from server (cookie-based)
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/me", {
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsLoggedIn(true);
      } else {
        // No valid session
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      // Server sets httpOnly cookie, fetch user data
      await fetchUser();

      // Redirect to last visited path or default to home
      const lastPath = localStorage.getItem("lastVisitedPath");
      console.log("lastPath", lastPath);
      const redirectPath = lastPath && lastPath !== "/login" ? lastPath : "/";
      router.push(redirectPath);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggedIn(false);
      setUser(null);
      setToken(null);
      router.push("/login");
    }
  };

  // Initialize on mount - check auth state
  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    id: user?.id || "",
    name: user?.name || "",
    description: user?.description || "",
    requiredPoints: user?.requiredPoints || 0,
    isActive: user?.isActive || false,
    createdAt: user?.createdAt || new Date(),
    isLoggedIn,
    user,
    token,
    login,
    logout,
    fetchUser,
  };

  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentityContext = () => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error("useIdentityContext must be used within IdentityProvider");
  }
  return context;
};
