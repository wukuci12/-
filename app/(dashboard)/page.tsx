'use client';

import { useAuth } from '@/app/hooks/useAuth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProgressData {
  module: string;
  completed: boolean;
  score?: number;
  timeSpent?: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟获取进度数据
    const fetchProgress = async () => {
      setIsLoading(true);
      // TODO: 实际API调用
      setTimeout(() => {
        setProgress([
          { module: 'VOCABULARY', completed: true, score: 85, timeSpent: 120 },
          { module: 'GRAMMAR', completed: true, score: 78, timeSpent: 90 },
          { module: 'LISTENING', completed: false, score: undefined, timeSpent: 45 },
          { module: 'READING', completed: false, score: undefined, timeSpent: 30 },
          { module: 'WRITING', completed: false, score: undefined, timeSpent: 0 },
          { module: 'SPEAKING', completed: false, score: undefined, timeSpent: 0 },
        ]);
        setIsLoading(false);
      }, 500);
    };

    fetchProgress();
  }, []);

  const moduleNames: Record<string, string> = {
    VOCABULARY: '词汇学习',
    GRAMMAR: '语法练习',
    LISTENING: '听力训练',
    READING: '阅读理解',
    WRITING: '写作练习',
    SPEAKING: '口语对话',
  };

  const moduleIcons: Record<string, string> = {
    VOCABULARY: '📚',
    GRAMMAR: '📝',
    LISTENING: '🎧',
    READING: '📖',
    WRITING: '✏️',
    SPEAKING: '🗣️',
  };

  const moduleColors: Record<string, string> = {
    VOCABULARY: 'bg-blue-100 text-blue-800',
    GRAMMAR: 'bg-green-100 text-green-800',
    LISTENING: 'bg-yellow-100 text-yellow-800',
    READING: 'bg-purple-100 text-purple-800',
    WRITING: 'bg-pink-100 text-pink-800',
    SPEAKING: 'bg-indigo-100 text-indigo-800',
  };

  const moduleLinks: Record<string, string> = {
    VOCABULARY: '/vocabulary',
    GRAMMAR: '/grammar',
    LISTENING: '/listening',
    READING: '/reading',
    WRITING: '/writing',
    SPEAKING: '/speaking',
  };

  const completedCount = progress.filter(p => p.completed).length;
  const totalCount = progress.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* 欢迎部分 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          欢迎回来，{user?.name || user?.username}！
        </h1>
        <p className="text-indigo-100 mb-6">
          今天是您连续学习的第 {user?.streak || 0} 天，继续加油！
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
            <div className="text-2xl font-bold">{user?.points || 0}</div>
            <div className="text-sm opacity-90">学习积分</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
            <div className="text-2xl font-bold">{completedCount}/{totalCount}</div>
            <div className="text-sm opacity-90">完成模块</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1 min-w-[200px]">
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <div className="text-sm opacity-90">总体进度</div>
          </div>
        </div>
      </div>

      {/* 学习进度 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">学习进度</h2>
          <div className="text-sm text-gray-600">
            完成 {completedCount} 个模块中的 {totalCount} 个
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">总体进度</span>
            <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* 模块卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((item) => (
            <Link
              key={item.module}
              href={moduleLinks[item.module] || '#'}
              className={`block border rounded-xl p-6 hover:shadow-md transition ${item.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 ${moduleColors[item.module].split(' ')[0]} rounded-lg flex items-center justify-center`}>
                  <span className="text-2xl">{moduleIcons[item.module]}</span>
                </div>
                {item.completed ? (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    已完成
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                    进行中
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {moduleNames[item.module]}
              </h3>
              <div className="space-y-2">
                {item.score !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">得分</span>
                    <span className="font-medium">{item.score}/100</span>
                  </div>
                )}
                {item.timeSpent !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">学习时间</span>
                    <span className="font-medium">{item.timeSpent} 分钟</span>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>进度</span>
                  <span>{item.completed ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-400'}`}
                    style={{ width: item.completed ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 今日推荐 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">今日推荐</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">每日词汇挑战</h3>
                <p className="text-sm text-gray-600">掌握10个新词汇</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              今天为您准备了10个高中核心词汇，通过多种练习方式巩固记忆。
            </p>
            <Link
              href="/vocabulary"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              开始挑战
              <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">口语练习</h3>
                <p className="text-sm text-gray-600">与AI对话伙伴聊天</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              选择感兴趣的话题，与AI对话伙伴进行实时英语对话练习。
            </p>
            <Link
              href="/speaking"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              开始对话
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: '学习新词', icon: '➕', href: '/vocabulary/learn', color: 'bg-blue-100' },
            { name: '复习词汇', icon: '🔄', href: '/vocabulary/review', color: 'bg-green-100' },
            { name: '语法测试', icon: '📋', href: '/grammar', color: 'bg-yellow-100' },
            { name: '写作练习', icon: '✍️', href: '/writing/practice', color: 'bg-purple-100' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition"
            >
              <div className={`h-16 w-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900">{item.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}