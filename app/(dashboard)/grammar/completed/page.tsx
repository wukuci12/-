'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GrammarResult {
  exerciseId: string;
  exerciseTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number; // 秒
  experienceGained: number;
  pointsEarned: number;
  accuracy: number;
  rank?: string;
  completedAt: string;
}

export default function GrammarCompletedPage() {
  const [result, setResult] = useState<GrammarResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟从API获取结果
    setTimeout(() => {
      setResult({
        exerciseId: '1',
        exerciseTitle: '时态选择练习',
        totalQuestions: 5,
        correctAnswers: 4,
        score: 85,
        timeSpent: 420, // 7分钟
        experienceGained: 50,
        pointsEarned: 8,
        accuracy: 80,
        rank: '优秀',
        completedAt: new Date().toISOString(),
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载练习结果中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到练习结果</h2>
        <Link
          href="/grammar"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回语法学习
        </Link>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankColor = (rank?: string) => {
    switch (rank) {
      case '优秀': return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case '良好': return 'bg-gradient-to-r from-green-400 to-emerald-400';
      case '中等': return 'bg-gradient-to-r from-blue-400 to-indigo-400';
      case '及格': return 'bg-gradient-to-r from-purple-400 to-pink-400';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 庆祝动画和标题 */}
      <div className="text-center mb-12">
        <div className="h-24 w-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white">🏆</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">练习完成！</h1>
        <p className="text-xl text-gray-600">
          你成功完成了《{result.exerciseTitle}》
        </p>
      </div>

      {/* 成绩卡片 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">练习成绩</h2>

          {/* 主要数据 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>{result.score}</div>
              <div className="text-gray-600">得分</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.correctAnswers}/{result.totalQuestions}</div>
              <div className="text-gray-600">正确题数</div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.accuracy}%</div>
              <div className="text-gray-600">正确率</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{formatTime(result.timeSpent)}</div>
              <div className="text-gray-600">用时</div>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">+{result.pointsEarned}</div>
              <div className="text-gray-600">获得积分</div>
            </div>
          </div>

          {/* 详细统计 */}
          <div className="space-y-8">
            {/* 得分分析 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">得分分析</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">得分分布</span>
                    <span className="font-medium">{result.score}/100 分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>0分</span>
                    <span>60分</span>
                    <span>80分</span>
                    <span>100分</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">正确率</span>
                    <span className="font-medium">{result.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${result.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 等级和奖励 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">🏅 学习收获</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">⭐</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">+{result.experienceGained} 经验值</div>
                    <div className="text-sm text-gray-600">学习等级提升</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">🏆</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{result.rank || '未评级'}</div>
                    <div className="text-sm text-gray-600">本次练习评级</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">💰</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">+{result.pointsEarned} 积分</div>
                    <div className="text-sm text-gray-600">可兑换奖励</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 评级标准 */}
            {result.rank && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 评级标准</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${getRankColor('优秀')}`}>
                        <span className="text-white text-sm">优</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">优秀</div>
                        <div className="text-sm text-gray-600">90-100分</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${result.score >= 90 ? 'text-green-600' : 'text-gray-400'}`}>
                      {result.score >= 90 ? '✓' : '○'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">良</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">良好</div>
                        <div className="text-sm text-gray-600">80-89分</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${result.score >= 80 && result.score < 90 ? 'text-green-600' : 'text-gray-400'}`}>
                      {result.score >= 80 && result.score < 90 ? '✓' : '○'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">中</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">中等</div>
                        <div className="text-sm text-gray-600">70-79分</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${result.score >= 70 && result.score < 80 ? 'text-green-600' : 'text-gray-400'}`}>
                      {result.score >= 70 && result.score < 80 ? '✓' : '○'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">及</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">及格</div>
                        <div className="text-sm text-gray-600">60-69分</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${result.score >= 60 && result.score < 70 ? 'text-green-600' : 'text-gray-400'}`}>
                      {result.score >= 60 && result.score < 70 ? '✓' : '○'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/grammar"
              className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-lg text-center"
            >
              📚 继续学习
            </Link>
            <Link
              href="/grammar/test"
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg text-center"
            >
              📋 语法测试
            </Link>
            <Link
              href="/"
              className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:opacity-90 font-medium text-lg text-center"
            >
              🏠 返回主页
            </Link>
          </div>
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-8 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">💡 学习建议</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">错题分析</div>
                <div className="text-gray-600 text-sm">仔细查看错误题目的解析，理解错误原因</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">针对性练习</div>
                <div className="text-gray-600 text-sm">针对薄弱知识点进行专项练习</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">定时复习</div>
                <div className="text-gray-600 text-sm">每周复习一次已学内容，巩固记忆</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">实际应用</div>
                <div className="text-gray-600 text-sm">在写作和口语中尝试运用所学语法知识</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 学习规划</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">推荐学习方向</div>
              <div className="text-lg font-medium text-gray-900">
                {result.score >= 80 ? '高级语法应用' :
                 result.score >= 60 ? '中级语法巩固' : '基础语法强化'}
              </div>
              <div className="text-gray-600 text-sm">
                {result.score >= 80 ? '进一步提升语法应用能力' :
                 result.score >= 60 ? '巩固中等难度的语法知识点' : '加强基础语法知识的掌握'}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">预计学习时间</div>
              <div className="text-lg font-medium text-gray-900">
                {result.score >= 80 ? '1-2周' :
                 result.score >= 60 ? '2-3周' : '3-4周'}
              </div>
              <div className="text-gray-600 text-sm">
                {result.score >= 80 ? '每天15-20分钟，快速提升' :
                 result.score >= 60 ? '每天20-30分钟，稳步提高' : '每天30-40分钟，打好基础'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <Link
          href="/grammar"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mb-4 sm:mb-0"
        >
          ← 返回语法学习
        </Link>
        <div className="text-sm text-gray-600 text-center">
          坚持练习，语法能力每天进步一点点！
        </div>
      </div>
    </div>
  );
}