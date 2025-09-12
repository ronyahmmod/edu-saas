"use client";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-check user from API (cookie-based)
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error arise: " + error);
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
