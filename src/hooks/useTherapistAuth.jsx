import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext(null);

export const TherapistAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check localStorage for therapist session
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("therapist");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to restore therapist session", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/therapist/therapist-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.status !== 200) throw new Error(data.error || "Login failed");

      localStorage.setItem("therapist", JSON.stringify(data));
      setUser(data);

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.name || "Therapist"}!`,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    // console.log(userData);
    
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/therapist/therapist-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      localStorage.setItem("therapist", JSON.stringify(data));
      setUser(data);

      toast({
        title: "Account created",
        description: "Welcome to ZenZone!",
      });

      navigate("/quiz");
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Try again",
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const mockUser = {
        id: "789012",
        name: "Google User",
        email: "googleuser@example.com",
      };

      localStorage.setItem("therapist", JSON.stringify(mockUser));
      setUser(mockUser);

      toast({
        title: "Google login successful",
        description: "Welcome to ZenZone!",
      });

      navigate("/");
    } catch {
      toast({
        title: "Google login failed",
        description: "Issue with Google authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("therapist");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useTherapistAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useTherapistAuth must be used within TherapistAuthProvider");
  }
  return context;
};
