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
  chats: Chat[] | null; // Add chats to state
}

interface AuthContextType extends AuthState {
  sendOTP: (email: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

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
    async function checkAuth() {
      try {
        const response = await fetch('http://localhost:3001/user', {
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
    }
    checkAuth();
  }, []);

  // Send OTP to email (calls /login on Express)
  const sendOTP = async (email: string) => {
    try {
      const response = await fetch('http://localhost:3001/login', {
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

  // Login with OTP (calls /verifyOTP on Express)
  const loginWithOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch('http://localhost:3001/verifyOTP', {
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
      await fetch('http://localhost:3001/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setAuthState({ isLoggedIn: false, username: null, email: null, chats: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = { ...authState, sendOTP, loginWithOTP, logout };

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
}