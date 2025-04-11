/*"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Chat {
  chatID: string;
  chatTitle: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  email: string | null;
  chats: Chat[] | null;
}

interface AuthContextType extends AuthState {
  sendOTP: (email: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshChats: () => Promise<void>; // New method to refresh chats
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    username: null,
    email: null,
    chats: null,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch user data including chats
  const checkAuth = async () => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        credentials: 'include',
      });
      if (response.ok) {
        const user: { username: string; email: string; chats: Chat[] } = await response.json();
        setAuthState({
          isLoggedIn: true,
          username: user.username,
          email: user.email,
          chats: user.chats,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  // Send OTP to email
  const sendOTP = async (email: string) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };

  // Login with OTP
  const loginWithOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch(`${apiUrl}/verifyOTP`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });
      if (response.ok) {
        const user: { username: string; email: string; chats: Chat[] } = await response.json();
        setAuthState({
          isLoggedIn: true,
          username: user.username,
          email: user.email,
          chats: user.chats,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Login with OTP error:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh chats
  const refreshChats = async () => {
    try {
      const response = await fetch(`${apiUrl}/user`, {
        credentials: 'include',
      });
      if (response.ok) {
        const user: { username: string; email: string; chats: Chat[] } = await response.json();
        setAuthState((prev) => ({
          ...prev,
          chats: user.chats, // Only update chats, preserve other state
        }));
      }
    } catch (error) {
      console.error('Refresh chats failed:', error);
    }
  };

  const value: AuthContextType = { ...authState, sendOTP, loginWithOTP, logout, refreshChats };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}*/

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Chat interface to match getUser response
interface Chat {
  chatID: string;
  chatTitle: string;
}

// Define the AuthState interface
interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  email: string | null;
  chats: Chat[] | null;
}

// Define the AuthContextType with methods
interface AuthContextType extends AuthState {
  sendOTP: (email: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshChats: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    username: null,
    email: null,
    chats: null,
  });

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch user data including chats from /api/user
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user', { // Fixed from /api/user/user
        credentials: 'include', // Include cookies (JWT)
      });
      if (response.ok) {
        const user: { email: string; username: string; chats: Chat[] } = await response.json();
        setAuthState({
          isLoggedIn: true,
          username: user.username,
          email: user.email,
          chats: user.chats,
        });
      } else {
        setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
    }
  };

  // Send OTP to email using /api/login
  const sendOTP = async (email: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error instanceof Error ? error : new Error('Unknown error sending OTP');
    }
  };

  // Login with OTP using /api/auth/verifyOTP
  const loginWithOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include', // Include cookies (JWT)
      });
      if (response.ok) {
        const user: { email: string; username: string; chats?: Chat[] } = await response.json();
        setAuthState({
          isLoggedIn: true,
          username: user.username,
          email: user.email,
          chats: user.chats || null, // Chats might not be returned here
        });
        // Refresh chats after login to ensure we have them
        await refreshChats();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Login with OTP error:', error);
      throw error instanceof Error ? error : new Error('Unknown error during login');
    }
  };

  // Logout using /api/logout
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include', // Include cookies (JWT)
      });
      setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
    } catch (error) {
      console.error('Logout error:', error);
      // Clear state even if logout endpoint fails
      setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
    }
  };

  // Refresh chats from /api/user
  const refreshChats = async () => {
    try {
      const response = await fetch('/api/user', {
        credentials: 'include', // Include cookies (JWT)
      });
      if (response.ok) {
        const user: { email: string; username: string; chats: Chat[] } = await response.json();
        setAuthState((prev) => ({
          ...prev,
          chats: user.chats,
        }));
      } else {
        throw new Error('Failed to refresh chats');
      }
    } catch (error) {
      console.error('Refresh chats failed:', error);
    }
  };

  const value: AuthContextType = { ...authState, sendOTP, loginWithOTP, logout, refreshChats };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}