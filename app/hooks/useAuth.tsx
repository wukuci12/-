'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  avatar?: string;
  level: string;
  points: number;
  streak: number;
  lastLogin?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据（实际使用请连接后端API）
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'test@example.com': {
    password: 'test123',
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      name: '测试用户',
      level: 'BEGINNER',
      points: 100,
      streak: 0,
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 从 localStorage 恢复会话
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const checkSession = async () => {
    setIsLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  };

  const login = async (emailOrUsername: string, password: string) => {
    setIsLoading(true);
    try {
      // 模拟登录（实际使用请连接后端API）
      const mockUser = MOCK_USERS[emailOrUsername];
      if (mockUser && mockUser.password === password) {
        setUser(mockUser.user);
        localStorage.setItem('user', JSON.stringify(mockUser.user));
      } else {
        throw new Error('邮箱或密码错误');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // 模拟注册（实际使用请连接后端API）
      const newUser: User = {
        id: Date.now().toString(),
        email,
        username,
        name: name || username,
        level: 'BEGINNER',
        points: 0,
        streak: 0,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const refreshUser = async () => {
    await checkSession();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
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
