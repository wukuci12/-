'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PracticeResult {
  practiceId?: string;
  title: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  level?: string;
  genre?: string;
  wordCount?: number;
}

interface TestResult {
  testId: string;
  title: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  level: string;
}

type ResultType = 'practice' | 'test';

export default function ReadingCompletedPage() {
  const router = useRouter();
  const [result, setResult] = useState<PracticeResult | TestResult | null>(null);
  const [resultType, setResultType] = useState<ResultType>('practice');
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // 从本地存储加载最新结果
    const practiceResult = localStorage.getItem('latestReadingResult');
    const testResult = localStorage.getItem('latestReadingTestResult');

    if (testResult) {
      const parsedResult: TestResult = JSON.parse(testResult);
      setResult(parsedResult);
      setResultType('test');
      generateTestAnalysis(parsedResult);
    } else if (practiceResult) {
      const parsedResult: PracticeResult = JSON.parse(practiceResult);
      setResult(parsedResult);
      setResultType('practice');
      generatePracticeAnalysis(parsedResult);
    } else {
      router.push('/reading');
    }

    setIsLoading(false);
  }, [router]);

  const generatePracticeAnalysis = (result: PracticeResult) => {
    const newAnalysis: string[] = [];
    const newRecommendations: string[] = [];

    // 根据分数生成分析
    if (result.score >= 90) {
      newAnalysis.push('你的阅读理解能力非常出色，能够准确把握文章的主旨和细节。');
      newAnalysis.push('对各类题型都有很好的把握，阅读速度较快。');
      newRecommendations.push('可以尝试更高难度的阅读材料，挑战自己。');
      newRecommendations.push('建议增加阅读量，扩大词汇量和知识面。');
    } else if (result.score >= 70) {
      newAnalysis.push('你的阅读理解能力良好，基本能够理解文章内容。');
      newAnalysis.push('在细节理解上还有提升空间。');
      newRecommendations.push('建议多做阅读练习，注意文章中的关键词和转折句。');
      newRecommendations.push('注意提高对长难句的理解能力。');
    } else if (result.score >= 50) {
      newAnalysis.push('阅读理解能力一般，需要加强训练。');
      newAnalysis.push('对文章结构把握不够准确，可能需要学习一些阅读技巧。');
      newRecommendations.push('建议从简单文章开始，逐步提高难度。');
      newRecommendations.push('注意积累高频词汇，提高阅读流畅度。');
    } else {
      newAnalysis.push('阅读理解能力需要加强系统训练。');
      newAnalysis.push('可能对词汇量和语法结构还不够熟悉。');
      newRecommendations.push('建议先巩固基础词汇和语法知识。');
      newRecommendations.push('从简短文章开始，反复阅读直到完全理解。');
    }

    setAnalysis(newAnalysis);
    setRecommendations(newRecommendations);
  };

  const generateTestAnalysis = (result: TestResult) => {
    const newAnalysis: string[] = [];
    const newRecommendations: string[] = [];

    // 测试结果分析
    newAnalysis.push(`你在${result.title}中获得了${result.score}分。`);
    newAnalysis.push(`答对了${result.correctCount}题，共${result.totalQuestions}题。`);
    newAnalysis.push(`用时${Math.floor(result.timeSpent / 60)}分${result.timeSpent % 60}秒。`);

    if (result.passed) {
      newAnalysis.push('恭喜你通过了本次阅读测试!');
      newRecommendations.push('继续保持定期阅读训练，巩固现有水平。');
      newRecommendations.push('可以尝试更高难度的阅读材料。');
    } else {
      newAnalysis.push('很遗憾，本次测试未达到及格标准。');
      newRecommendations.push('建议加强日常阅读训练。');
      newRecommendations.push('从基础阅读材料开始，逐步提高难度。');
    }

    // 根据分数给出建议
    if (result.score >= 80) {
      newAnalysis.push('整体表现优秀，阅读理解能力很强。');
    } else if (result.score >= 60) {
      newAnalysis.push('整体表现良好，部分内容需要加强。');
    } else {
      newAnalysis.push('需要系统性地提高阅读能力。');
    }

    setAnalysis(newAnalysis);
    setRecommendations(newRecommendations);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    if (score >= 50) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <p className="text-gray-600 mb-8">请先完成一个阅读练习或测试。</p>
        <Link
          href="/reading"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回阅读主页
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 结果标题 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.title}
              <span className="ml-4 text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {resultType === 'test' ? '测试结果' : '练习结果'}
              </span>
            </h1>
            <p className="text-gray-600">
              完成于 {formatDate(result.completedAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/reading"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← 返回阅读主页
            </Link>
          </div>
        </div>

        {/* 主要分数展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <div className={`${getScoreBadge(result.score)} text-white p-8 rounded-2xl`}>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">总分</div>
                <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="text-xl mt-2 opacity-90">/ 100</div>
                <div className="mt-4 text-lg font-medium">
                  {resultType === 'test' && (result as TestResult).passed ? '🎉 通过' : '📊 得分'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">正确题数</div>
                <div className="text-3xl font-bold text-gray-900">
                  {result.correctCount}/{result.totalQuestions}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(result.correctCount / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {resultType === 'test' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">用时</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor((result as TestResult).timeSpent / 60)}:{String((result as TestResult).timeSpent % 60).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">分钟:秒</div>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">完成状态</div>
                <div className={`px-4 py-2 rounded-full font-medium ${
                  resultType === 'test' && (result as TestResult).passed
                    ? 'bg-green-100 text-green-800'
                    : resultType === 'test'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {resultType === 'test'
                    ? (result as TestResult).passed ? '通过' : '未通过'
                    : '练习完成'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">详细数据</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 准确率分析</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">整体准确率</span>
                    <span className="font-medium">{Math.round((result.correctCount / result.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(result.correctCount / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">得分率</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 表现评估</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">表现等级</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    result.score >= 90 ? 'bg-green-100 text-green-800' :
                    result.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    result.score >= 50 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.score >= 90 ? '优秀' :
                     result.score >= 70 ? '良好' :
                     result.score >= 50 ? '一般' : '需提高'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">完成时间</span>
                  <span className="font-medium">
                    {resultType === 'test'
                      ? `${Math.floor((result as TestResult).timeSpent / 60)}分${(result as TestResult).timeSpent % 60}秒`
                      : '未记录'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">测试类型</span>
                  <span className="font-medium">
                    {resultType === 'test' ? '综合测试' : '专项练习'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 智能分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 智能分析</h2>
            <div className="space-y-4">
              {analysis.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 学习建议</h2>
            <div className="space-y-4">
              {recommendations.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">→</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 学习计划 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 下一步学习计划</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📖</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">每日阅读</h3>
              <p className="text-gray-600 mb-4">
                每天坚持阅读1-2篇文章
              </p>
              <Link
                href="/reading/practice"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                开始练习
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">扩展阅读</h3>
              <p className="text-gray-600 mb-4">
                尝试不同类型和难度的文章
              </p>
              <Link
                href="/reading/resources"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                浏览资源
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">定期测试</h3>
              <p className="text-gray-600 mb-4">
                每周进行一次阅读水平测试
              </p>
              <Link
                href="/reading/test"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                开始测试
              </Link>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              if (resultType === 'test') {
                localStorage.removeItem('latestReadingTestResult');
              } else {
                localStorage.removeItem('latestReadingResult');
              }
              router.push('/reading');
            }}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            返回阅读主页
          </button>

          <button
            onClick={() => {
              if (resultType === 'test') {
                router.push('/reading/test');
              } else {
                router.push('/reading/practice');
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            再试一次
          </button>

          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:opacity-90 font-medium text-center"
          >
            返回仪表板
          </Link>
        </div>
      </div>

      {/* 鼓励话语 */}
      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-600 italic">
          "阅读是心灵的旅行。每一次阅读都是一次新的发现，坚持下去，你会发现更广阔的世界。"
        </p>
      </div>
    </div>
  );
}
