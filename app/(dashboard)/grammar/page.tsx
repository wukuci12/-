'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface GrammarStats {
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  correctRate: number;
  todayProgress: number;
  byLevel: {
    BEGINNER: number;
    INTERMEDIATE: number;
    ADVANCED: number;
    EXPERT: number;
  };
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  points: number;
  completed?: boolean;
  score?: number;
  completedAt?: string;
}

export default function GrammarPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GrammarStats>({
    totalExercises: 0,
    completedExercises: 0,
    averageScore: 0,
    correctRate: 0,
    todayProgress: 0,
    byLevel: {
      BEGINNER: 0,
      INTERMEDIATE: 0,
      ADVANCED: 0,
      EXPERT: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        // 获取统计数据
        // 获取最近练习
        // 获取推荐练习

        // 模拟数据
        setTimeout(() => {
          setStats({
            totalExercises: 120,
            completedExercises: 45,
            averageScore: 78,
            correctRate: 82,
            todayProgress: 40,
            byLevel: {
              BEGINNER: 15,
              INTERMEDIATE: 20,
              ADVANCED: 8,
              EXPERT: 2,
            },
          });

          setRecentExercises([
            { id: '1', title: '时态选择', description: '根据上下文选择正确的时态', level: 'INTERMEDIATE', points: 10, completed: true, score: 85, completedAt: '2024-04-08' },
            { id: '2', title: '虚拟语气', description: '掌握虚拟语气的正确用法', level: 'ADVANCED', points: 15, completed: true, score: 72, completedAt: '2024-04-07' },
            { id: '3', title: '定语从句', description: '识别和构建正确的定语从句', level: 'INTERMEDIATE', points: 10, completed: false },
            { id: '4', title: '主谓一致', description: '确保主语和谓语在数和人称上一致', level: 'BEGINNER', points: 10, completed: true, score: 90, completedAt: '2024-04-09' },
            { id: '5', title: '倒装句', description: '掌握英语倒装句的结构和用法', level: 'EXPERT', points: 20, completed: false },
          ]);

          setRecommendedExercises([
            { id: '6', title: '情态动词', description: '理解不同情态动词的含义和用法', level: 'BEGINNER', points: 10, completed: false },
            { id: '7', title: '非谓语动词', description: '正确使用不定式、动名词和分词', level: 'INTERMEDIATE', points: 15, completed: false },
            { id: '8', title: '状语从句', description: '掌握各种状语从句的连接词', level: 'INTERMEDIATE', points: 10, completed: false },
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取语法数据错误:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载语法数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">语法学习</h1>
        <p className="text-gray-600 mt-2">
          系统掌握高中英语语法知识，提升语言准确性和表达能力
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
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>完成率</span>
              <span>{Math.round((stats.completedExercises / stats.totalExercises) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
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
              <span>正确率</span>
              <span>{stats.correctRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${stats.correctRate}%` }}
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
              <span>推荐学习</span>
              <span>2-3个练习</span>
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
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{stats.byLevel.EXPERT}</div>
                  <div className="text-xs text-gray-600">专家</div>
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
                style={{ width: `${Math.min((stats.completedExercises / stats.totalExercises) * 100 * 1.5, 100)}%` }}
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
            href="/grammar/practice"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">语法练习</h3>
            <p className="text-gray-600 mb-6">
              从基础到高级的语法练习，系统掌握语法知识
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始练习
            </div>
          </Link>

          <Link
            href="/grammar/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">语法测试</h3>
            <p className="text-gray-600 mb-6">
              检验你的语法掌握程度，发现薄弱环节
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>

          <Link
            href="/grammar/review"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">错题复习</h3>
            <p className="text-gray-600 mb-6">
              查看和分析做错的题目，巩固薄弱知识点
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              复习错题
            </div>
          </Link>

          <Link
            href="/grammar/compare"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">对比学习</h3>
            <p className="text-gray-600 mb-6">
              对比易混淆的语法点，掌握核心区别
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium">
              开始对比
            </div>
          </Link>

          <Link
            href="/grammar/quiz"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">语法测验</h3>
            <p className="text-gray-600 mb-6">
              限时测验挑战，检验语法掌握程度
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg font-medium">
              开始测验
            </div>
          </Link>
        </div>
      </div>

      {/* 推荐练习 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">推荐练习</h2>
          <Link
            href="/grammar/practice"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部练习
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{exercise.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[exercise.level]}`}>
                  {levelText[exercise.level]}
                </span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">⭐</span>
                  <span className="text-sm font-medium">{exercise.points} 积分</span>
                </div>
                {exercise.completed ? (
                  <div className="text-green-600 text-sm font-medium">已完成</div>
                ) : (
                  <div className="text-gray-600 text-sm">未开始</div>
                )}
              </div>
              <Link
                href="/grammar/practice"
                className="block w-full py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                开始练习
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 最近练习记录 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近练习</h2>
          <Link
            href="/grammar/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部记录
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">练习标题</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">难度</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">分数</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">完成时间</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">状态</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentExercises.map((exercise) => (
                <tr key={exercise.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{exercise.title}</div>
                    <div className="text-sm text-gray-500">{exercise.description}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[exercise.level]}`}>
                      {levelText[exercise.level]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {exercise.completed ? (
                      <div className="flex items-center">
                        <div className="text-lg font-bold text-gray-900">{exercise.score}</div>
                        <div className="text-sm text-gray-500 ml-2">/ 100</div>
                      </div>
                    ) : (
                      <div className="text-gray-500">-</div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {exercise.completedAt ? new Date(exercise.completedAt).toLocaleDateString('zh-CN') : '-'}
                  </td>
                  <td className="py-4 px-4">
                    {exercise.completed ? (
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
                      href="/grammar/practice"
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      {exercise.completed ? '查看详情' : '开始练习'}
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
          <h3 className="text-xl font-bold text-gray-900 mb-4">语法学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">系统学习语法知识，从基础到高级循序渐进</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">结合实际例句理解语法规则</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">完成练习后认真查看答案解析</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">定期复习错题，巩固薄弱环节</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">今日目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">完成语法练习</span>
                <span className="font-medium">2-3个</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
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
                <span className="text-gray-700">学习时间</span>
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