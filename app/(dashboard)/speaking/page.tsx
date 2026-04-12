'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface SpeakingStats {
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  pronunciationAccuracy: number;
  fluencyScore: number;
  vocabularyScore: number;
  grammarScore: number;
  topicsCovered: number;
  streak: number;
}

interface RecentSession {
  id: string;
  topic: string;
  type: 'DIALOGUE' | 'MONOLOGUE' | 'DISCUSSION';
  score: number;
  duration: number;
  feedback: string;
  completedAt: string;
}

export default function SpeakingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SpeakingStats>({
    totalSessions: 25,
    totalMinutes: 180,
    averageScore: 78,
    pronunciationAccuracy: 82,
    fluencyScore: 75,
    vocabularyScore: 80,
    grammarScore: 76,
    topicsCovered: 15,
    streak: 5,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setRecentSessions([
        {
          id: '1',
          topic: 'Daily Routines',
          type: 'DIALOGUE',
          score: 85,
          duration: 180,
          feedback: 'Excellent pronunciation and natural conversation flow.',
          completedAt: '2024-04-09T10:30:00',
        },
        {
          id: '2',
          topic: 'My Hobbies',
          type: 'MONOLOGUE',
          score: 78,
          duration: 120,
          feedback: 'Good vocabulary usage, consider improving fluency.',
          completedAt: '2024-04-08T14:20:00',
        },
        {
          id: '3',
          topic: 'Environmental Protection',
          type: 'DISCUSSION',
          score: 82,
          duration: 240,
          feedback: 'Strong arguments and good sentence structures.',
          completedAt: '2024-04-07T16:45:00',
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const typeColors: Record<string, string> = {
    DIALOGUE: 'bg-blue-100 text-blue-800',
    MONOLOGUE: 'bg-purple-100 text-purple-800',
    DISCUSSION: 'bg-green-100 text-green-800',
  };

  const typeText: Record<string, string> = {
    DIALOGUE: '对话练习',
    MONOLOGUE: '独白练习',
    DISCUSSION: '话题讨论',
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载口语数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">口语训练</h1>
        <p className="text-gray-600 mt-2">
          练习英语口语，与AI进行实时对话交流
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">练习次数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
              <p className="text-sm text-gray-600 mt-1">次</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎤</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>连续学习</span>
              <span className="font-medium">{stats.streak}天</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(stats.streak * 20, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">练习时长</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.totalMinutes / 60)}</p>
              <p className="text-sm text-gray-600 mt-1">小时{stats.totalMinutes % 60}分钟</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>平均得分</span>
              <span className={`font-medium ${getScoreColor(stats.averageScore)}`}>{stats.averageScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.averageScore}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">发音准确度</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pronunciationAccuracy}%</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔊</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.pronunciationAccuracy}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已覆盖话题</p>
              <p className="text-3xl font-bold text-gray-900">{stats.topicsCovered}</p>
              <p className="text-sm text-gray-600 mt-1">个话题</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>流利度</span>
              <span className="font-medium">{stats.fluencyScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.fluencyScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">开始口语练习</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/speaking/practice"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">对话练习</h3>
            <p className="text-gray-600 mb-6">
              与AI进行情景对话练习
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始对话
            </div>
          </Link>

          <Link
            href="/speaking/practice?type=monologue"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎙️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">主题演讲</h3>
            <p className="text-gray-600 mb-6">
              根据给定话题进行口语表达
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              开始演讲
            </div>
          </Link>

          <Link
            href="/speaking/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">口语测试</h3>
            <p className="text-gray-600 mb-6">
              测试你的口语水平和表达能力
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>
        </div>
      </div>

      {/* 评分维度 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">能力评估</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.pronunciationAccuracy * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-600">{stats.pronunciationAccuracy}%</span>
              </div>
            </div>
            <div className="font-medium text-gray-900">发音准确度</div>
            <div className="text-sm text-gray-500">Pronunciation</div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.fluencyScore * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">{stats.fluencyScore}%</span>
              </div>
            </div>
            <div className="font-medium text-gray-900">流利度</div>
            <div className="text-sm text-gray-500">Fluency</div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.vocabularyScore * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">{stats.vocabularyScore}%</span>
              </div>
            </div>
            <div className="font-medium text-gray-900">词汇运用</div>
            <div className="text-sm text-gray-500">Vocabulary</div>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${stats.grammarScore * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-yellow-600">{stats.grammarScore}%</span>
              </div>
            </div>
            <div className="font-medium text-gray-900">语法准确性</div>
            <div className="text-sm text-gray-500">Grammar</div>
          </div>
        </div>
      </div>

      {/* 最近练习 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近练习</h2>
          <Link
            href="/speaking/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">话题</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">类型</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">得分</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">时长</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">反馈</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-bold text-gray-900">{session.topic}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[session.type]}`}>
                      {typeText[session.type]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                      {session.score}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {formatDuration(session.duration)}
                  </td>
                  <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                    {session.feedback}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(session.completedAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">口语学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">每天坚持练习15-30分钟</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">注意模仿母语者的发音和语调</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">大声朗读以提高发音清晰度</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✓</span>
              <span className="text-gray-700">不要害怕犯错，勇于开口表达</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI评分特点</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✨</span>
              <span className="text-gray-700">实时语音识别和评估</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✨</span>
              <span className="text-gray-700">发音准确度和流利度分析</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✨</span>
              <span className="text-gray-700">语法和词汇使用建议</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✨</span>
              <span className="text-gray-700">个性化改进反馈</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
