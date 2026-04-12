'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReviewResult {
  totalWords: number;
  correctAnswers: number;
  accuracy: number;
  timeSpent: number; // 秒
  experienceGained: number;
  streakMaintained: boolean;
}

export default function ReviewCompletedPage() {
  const router = useRouter();
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟从API获取复习结果
    setTimeout(() => {
      setResult({
        totalWords: 5,
        correctAnswers: 4,
        accuracy: 80,
        timeSpent: 180, // 3分钟
        experienceGained: 50,
        streakMaintained: true,
      });
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载复习结果中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到复习结果</h2>
        <Link
          href="/vocabulary/review"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回复习
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 成功动画和标题 */}
      <div className="text-center mb-12">
        <div className="h-24 w-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-white">🏆</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">复习完成！</h1>
        <p className="text-xl text-gray-600">
          你成功完成了本次词汇复习，巩固了记忆
        </p>
      </div>

      {/* 成绩卡片 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">复习成绩</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.totalWords}</div>
              <div className="text-gray-600">复习单词</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.accuracy}%</div>
              <div className="text-gray-600">准确率</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}</div>
              <div className="text-gray-600">用时</div>
            </div>
          </div>

          {/* 详细统计 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">表现分析</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">正确率</span>
                    <span className="font-medium">{result.correctAnswers}/{result.totalWords}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                      style={{ width: `${result.accuracy}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">学习效率</span>
                    <span className="font-medium">
                      {(result.totalWords / (result.timeSpent / 60)).toFixed(1)} 词/分钟
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full"
                      style={{ width: `${Math.min(result.accuracy, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 奖励和成就 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎉 学习收获</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">+{result.experienceGained} 经验值</div>
                    <div className="text-sm text-gray-600">学习等级提升</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {result.streakMaintained ? '连续学习已保持' : '连续学习中断'}
                    </div>
                    <div className="text-sm text-gray-600">每日学习习惯</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/vocabulary/review"
              className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-lg text-center"
            >
              🔄 继续复习
            </Link>
            <Link
              href="/vocabulary/learn"
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg text-center"
            >
              ➕ 学习新词
            </Link>
          </div>
        </div>
      </div>

      {/* 复习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-8 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 学习建议</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">定期复习</div>
                <div className="text-gray-600 text-sm">按照系统安排的复习时间进行复习</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">多样化练习</div>
                <div className="text-gray-600 text-sm">尝试不同复习模式加强记忆</div>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3">✓</span>
              <div>
                <div className="font-medium text-gray-900">错题重点练习</div>
                <div className="text-gray-600 text-sm">针对错误答案的单词加强练习</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">⏰ 下次复习时间</h3>
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">基于间隔重复算法</div>
              <div className="text-2xl font-bold text-gray-900">24小时后</div>
              <div className="text-gray-600 text-sm">系统将安排新的复习任务</div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">预计复习单词</div>
              <div className="text-2xl font-bold text-gray-900">8-10个</div>
              <div className="text-gray-600 text-sm">包括今天学习的单词</div>
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
          每天坚持复习，长期记忆效果提升60%
        </div>
      </div>
    </div>
  );
}