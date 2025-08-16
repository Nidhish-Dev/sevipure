import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    flatHouseNo: string;
    areaStreet: string;
    landmark?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Memoize the useAuth hook to prevent recreation on every render
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const autoLogoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    console.log('Logging out user');
    
    // Clear auto-logout timeout
    if (autoLogoutTimeoutRef.current) {
      clearTimeout(autoLogoutTimeoutRef.current);
      autoLogoutTimeoutRef.current = null;
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // 🔧 Helper: schedule auto logout safely
  const scheduleAutoLogout = useCallback((expirationTime: number) => {
    const currentTime = Date.now();
    let timeUntilExpiry = expirationTime - currentTime;

    if (timeUntilExpiry <= 0) {
      logout();
      return;
    }

    // Max safe delay for setTimeout (~24.8 days)
    const MAX_TIMEOUT = 2147483647;

    if (timeUntilExpiry > MAX_TIMEOUT) {
      console.log(`⌛ Scheduling intermediate timeout, will re-check later. Remaining: ${timeUntilExpiry}ms`);
      autoLogoutTimeoutRef.current = setTimeout(() => {
        scheduleAutoLogout(expirationTime);
      }, MAX_TIMEOUT);
    } else {
      console.log(`⏰ Auto-logout scheduled in ${timeUntilExpiry}ms`);
      autoLogoutTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Auto-logout timeout triggered');
        logout();
      }, timeUntilExpiry);
    }
  }, [logout]);

  useEffect(() => {
    // Check for existing token on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      // Clear existing auto-logout timeout
      if (autoLogoutTimeoutRef.current) {
        clearTimeout(autoLogoutTimeoutRef.current);
        autoLogoutTimeoutRef.current = null;
      }

      const timeoutId = setTimeout(() => {
        try {
          console.log('🔍 Checking token expiration...');
          console.log('Token:', token.substring(0, 50) + '...');
          
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          console.log('Token data:', tokenData);
          
          const expirationTime = tokenData.exp * 1000; // Convert to ms
          const currentTime = Date.now();
          
          console.log('Expiration time:', new Date(expirationTime));
          console.log('Current time:', new Date(currentTime));
          console.log('Time until expiry:', expirationTime - currentTime, 'ms');
          
          if (currentTime >= expirationTime + 1000) { 
            console.log('❌ Token expired, logging out');
            logout();
          } else {
            console.log('✅ Token valid, scheduling auto-logout');
            scheduleAutoLogout(expirationTime);
          }
        } catch (error) {
          console.error('❌ Error parsing token:', error);
          // don't force logout on parse error
        }
      }, 100); // small delay to avoid race conditions

      return () => {
        console.log('🧹 Clearing token check timeout');
        clearTimeout(timeoutId);
      };
    }
  }, [token, logout, scheduleAutoLogout]);

  // Debug: monitor auth state
  useEffect(() => {
    console.log('🔄 Auth state changed:', {
      user: !!user,
      token: !!token,
      isAuthenticated: !!user && !!token
    });
  }, [user, token]);

  const login = useCallback((userData: User, authToken: string) => {
    console.log('🔐 Starting login process...');
    console.log('User data:', userData);
    console.log('Auth token:', authToken.substring(0, 50) + '...');
    
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ Login completed - states updated and stored in localStorage');
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
    loading
  }), [user, token, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
