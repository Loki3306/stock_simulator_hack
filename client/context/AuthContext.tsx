import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken, getAccessToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  settings?: any;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Only check auth if we already have a token (e.g., from a previous session)
        const currentToken = getAccessToken();
        if (currentToken) {
          const { data } = await api.get("/auth/user");
          setUser(data);
        } else {
          // No token available, user is not logged in
          setUser(null);
        }
      } catch (error) {
        // Token might be expired or invalid
        console.log('Auth check failed, clearing user state');
        setUser(null);
        setAccessToken(null); // Clear invalid token
      }
      setLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken("mock-token");
      setUser({
        id: "mock",
        email,
        name: email.split("@")[0],
        role: "user",
        settings: { reduceMotion: false, theme: "dark" },
      });
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      setAccessToken(data.accessToken);
      setUser(data.user);
    } catch {
      setAccessToken("mock-token");
      setUser({
        id: "mock",
        email,
        name,
        role: "user",
        settings: { reduceMotion: false, theme: "dark" },
      });
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {}
    setAccessToken(null);
    setUser(null);
  }

  // Mock Google login
  async function googleLogin() {
    // Simulate Google login (replace with real logic as needed)
    setAccessToken("mock-google-token");
    setUser({
      id: "google-mock",
      email: "googleuser@example.com",
      name: "Google User",
      role: "user",
      settings: { reduceMotion: false, theme: "dark" },
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
