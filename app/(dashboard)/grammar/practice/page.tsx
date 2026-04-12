'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface Exercise {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  points: number;
  questionCount: number;
  timeEstimate: number; // 分钟
  completed?: boolean;
  score?: number;
  completedAt?: string;
  tags: string[];
}

interface Filter {
  level: string;
  completed: string;
  sort: string;
  search: string;
}

export default function GrammarPracticePage() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filter>({
    level: 'all',
    completed: 'all',
    sort: 'level',
    search: '',
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        // const response = await fetch('/api/grammar?limit=100');
        // const data = await response.json();

        // 模拟数据
        setTimeout(() => {
          const mockExercises: Exercise[] = [
            { id: '1', title: '基础时态练习', description: '掌握英语基本时态的用法', level: 'BEGINNER', points: 10, questionCount: 8, timeEstimate: 10, completed: true, score: 92, completedAt: '2024-04-05', tags: ['时态', '基础'] },
            { id: '2', title: '动词不定式', description: '学习动词不定式的各种用法', level: 'BEGINNER', points: 10, questionCount: 6, timeEstimate: 8, completed: true, score: 85, completedAt: '2024-04-06', tags: ['动词', '非谓语'] },
            { id: '3', title: '动名词和现在分词', description: '区分动名词和现在分词的用法', level: 'INTERMEDIATE', points: 15, questionCount: 10, timeEstimate: 12, completed: true, score: 78, completedAt: '2024-04-07', tags: ['非谓语', '语法'] },
            { id: '4', title: '定语从句', description: '掌握定语从句的结构和使用', level: 'INTERMEDIATE', points: 15, questionCount: 12, timeEstimate: 15, completed: false, tags: ['从句', '复合句'] },
            { id: '5', title: '状语从句', description: '学习各种状语从句的连接词', level: 'INTERMEDIATE', points: 15, questionCount: 10, timeEstimate: 12, completed: false, tags: ['从句', '连接词'] },
            { id: '6', title: '名词性从句', description: '掌握主语从句、宾语从句等用法', level: 'ADVANCED', points: 20, questionCount: 15, timeEstimate: 18, completed: false, tags: ['从句', '高级'] },
            { id: '7', title: '虚拟语气', description: '掌握虚拟语气的各种形式和用法', level: 'ADVANCED', points: 20, questionCount: 12, timeEstimate: 15, completed: false, tags: ['语气', '高级'] },
            { id: '8', title: '倒装句', description: '学习英语倒装句的构成和用法', level: 'ADVANCED', points: 20, questionCount: 8, timeEstimate: 10, completed: false, tags: ['句型', '高级'] },
            { id: '9', title: '强调句型', description: '掌握It is/was...that强调句型', level: 'INTERMEDIATE', points: 15, questionCount: 8, timeEstimate: 10, completed: false, tags: ['句型', '强调'] },
            { id: '10', title: '主谓一致', description: '确保主语和谓语在人称和数上一致', level: 'BEGINNER', points: 10, questionCount: 6, timeEstimate: 8, completed: true, score: 90, completedAt: '2024-04-08', tags: ['基础', '一致'] },
            { id: '11', title: '比较级和最高级', description: '掌握形容词和副词的比较级用法', level: 'BEGINNER', points: 10, questionCount: 8, timeEstimate: 10, completed: false, tags: ['形容词', '基础'] },
            { id: '12', title: '被动语态', description: '学习被动语态的构成和用法', level: 'INTERMEDIATE', points: 15, questionCount: 10, timeEstimate: 12, completed: false, tags: ['语态', '动词'] },
          ];

          setExercises(mockExercises);
          setFilteredExercises(mockExercises);

          // 计算统计数据
          const completedExercises = mockExercises.filter(e => e.completed);
          const totalPoints = mockExercises.reduce((sum, e) => sum + e.points, 0);
          const averageScore = completedExercises.length > 0
            ? Math.round(completedExercises.reduce((sum, e) => sum + (e.score || 0), 0) / completedExercises.length)
            : 0;

          setStats({
            total: mockExercises.length,
            completed: completedExercises.length,
            averageScore,
            totalPoints,
          });

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取练习列表错误:', error);
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // 应用筛选和排序
  useEffect(() => {
    let result = [...exercises];

    // 按等级筛选
    if (filters.level !== 'all') {
      result = result.filter(exercise => exercise.level === filters.level);
    }

    // 按完成状态筛选
    if (filters.completed === 'completed') {
      result = result.filter(exercise => exercise.completed);
    } else if (filters.completed === 'not_completed') {
      result = result.filter(exercise => !exercise.completed);
    }

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(exercise =>
        exercise.title.toLowerCase().includes(searchLower) ||
        exercise.description.toLowerCase().includes(searchLower) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    switch (filters.sort) {
      case 'level':
        const levelOrder = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
        result.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]);
        break;
      case 'points':
        result.sort((a, b) => b.points - a.points);
        break;
      case 'time':
        result.sort((a, b) => a.timeEstimate - b.timeEstimate);
        break;
      case 'completed':
        result.sort((a, b) => {
          if (a.completed && !b.completed) return -1;
          if (!a.completed && b.completed) return 1;
          return 0;
        });
        break;
    }

    setFilteredExercises(result);
  }, [exercises, filters]);

  const levelColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
    EXPERT: 'bg-red-100 text-red-800',
  };

  const levelText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
    EXPERT: '专家',
  };

  const handleFilterChange = (key: keyof Filter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载练习列表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">语法练习</h1>
        <p className="text-gray-600 mt-2">
          选择适合你的语法练习，系统提升英语语法能力
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">练习总数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%完成率
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
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
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总积分</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600 mt-1">可兑换奖励</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 搜索框 */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="搜索练习标题、描述或标签..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 等级筛选 */}
          <div>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="all">全部等级</option>
              <option value="BEGINNER">初级</option>
              <option value="INTERMEDIATE">中级</option>
              <option value="ADVANCED">高级</option>
              <option value="EXPERT">专家</option>
            </select>
          </div>

          {/* 完成状态筛选 */}
          <div>
            <select
              value={filters.completed}
              onChange={(e) => handleFilterChange('completed', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="all">全部状态</option>
              <option value="completed">已完成</option>
              <option value="not_completed">未完成</option>
            </select>
          </div>

          {/* 排序 */}
          <div>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="level">按等级排序</option>
              <option value="points">按积分排序</option>
              <option value="time">按用时排序</option>
              <option value="completed">按完成状态</option>
            </select>
          </div>
        </div>

        {/* 标签筛选 */}
        <div className="mt-4">
          <div className="text-sm text-gray-600 mb-2">热门标签：</div>
          <div className="flex flex-wrap gap-2">
            {['时态', '从句', '基础', '高级', '动词', '非谓语', '语态', '句型'].map(tag => (
              <button
                key={tag}
                onClick={() => handleFilterChange('search', tag)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filters.search === tag
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 练习列表 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              练习列表 <span className="text-gray-500 text-sm font-normal">({filteredExercises.length}个)</span>
            </h2>
            <div className="text-sm text-gray-600">
              建议每日完成2-3个练习
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-gray-700 font-medium">练习标题</th>
                <th className="text-left py-3 px-6 text-gray-700 font-medium">等级</th>
                <th className="text-left py-3 px-6 text-gray-700 font-medium">积分</th>
                <th className="text-left py-3 px-6 text-gray-700 font-medium">题数/用时</th>
                <th className="text-left py-3 px-6 text-gray-700 font-medium">状态</th>
                <th className="text-left py-3 px-6 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map((exercise) => (
                <tr key={exercise.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{exercise.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{exercise.description}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exercise.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[exercise.level]}`}>
                      {levelText[exercise.level]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-yellow-600 mr-1">⭐</span>
                      <span className="font-bold text-gray-900">{exercise.points}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{exercise.questionCount}题</div>
                    <div className="text-sm text-gray-500">{exercise.timeEstimate}分钟</div>
                  </td>
                  <td className="py-4 px-6">
                    {exercise.completed ? (
                      <div>
                        <div className="flex items-center">
                          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-green-700 font-medium">已完成</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          得分：{exercise.score}/100
                        </div>
                        <div className="text-xs text-gray-500">
                          {exercise.completedAt ? new Date(exercise.completedAt).toLocaleDateString('zh-CN') : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="h-2 w-2 bg-gray-400 rounded-full mr-2"></span>
                        <span className="text-gray-700">未开始</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/grammar/${exercise.id}`}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                        exercise.completed
                          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90'
                      }`}
                    >
                      {exercise.completed ? '查看详情' : '开始练习'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredExercises.length === 0 && (
            <div className="text-center py-16">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">未找到匹配的练习</h3>
              <p className="text-gray-600">尝试调整筛选条件或搜索关键词</p>
              <button
                onClick={() => setFilters({
                  level: 'all',
                  completed: 'all',
                  sort: 'level',
                  search: '',
                })}
                className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📚 学习路径</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">1.</span>
              <span className="text-gray-700">从初级练习开始，打好语法基础</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">2.</span>
              <span className="text-gray-700">完成中级练习，掌握常用语法</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">3.</span>
              <span className="text-gray-700">挑战高级练习，提升语法应用能力</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 学习目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">当前完成度</span>
                <span className="font-medium">{Math.round((stats.completed / stats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">推荐今日完成</div>
              <div className="text-xl font-bold text-gray-900">2-3个练习</div>
              <div className="text-sm text-gray-600">约30-45分钟</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💡 学习技巧</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✓</span>
              <span className="text-gray-700">定期复习错题，巩固薄弱环节</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✓</span>
              <span className="text-gray-700">结合实际例句理解语法规则</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-500 mr-2">✓</span>
              <span className="text-gray-700">在写作中尝试运用所学语法</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex justify-between items-center">
        <Link
          href="/grammar"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回语法学习
        </Link>
        <div className="text-sm text-gray-600">
          共 {exercises.length} 个练习，已发现 {filteredExercises.length} 个匹配项
        </div>
      </div>
    </div>
  );
}