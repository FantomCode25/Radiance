import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, this would be an API call to validate the session
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data.error || "Login failed");
      }
  
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
  
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.name || "User"}!`,
      });
  
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your credentials and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          age: userData.age,
          gender: userData.gender,
          dob: userData.dob,
          maritalStatus: userData.maritalStatus,
          profession: userData.profession,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast({
        title: "Account created successfully",
        description: "Welcome to Mental Oasis!",
      });

      navigate('/quiz');
    } catch (error) {
      toast({
        title: "Sign up failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your information and try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // This would integrate with Google OAuth in a real app
      // For demo, we'll just simulate a successful Google login
      const mockUser = {
        id: "789012",
        name: "Google User",
        email: "googleuser@example.com",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      toast({
        title: "Google login successful",
        description: "Welcome to Mental Oasis!",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "There was an issue with Google authentication.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
