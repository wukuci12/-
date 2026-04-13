'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: '仪表板', href: '/', icon: '🏠' },
  { name: '词汇学习', href: '/vocabulary', icon: '📚' },
  { name: '语法练习', href: '/grammar', icon: '📝' },
  { name: '听力训练', href: '/listening', icon: '🎧' },
  { name: '阅读理解', href: '/reading', icon: '📖' },
  { name: '写作练习', href: '/writing', icon: '✏️' },
  { name: '口语对话', href: '/speaking', icon: '🗣️' },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 默认用户（无需登录）
  const defaultUser = user || {
    id: '1',
    email: 'guest@example.com',
    username: 'guest',
    name: '访客',
    level: 'BEGINNER',
    points: 0,
    streak: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">EL</span>
              </div>
              <span className="text-xl font-bold text-gray-900">English Learning</span>
            </Link>
          </div>

          {/* 用户信息 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-medium">
                  {defaultUser.name?.[0] || defaultUser.username?.[0] || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{defaultUser.name || defaultUser.username}</p>
                <p className="text-sm text-gray-500">{defaultUser.email}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-600">等级:</span>{' '}
                <span className="font-medium text-indigo-600">{defaultUser.level}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">积分:</span>{' '}
                <span className="font-medium text-green-600">{defaultUser.points}</span>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 底部 */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => logout()}
              className="flex items-center justify-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <span className="mr-2">🚪</span>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* 顶部栏 */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? '✕' : '☰'}
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-900">
                {navItems.find(item => pathname === item.href || pathname.startsWith(item.href + '/'))?.name || '仪表板'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">连续学习</span>
                <span className="font-medium text-gray-900">{defaultUser.streak} 天</span>
              </div>
              <div className="relative">
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-indigo-600 font-medium">
                    {defaultUser.name?.[0] || defaultUser.username?.[0] || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}