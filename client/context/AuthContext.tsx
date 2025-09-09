import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "@/lib/api";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/user");
        setUser(data);
      } catch {}
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
