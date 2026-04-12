'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SpeakingResult {
  id: string;
  topic: string;
  type: string;
  score: number;
  duration: number;
  completedAt: string;
  feedback?: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
    suggestions: string[];
    strengths: string[];
  };
}

export default function SpeakingCompletedPage() {
  const router = useRouter();
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const practiceResult = localStorage.getItem('latestSpeakingResult');
    const testResult = localStorage.getItem('latestSpeakingTestResult');

    if (practiceResult) {
      const parsedResult: SpeakingResult = JSON.parse(practiceResult);
      setResult(parsedResult);
    } else if (testResult) {
      const parsedTest = JSON.parse(testResult);
      const convertedResult: SpeakingResult = {
        id: parsedTest.testId,
        topic: parsedTest.title,
        type: 'TEST',
        score: parsedTest.score,
        duration: parsedTest.timeSpent,
        completedAt: parsedTest.completedAt,
        feedback: parsedTest.feedback,
      };
      setResult(convertedResult);
    } else {
      router.push('/speaking');
    }

    setIsLoading(false);
  }, [router]);

  const typeText: Record<string, string> = {
    DIALOGUE: '对话练习',
    MONOLOGUE: '独白练习',
    DISCUSSION: '话题讨论',
    TEST: '口语测试',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载结果中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到结果</h2>
        <p className="text-gray-600 mb-8">请先完成一次口语练习。</p>
        <Link
          href="/speaking/practice"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          开始练习
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">练习完成</h1>
          <div className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
            result.score >= 70
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {result.score >= 85 ? '🎉 太棒了!' : result.score >= 70 ? '👍 表现不错!' : '💪 继续努力'}
          </div>
        </div>

        {/* 分数卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 text-center">
            <div className="text-sm opacity-90 mb-2">总分</div>
            <div className={`text-5xl font-bold ${result.score >= 85 ? 'text-green-300' : result.score >= 70 ? 'text-yellow-300' : 'text-orange-300'}`}>
              {result.score}
            </div>
            <div className="text-lg mt-2 opacity-90">/ 100</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-600 mb-2">详细评分</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">发音准确度</span>
                  <span className="font-bold">{result.feedback?.pronunciation || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${result.feedback?.pronunciation || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">流利度</span>
                  <span className="font-bold">{result.feedback?.fluency || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${result.feedback?.fluency || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">词汇运用</span>
                  <span className="font-bold">{result.feedback?.vocabulary || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${result.feedback?.vocabulary || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">语法准确性</span>
                  <span className="font-bold">{result.feedback?.grammar || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${result.feedback?.grammar || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 练习信息 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{result.topic}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {typeText[result.type] || result.type}
                </span>
                <span className="text-gray-600">用时 {formatDuration(result.duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 优点 */}
        {result.feedback?.strengths && result.feedback.strengths.length > 0 && (
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-green-800 mb-4">✨ 优点</h3>
            <ul className="space-y-2">
              {result.feedback.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start text-green-700">
                  <span className="text-green-500 mr-2">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 建议 */}
        {result.feedback?.suggestions && result.feedback.suggestions.length > 0 && (
          <div className="bg-yellow-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-yellow-800 mb-4">💡 改进建议</h3>
            <ul className="space-y-2">
              {result.feedback.suggestions.map((s, idx) => (
                <li key={idx} className="flex items-start text-yellow-700">
                  <span className="text-yellow-500 mr-2">→</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('latestSpeakingResult');
              localStorage.removeItem('latestSpeakingTestResult');
              router.push('/speaking');
            }}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            返回主页
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('latestSpeakingResult');
              localStorage.removeItem('latestSpeakingTestResult');
              router.push('/speaking/practice');
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            继续练习
          </button>

          <Link
            href="/speaking/history"
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-center"
          >
            查看历史
          </Link>
        </div>
      </div>

      {/* 鼓励话语 */}
      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-600 italic">
          "口语能力的提高需要多说多练。每天坚持，你的英语会越来越流利!"
        </p>
      </div>
    </div>
  );
}
