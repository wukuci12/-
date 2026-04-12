'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface ReadingStats {
  totalArticles: number;
  completedArticles: number;
  averageScore: number;
  averageTime: number; // 平均阅读时间（分钟）
  comprehensionRate: number; // 理解率
  byLevel: {
    BEGINNER: number;
    INTERMEDIATE: number;
    ADVANCED: number;
  };
  byGenre: {
    STORY: number;
    NEWS: number;
    SCIENCE: number;
    HISTORY: number;
    CULTURE: number;
    OTHER: number;
  };
}

interface ReadingResource {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: 'STORY' | 'NEWS' | 'SCIENCE' | 'HISTORY' | 'CULTURE' | 'OTHER';
  wordCount: number;
  estimatedTime: number; // 预计阅读时间（分钟）
  completed?: boolean;
  score?: number;
  completedAt?: string;
}

export default function ReadingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReadingStats>({
    totalArticles: 0,
    completedArticles: 0,
    averageScore: 0,
    averageTime: 0,
    comprehensionRate: 0,
    byLevel: {
      BEGINNER: 0,
      INTERMEDIATE: 0,
      ADVANCED: 0,
    },
    byGenre: {
      STORY: 0,
      NEWS: 0,
      SCIENCE: 0,
      HISTORY: 0,
      CULTURE: 0,
      OTHER: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<ReadingResource[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<ReadingResource[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        // 获取统计数据
        // 获取最近阅读文章
        // 获取推荐文章

        // 模拟数据
        setTimeout(() => {
          setStats({
            totalArticles: 85,
            completedArticles: 32,
            averageScore: 76,
            averageTime: 8,
            comprehensionRate: 78,
            byLevel: {
              BEGINNER: 12,
              INTERMEDIATE: 15,
              ADVANCED: 5,
            },
            byGenre: {
              STORY: 10,
              NEWS: 12,
              SCIENCE: 6,
              HISTORY: 3,
              CULTURE: 1,
              OTHER: 0,
            },
          });

          setRecentArticles([
            { id: 'res-1', title: 'The Secret Garden', description: '经典儿童文学作品节选，适合初学者', level: 'BEGINNER', genre: 'STORY', wordCount: 450, estimatedTime: 5, completed: true, score: 85, completedAt: '2024-04-08' },
            { id: 'res-2', title: 'Climate Change Report', description: '关于全球气候变化的新闻报道', level: 'INTERMEDIATE', genre: 'NEWS', wordCount: 680, estimatedTime: 8, completed: true, score: 72, completedAt: '2024-04-07' },
            { id: 'res-3', title: 'Albert Einstein Biography', description: '爱因斯坦生平简介', level: 'INTERMEDIATE', genre: 'HISTORY', wordCount: 750, estimatedTime: 9, completed: false },
            { id: 'res-4', title: 'The Solar System', description: '太阳系行星介绍', level: 'BEGINNER', genre: 'SCIENCE', wordCount: 520, estimatedTime: 6, completed: true, score: 90, completedAt: '2024-04-09' },
            { id: 'res-5', title: 'Artificial Intelligence', description: '人工智能技术发展现状', level: 'ADVANCED', genre: 'SCIENCE', wordCount: 1200, estimatedTime: 15, completed: false },
          ]);

          setRecommendedArticles([
            { id: 'res-6', title: 'Traditional Chinese Festivals', description: '中国传统节日介绍', level: 'BEGINNER', genre: 'CULTURE', wordCount: 600, estimatedTime: 7, completed: false },
            { id: 'res-7', title: 'Global Economic Trends', description: '全球经济趋势分析', level: 'ADVANCED', genre: 'NEWS', wordCount: 950, estimatedTime: 12, completed: false },
            { id: 'res-8', title: 'The Great Wall of China', description: '长城历史与建筑特点', level: 'INTERMEDIATE', genre: 'HISTORY', wordCount: 800, estimatedTime: 10, completed: false },
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取阅读数据错误:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const levelColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
  };

  const levelText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
  };

  const genreColors: Record<string, string> = {
    STORY: 'bg-yellow-100 text-yellow-800',
    NEWS: 'bg-blue-100 text-blue-800',
    SCIENCE: 'bg-green-100 text-green-800',
    HISTORY: 'bg-red-100 text-red-800',
    CULTURE: 'bg-pink-100 text-pink-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  const genreText: Record<string, string> = {
    STORY: '故事',
    NEWS: '新闻',
    SCIENCE: '科学',
    HISTORY: '历史',
    CULTURE: '文化',
    OTHER: '其他',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载阅读数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">阅读理解</h1>
        <p className="text-gray-600 mt-2">
          通过阅读各类英文文章，提高阅读理解能力和词汇量
        </p>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">阅读文章</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedArticles}</p>
              <p className="text-sm text-gray-600 mt-1">共{stats.totalArticles}篇文章</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>完成率</span>
              <span>{Math.round((stats.completedArticles / stats.totalArticles) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(stats.completedArticles / stats.totalArticles) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均分数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
              <p className="text-sm text-gray-600 mt-1">满分100分</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>理解率</span>
              <span>{stats.comprehensionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${stats.comprehensionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均阅读时间</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageTime}</p>
              <p className="text-sm text-gray-600 mt-1">分钟/篇</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>阅读速度</span>
              <span>中等</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">等级分布</p>
              <div className="flex items-end space-x-1 mt-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{stats.byLevel.BEGINNER}</div>
                  <div className="text-xs text-gray-600">初级</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.byLevel.INTERMEDIATE}</div>
                  <div className="text-xs text-gray-600">中级</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{stats.byLevel.ADVANCED}</div>
                  <div className="text-xs text-gray-600">高级</div>
                </div>
              </div>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>当前等级</span>
              <span className="font-medium">{levelText[user?.level || 'BEGINNER']}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min((stats.completedArticles / stats.totalArticles) * 100 * 1.5, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/reading/practice"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📖</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">阅读练习</h3>
            <p className="text-gray-600 mb-6">
              选择适合你水平的文章进行阅读练习
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始阅读
            </div>
          </Link>

          <Link
            href="/reading/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">阅读测试</h3>
            <p className="text-gray-600 mb-6">
              测试你的阅读理解能力，评估阅读水平
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>

          <Link
            href="/reading/resources"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">阅读资源</h3>
            <p className="text-gray-600 mb-6">
              浏览各类英文阅读材料，丰富阅读内容
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              浏览资源
            </div>
          </Link>

          <Link
            href="/reading/history"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">阅读历史</h3>
            <p className="text-gray-600 mb-6">
              查看你的阅读记录和进步轨迹
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium">
              查看历史
            </div>
          </Link>
        </div>
      </div>

      {/* 推荐阅读 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">推荐阅读</h2>
          <Link
            href="/reading/all"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部文章
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedArticles.map((article) => (
            <div
              key={article.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[article.level]}`}>
                  {levelText[article.level]}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[article.genre]}`}>
                  {genreText[article.genre]}
                </span>
                <div className="text-sm text-gray-600">
                  {article.wordCount}词 · {article.estimatedTime}分钟
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⭐</span>
                  <span className="text-sm font-medium">阅读积分</span>
                </div>
                {article.completed ? (
                  <div className="text-green-600 text-sm font-medium">已完成</div>
                ) : (
                  <div className="text-gray-600 text-sm">未开始</div>
                )}
              </div>
              <Link
                href={`/reading/practice/${article.id}`}
                className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                开始阅读
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 最近阅读记录 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近阅读</h2>
          <Link
            href="/reading/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部记录
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">文章标题</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">难度</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">类型</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">分数</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">完成时间</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">状态</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {article.wordCount}词 · {article.estimatedTime}分钟
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[article.level]}`}>
                      {levelText[article.level]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[article.genre]}`}>
                      {genreText[article.genre]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {article.completed ? (
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">{article.score}</div>
                        <div className="text-sm text-gray-500 ml-2">/ 100</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">-</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {article.completedAt ? new Date(article.completedAt).toLocaleDateString('zh-CN') : '-'}
                  </td>
                  <td className="py-4 px-4">
                    {article.completed ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        已完成
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        未开始
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/reading/practice/${article.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      {article.completed ? '查看详情' : '开始阅读'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">阅读学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">每天坚持阅读15-20分钟，培养阅读习惯</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">选择适合自己水平的文章，逐步提高难度</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">阅读时不要每个生词都查字典，先尝试理解上下文</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">完成阅读后做练习题，检验理解程度</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">今日目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">阅读文章</span>
                <span className="font-medium">1-2篇</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">目标分数</span>
                <span className="font-medium">75分以上</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">阅读时间</span>
                <span className="font-medium">20-30分钟</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: '50%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}