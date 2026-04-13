'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface ListeningStats {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  comprehensionRate: number;
  todayProgress: number;
  byDifficulty: {
    BEGINNER: number;
    INTERMEDIATE: number;
    ADVANCED: number;
    EXPERT: number;
  };
  timeSpent: number; // 分钟
}

interface ListeningResource {
  id: string;
  title: string;
  description: string;
  duration: number; // 秒
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  accent: 'AMERICAN' | 'BRITISH' | 'AUSTRALIAN' | 'OTHER';
  category: 'CONVERSATION' | 'NEWS' | 'LECTURE' | 'INTERVIEW' | 'STORY';
  points: number;
  completed?: boolean;
  score?: number;
  completedAt?: string;
}

export default function ListeningPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ListeningStats>({
    totalExercises: 0,
    completedExercises: 0,
    averageScore: 0,
    comprehensionRate: 0,
    todayProgress: 0,
    byDifficulty: {
      BEGINNER: 0,
      INTERMEDIATE: 0,
      ADVANCED: 0,
      EXPERT: 0,
    },
    timeSpent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentResources, setRecentResources] = useState<ListeningResource[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<ListeningResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        // 获取统计数据
        // 获取最近资源
        // 获取推荐资源

        // 模拟数据
        setTimeout(() => {
          setStats({
            totalExercises: 85,
            completedExercises: 32,
            averageScore: 72,
            comprehensionRate: 68,
            todayProgress: 60,
            byDifficulty: {
              BEGINNER: 12,
              INTERMEDIATE: 15,
              ADVANCED: 4,
              EXPERT: 1,
            },
            timeSpent: 245, // 4小时5分钟
          });

          setRecentResources([
            {
              id: '1',
              title: '机场对话',
              description: '旅客与工作人员的日常对话',
              duration: 120,
              difficulty: 'BEGINNER',
              accent: 'AMERICAN',
              category: 'CONVERSATION',
              points: 10,
              completed: true,
              score: 85,
              completedAt: '2024-04-09'
            },
            {
              id: '2',
              title: '科技新闻',
              description: '关于人工智能发展的新闻报道',
              duration: 180,
              difficulty: 'INTERMEDIATE',
              accent: 'BRITISH',
              category: 'NEWS',
              points: 15,
              completed: true,
              score: 78,
              completedAt: '2024-04-08'
            },
            {
              id: '3',
              title: '大学讲座',
              description: '环境科学课堂讲座片段',
              duration: 300,
              difficulty: 'ADVANCED',
              accent: 'AMERICAN',
              category: 'LECTURE',
              points: 20,
              completed: false
            },
            {
              id: '4',
              title: '名人采访',
              description: '知名演员的访谈节目',
              duration: 240,
              difficulty: 'INTERMEDIATE',
              accent: 'AUSTRALIAN',
              category: 'INTERVIEW',
              points: 15,
              completed: true,
              score: 92,
              completedAt: '2024-04-07'
            },
            {
              id: '5',
              title: '短篇故事',
              description: '经典英文短篇故事朗读',
              duration: 150,
              difficulty: 'BEGINNER',
              accent: 'BRITISH',
              category: 'STORY',
              points: 10,
              completed: false
            }
          ]);

          setRecommendedResources([
            {
              id: '6',
              title: '商务会议',
              description: '公司项目讨论会议记录',
              duration: 200,
              difficulty: 'INTERMEDIATE',
              accent: 'AMERICAN',
              category: 'CONVERSATION',
              points: 15,
              completed: false
            },
            {
              id: '7',
              title: '天气预报',
              description: '多城市天气预报播报',
              duration: 90,
              difficulty: 'BEGINNER',
              accent: 'BRITISH',
              category: 'NEWS',
              points: 8,
              completed: false
            },
            {
              id: '8',
              title: '学术演讲',
              description: 'TED演讲片段',
              duration: 240,
              difficulty: 'ADVANCED',
              accent: 'AMERICAN',
              category: 'LECTURE',
              points: 20,
              completed: false
            }
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取听力数据错误:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
    EXPERT: 'bg-red-100 text-red-800',
  };

  const difficultyText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
    EXPERT: '专家',
  };

  const accentColors: Record<string, string> = {
    AMERICAN: 'bg-red-100 text-red-800',
    BRITISH: 'bg-blue-100 text-blue-800',
    AUSTRALIAN: 'bg-yellow-100 text-yellow-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  const accentText: Record<string, string> = {
    AMERICAN: '美音',
    BRITISH: '英音',
    AUSTRALIAN: '澳音',
    OTHER: '其他',
  };

  const categoryColors: Record<string, string> = {
    CONVERSATION: 'bg-indigo-100 text-indigo-800',
    NEWS: 'bg-green-100 text-green-800',
    LECTURE: 'bg-purple-100 text-purple-800',
    INTERVIEW: 'bg-pink-100 text-pink-800',
    STORY: 'bg-yellow-100 text-yellow-800',
  };

  const categoryText: Record<string, string> = {
    CONVERSATION: '对话',
    NEWS: '新闻',
    LECTURE: '讲座',
    INTERVIEW: '采访',
    STORY: '故事',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredResources = recentResources.filter(resource => {
    const matchesCategory = selectedCategory === 'ALL' || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || resource.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载听力数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">听力训练</h1>
        <p className="text-gray-600 mt-2">
          通过真实语境听力练习，提升英语听力理解能力
        </p>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">完成练习</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedExercises}</p>
              <p className="text-sm text-gray-600 mt-1">共{stats.totalExercises}个练习</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>完成率</span>
              <span>{Math.round((stats.completedExercises / stats.totalExercises) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${(stats.completedExercises / stats.totalExercises) * 100}%` }}
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
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${stats.comprehensionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日进度</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayProgress}%</p>
              <p className="text-sm text-gray-600 mt-1">今日目标完成度</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>推荐练习</span>
              <span>2-3个资源</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${stats.todayProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总学习时间</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(stats.timeSpent / 60)}</p>
              <p className="text-sm text-gray-600 mt-1">小时{stats.timeSpent % 60}分钟</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>难度分布</span>
              <span className="font-medium">
                {stats.byDifficulty.BEGINNER + stats.byDifficulty.INTERMEDIATE}初级/中级
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${(stats.byDifficulty.BEGINNER + stats.byDifficulty.INTERMEDIATE) / stats.completedExercises * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/listening/all"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">▶️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">听力练习</h3>
            <p className="text-gray-600 mb-6">
              逐句精听、变速播放、理解练习
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始练习
            </div>
          </Link>

          <Link
            href="/listening/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">听力测试</h3>
            <p className="text-gray-600 mb-6">
              限时听力理解测试，检验听力水平
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>

          <Link
            href="/listening/resources"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">资源库</h3>
            <p className="text-gray-600 mb-6">
              按难度和分类浏览听力资源
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              浏览资源
            </div>
          </Link>
        </div>
      </div>

      {/* 推荐资源 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">推荐资源</h2>
          <Link
            href="/listening/all"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部资源
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedResources.map((resource) => (
            <div
              key={resource.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[resource.difficulty]}`}>
                    {difficultyText[resource.difficulty]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${accentColors[resource.accent]}`}>
                    {accentText[resource.accent]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">⏱️</span>
                    <span className="text-sm font-medium">{formatDuration(resource.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">📂</span>
                    <span className={`text-xs font-medium ${categoryColors[resource.category]}`}>
                      {categoryText[resource.category]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-1">⭐</span>
                  <span className="text-sm font-medium">{resource.points} 积分</span>
                </div>
              </div>

              <Link
                href="/listening/all"
                className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                {resource.completed ? '查看详情' : '开始练习'}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 最近练习记录 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近练习</h2>
          <div className="flex items-center space-x-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">全部分类</option>
              {Object.entries(categoryText).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="ALL">全部难度</option>
              {Object.entries(difficultyText).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <Link
              href="/listening/history"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              查看全部记录
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">资源标题</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">时长</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">难度</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">口音</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">分数</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">完成时间</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">状态</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{resource.title}</div>
                    <div className="text-sm text-gray-500">{resource.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">⏱️</span>
                      <span>{formatDuration(resource.duration)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[resource.difficulty]}`}>
                      {difficultyText[resource.difficulty]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${accentColors[resource.accent]}`}>
                      {accentText[resource.accent]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {resource.completed ? (
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">{resource.score}</div>
                        <div className="text-sm text-gray-500 ml-2">/ 100</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">-</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {resource.completedAt ? new Date(resource.completedAt).toLocaleDateString('zh-CN') : '-'}
                  </td>
                  <td className="py-4 px-4">
                    {resource.completed ? (
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
                      href="/listening/all"
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      {resource.completed ? '查看详情' : '开始练习'}
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">听力学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">从慢速听力开始，逐步提高语速</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">多次重复听同一材料，直到完全理解</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">先听大意，再听细节，最后听关键词</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">结合文本对照，提高听力理解能力</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">今日目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">完成听力练习</span>
                <span className="font-medium">2-3个资源</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">目标理解率</span>
                <span className="font-medium">70%以上</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">学习时间</span>
                <span className="font-medium">20-30分钟</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}