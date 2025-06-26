import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  userId: number;
  username?: string;
  isActive?: boolean;
  teamId?: number;  // burayı ekle
  profileImage?: string;

}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('userToken'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          userId: decoded.userId || decoded.id,
          username: decoded.username,
          isActive: decoded.isActive,
          teamId: decoded.teamId,  
          profileImage: decoded.profileImage,  
        });
        localStorage.setItem('userToken', token);
      } catch (error) {
        console.error('Token decode edilemedi', error);
        setUser(null);
        localStorage.removeItem('userToken');
      }
    } else {
      setUser(null);
      localStorage.removeItem('userToken');
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
