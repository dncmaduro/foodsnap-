
import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  phone: string; // Changed from email to phone
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => void; // Changed parameter from email to phone
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock user for demonstration
  const [user, setUser] = useState<User | null>(null);

  const login = (phone: string, password: string) => {
    // This is just a mock login function
    // In a real app, you would validate credentials with a backend
    setUser({
      id: '1',
      name: 'Demo User',
      phone: phone
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
