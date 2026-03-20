import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Session timeout: 48 hours in milliseconds
const SESSION_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'sub-admin';
  permissions?: string[];
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = [
  {
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'Admin@123',
    name: 'Super Admin',
    role: 'super-admin' as const,
    isActive: true,
  },
  {
    id: 'subadmin-001',
    email: 'subadmin@example.com',
    password: 'SubAdmin@123',
    name: 'Sub Admin',
    role: 'sub-admin' as const,
    permissions: ['users:read', 'posts:read', 'reports:read'],
    isActive: true,
  },
  {
    id: 'inactive-001',
    email: 'inactive@example.com',
    password: 'Inactive@123',
    name: 'Inactive User',
    role: 'sub-admin' as const,
    isActive: false,
  },
  {
    id: 'locked-001',
    email: 'locked@example.com',
    password: 'Locked@123',
    name: 'Locked User',
    role: 'sub-admin' as const,
    isActive: true,
    isLocked: true,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update last activity timestamp
  const updateLastActivity = () => {
    if (user) {
      localStorage.setItem('lastActivityTime', Date.now().toString());
    }
  };

  // Check if session is expired
  const isSessionExpired = (lastActivityTime: number): boolean => {
    const currentTime = Date.now();
    return currentTime - lastActivityTime > SESSION_TIMEOUT;
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const lastActivityTime = localStorage.getItem('lastActivityTime');

        if (token && userData && lastActivityTime) {
          const lastActivity = parseInt(lastActivityTime, 10);
          
          // Check if session has expired
          if (isSessionExpired(lastActivity)) {
            // Session expired, clear everything
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('lastActivityTime');
            toast.error('Your session has expired. Please login again.');
          } else {
            // Session is still valid
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            // Update last activity time on page load
            updateLastActivity();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('lastActivityTime');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Track user activity to extend session
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateLastActivity();
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Set up interval to check session expiration every minute
    const checkInterval = setInterval(() => {
      const lastActivityTime = localStorage.getItem('lastActivityTime');
      if (lastActivityTime) {
        const lastActivity = parseInt(lastActivityTime, 10);
        if (isSessionExpired(lastActivity)) {
          // Auto logout
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('lastActivityTime');
          setUser(null);
          toast.error('Your session has expired due to inactivity. Please login again.');
        }
      }
    }, 60000); // Check every minute

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(checkInterval);
    };
  }, [user]);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find user by email
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Check if user exists
    if (!foundUser) {
      throw new Error('Invalid email or password.');
    }

    // Check password
    if (foundUser.password !== password) {
      throw new Error('Invalid email or password.');
    }

    // Check if account is locked
    if ('isLocked' in foundUser && foundUser.isLocked) {
      throw new Error('Your account is locked. Please reset your password.');
    }

    // Check if account is active
    if (!foundUser.isActive) {
      throw new Error('Your account is inactive.');
    }

    // Create user object (without password)
    const { password: _, isLocked, ...userWithoutPassword } = foundUser as any;
    
    // Generate mock token
    const token = `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Store in localStorage with timestamp
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
    localStorage.setItem('lastActivityTime', Date.now().toString());

    // Update state
    setUser(userWithoutPassword);

    // Show success message
    toast.success('Login successful!');
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('lastActivityTime');
    setUser(null);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}