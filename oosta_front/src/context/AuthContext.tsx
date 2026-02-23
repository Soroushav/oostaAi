import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (access: string, refresh: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setIsAuthenticated(true);
  };

  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;