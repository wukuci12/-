'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LearningResult {
  totalWords: number;
  learnedWords: number;
  timeSpent: number; // 分钟
  experienceGained: number;
  streakExtended: boolean;
  nextReviewTime: string;
}

export default function LearnCompletedPage() {
  const [result, setResult] = useState<LearningResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟从API获取学习结果
    setTimeout(() => {
      setResult({
        totalWords: 5,
        learnedWords: 4,
        timeSpent: 8, // 8分钟
        experienceGained: 40,
        streakExtended: true,
        nextReviewTime: '2024-04-10 14:00',
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载学习结果中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到学习结果</h2>
        <Link
          href="/vocabulary/learn"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回学习
        </Link>
      </div>
    );
  }

  const masteryRate = Math.round((result.learnedWords / result.totalWords) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 庆祝动画和标题 */}
      <div className="text-center mb-12">
        <div className="h-24 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white">🎉</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">学习完成！</h1>
        <p className="text-xl text-gray-600">
          恭喜你完成了本次词汇学习任务
        </p>
      </div>

      {/* 成绩卡片 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">学习成果</h2>

          {/* 主要数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.totalWords}</div>
              <div className="text-gray-600">学习单词</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.learnedWords}</div>
              <div className="text-gray-600">掌握单词</div>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{masteryRate}%</div>
              <div className="text-gray-600">掌握率</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.timeSpent}m</div>
              <div className="text-gray-600">用时</div>
            </div>
          </div>

          {/* 进度和成就 */}
          <div className="space-y-8">
            {/* 掌握进度 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">掌握进度</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">单词掌握率</span>
                    <span className="font-medium">{result.learnedWords}/{result.totalWords}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${masteryRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">学习效率</span>
                    <span className="font-medium">
                      {(result.totalWords / result.timeSpent).toFixed(1)} 词/分钟
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full"
                      style={{ width: `${Math.min(masteryRate * 1.5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 成就和奖励 */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">🏆 学习成就</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <span className="text-xl text-white">
                      {result.streakExtended ? '🔥' : '📅'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {result.streakExtended ? '连续学习天数已延长' : '保持每日学习'}
                    </div>
                    <div className="text-sm text-gray-600">学习习惯养成</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 复习安排 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📅 复习安排</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">下次复习时间</div>
                    <div className="text-sm text-gray-600">基于间隔重复算法</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{result.nextReviewTime}</div>
                </div>
                <div className="text-sm text-gray-600">
                  系统将根据你的掌握情况自动安排复习，巩固长期记忆
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/vocabulary/learn"
              className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
            >
              ➕ 继续学习
            </Link>
            <Link
              href="/vocabulary/review"
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
            >
              🔄 开始复习
            </Link>
            <Link
              href="/vocabulary/test"
              className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
            >
              📋 水平测试
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
                <div className="font-medium text-gray-900">及时复习</div>
                <div className="text-gray-600 text-sm">按照系统安排的时间进行复习，效果最佳</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">多样化学习</div>
                <div className="text-gray-600 text-sm">结合听、说、读、写多种方式学习</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">每日坚持</div>
                <div className="text-gray-600 text-sm">每天学习少量新词，长期坚持效果更好</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 下一步计划</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">推荐学习内容</div>
              <div className="text-lg font-medium text-gray-900">高中英语核心词汇 (中级)</div>
              <div className="text-gray-600 text-sm">包含500个高中阶段核心词汇</div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">预计学习时间</div>
              <div className="text-lg font-medium text-gray-900">2-3周</div>
              <div className="text-gray-600 text-sm">每天15分钟，循序渐进</div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <Link
          href="/vocabulary"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mb-4 sm:mb-0"
        >
          ← 返回词汇学习
        </Link>
        <div className="text-sm text-gray-600 text-center">
          坚持学习，每天进步一点点！
        </div>
      </div>
    </div>
  );
}