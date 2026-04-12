'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface WritingResult {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  content: string;
  wordCount: number;
  score: number;
  promptId: string;
  completedAt: string;
  timeSpent: number;
  feedback?: {
    overall: string;
    contentScore: number;
    structureScore: number;
    languageScore: number;
    grammarScore: number;
    suggestions: string[];
    strengths: string[];
  };
}

export default function WritingCompletedPage() {
  const router = useRouter();
  const [result, setResult] = useState<WritingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'feedback'>('overview');

  useEffect(() => {
    const practiceResult = localStorage.getItem('latestWritingResult');
    const testResult = localStorage.getItem('latestWritingTestResult');

    if (practiceResult) {
      const parsedResult: WritingResult = JSON.parse(practiceResult);
      setResult(parsedResult);
      generateFeedback(parsedResult);
    } else if (testResult) {
      const parsedTest = JSON.parse(testResult);
      const convertedResult: WritingResult = {
        id: parsedTest.testId,
        title: parsedTest.title,
        type: parsedTest.type,
        difficulty: 'INTERMEDIATE',
        content: parsedTest.content,
        wordCount: parsedTest.wordCount,
        score: parsedTest.score,
        promptId: '',
        completedAt: parsedTest.completedAt,
        timeSpent: parsedTest.timeSpent,
        feedback: parsedTest.feedback,
      };
      setResult(convertedResult);
    } else {
      router.push('/writing');
    }

    setIsLoading(false);
  }, [router]);

  const generateFeedback = (result: WritingResult) => {
    const suggestions: string[] = [];
    const strengths: string[] = [];

    // 基于分数和内容生成反馈
    if (result.score >= 85) {
      strengths.push('文章结构清晰，层次分明');
      strengths.push('语言表达流畅，用词准确');
      strengths.push('内容丰富，有具体例子支持');
      suggestions.push('可以尝试更复杂的句式结构');
      suggestions.push('注意使用更多高级词汇');
    } else if (result.score >= 70) {
      strengths.push('文章结构基本完整');
      strengths.push('内容表达清晰');
      suggestions.push('建议加强段落之间的过渡');
      suggestions.push('可以添加更多细节描写');
      suggestions.push('注意检查语法错误');
    } else {
      strengths.push('主题明确');
      suggestions.push('建议先列提纲再写作');
      suggestions.push('注意文章结构完整性');
      suggestions.push('增加具体例子和细节');
      suggestions.push('多阅读优秀范文学习表达');
    }

    // 基于词数给出建议
    if (result.wordCount < 150) {
      suggestions.push('词数偏少，建议写得更详细一些');
    } else if (result.wordCount > 500) {
      suggestions.push('内容充实，注意控制篇幅');
    }

    setResult((prev) => prev ? {
      ...prev,
      feedback: {
        overall: result.score >= 85 ? '优秀' : result.score >= 70 ? '良好' : '需提高',
        contentScore: Math.round(result.score * 0.25),
        structureScore: Math.round(result.score * 0.25),
        languageScore: Math.round(result.score * 0.30),
        grammarScore: Math.round(result.score * 0.20),
        suggestions,
        strengths,
      },
    } : null);
  };

  const typeText: Record<string, string> = {
    NARRATIVE: '记叙文',
    EXPOSITORY: '说明文',
    ARGUMENTATIVE: '议论文',
    PRACTICAL: '应用文',
  };

  const formatTime = (seconds: number) => {
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
        <p className="text-gray-600 mb-8">请先完成一篇写作。</p>
        <Link
          href="/writing/practice"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          开始写作
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">写作完成</h1>
          <div className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
            result.score >= 70
              ? 'bg-green-100 text-green-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {result.score >= 70 ? '🎉 表现不错!' : '💪 继续努力'}
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
                  <span className="text-gray-600">内容完整度</span>
                  <span className="font-bold">{result.feedback?.contentScore || 0}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${((result.feedback?.contentScore || 0) / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">文章结构</span>
                  <span className="font-bold">{result.feedback?.structureScore || 0}/25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${((result.feedback?.structureScore || 0) / 25) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">语言表达</span>
                  <span className="font-bold">{result.feedback?.languageScore || 0}/30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${((result.feedback?.languageScore || 0) / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">语法准确性</span>
                  <span className="font-bold">{result.feedback?.grammarScore || 0}/20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${((result.feedback?.grammarScore || 0) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 作文信息 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{result.title}</h3>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {typeText[result.type] || result.type}
                </span>
                <span className="text-gray-600">{result.wordCount}词</span>
                <span className="text-gray-600">用时 {formatTime(result.timeSpent)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              总览
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'content'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              作文内容
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-4 px-6 font-medium transition ${
                activeTab === 'feedback'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              详细反馈
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 优点 */}
                {result.feedback?.strengths && result.feedback.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6">
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
                  <div className="bg-yellow-50 rounded-xl p-6">
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
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {result.content}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && result.feedback && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{result.feedback.contentScore}</div>
                    <div className="text-sm text-gray-600">内容完整度</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{result.feedback.structureScore}</div>
                    <div className="text-sm text-gray-600">文章结构</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{result.feedback.languageScore}</div>
                    <div className="text-sm text-gray-600">语言表达</div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-600">{result.feedback.grammarScore}</div>
                    <div className="text-sm text-gray-600">语法准确性</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">评价总结</h3>
                  <p className="text-gray-700">
                    您的写作整体评价为<span className={`font-bold ${getScoreColor(result.score)}`}>{result.feedback.overall}</span>。
                    {result.feedback.strengths.slice(0, 2).join('，')}。
                    {result.feedback.suggestions[0] ? `建议${result.feedback.suggestions[0]}` : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('latestWritingResult');
              localStorage.removeItem('latestWritingTestResult');
              router.push('/writing');
            }}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            返回主页
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('latestWritingResult');
              localStorage.removeItem('latestWritingTestResult');
              router.push('/writing/practice');
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            继续写作
          </button>

          <Link
            href="/writing/history"
            className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-center"
          >
            查看历史
          </Link>
        </div>
      </div>

      {/* 鼓励话语 */}
      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-600 italic">
          "写作是一种表达思想的方式。坚持练习，你会发现自己的文字越来越有力量。"
        </p>
      </div>
    </div>
  );
}
