'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface WritingTestPrompt {
  id: string;
  title: string;
  description: string;
  type: 'NARRATIVE' | 'EXPOSITORY' | 'ARGUMENTATIVE' | 'PRACTICAL';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  wordRequirement: { min: number; max: number };
  timeLimit: number; // 分钟
}

interface TestResult {
  testId: string;
  title: string;
  type: string;
  score: number;
  content: string;
  wordCount: number;
  timeSpent: number;
  passed: boolean;
  completedAt: string;
  feedback: {
    overall: string;
    contentScore: number;
    structureScore: number;
    languageScore: number;
    grammarScore: number;
    suggestions: string[];
  };
}

const testPrompts: WritingTestPrompt[] = [
  {
    id: 'test-narrative',
    title: 'My Best Friend',
    description: 'Write a narrative essay (150-200 words) about your best friend. Include how you met, shared experiences, and why they are important to you.',
    type: 'NARRATIVE',
    difficulty: 'BEGINNER',
    wordRequirement: { min: 150, max: 200 },
    timeLimit: 20,
  },
  {
    id: 'test-expository',
    title: 'My Favorite Subject',
    description: 'Write an expository essay (200-300 words) explaining why a particular subject is your favorite. Use specific examples and reasons.',
    type: 'EXPOSITORY',
    difficulty: 'INTERMEDIATE',
    wordRequirement: { min: 200, max: 300 },
    timeLimit: 25,
  },
  {
    id: 'test-argumentative',
    title: 'Online Learning vs. Traditional Classroom',
    description: 'Write an argumentative essay (300-400 words) discussing whether online learning is more effective than traditional classroom learning. Present arguments for both sides and state your opinion.',
    type: 'ARGUMENTATIVE',
    difficulty: 'ADVANCED',
    wordRequirement: { min: 300, max: 400 },
    timeLimit: 30,
  },
];

export default function WritingTestPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [testStarted, setTestStarted] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<WritingTestPrompt | null>(null);
  const [content, setContent] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const prompts = testPrompts.filter((p) => p.difficulty === selectedDifficulty);

  const startTest = () => {
    const prompt = prompts[0];
    setCurrentPrompt(prompt);
    setTestStarted(true);
    setTimeLeft(prompt.timeLimit * 60);
    setStartTime(Date.now());
    setContent('');
  };

  // 计时器
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult && currentPrompt) {
      handleSubmit();
    }
  }, [testStarted, timeLeft, showResult, currentPrompt]);

  const handleSubmit = useCallback(() => {
    if (!currentPrompt) return;

    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    // 模拟评分
    const baseScore = Math.min(100, Math.max(50, Math.random() * 40 + 60));
    const contentScore = Math.round(baseScore * 0.25);
    const structureScore = Math.round(baseScore * 0.25);
    const languageScore = Math.round(baseScore * 0.30);
    const grammarScore = Math.round(baseScore * 0.20);
    const totalScore = contentScore + structureScore + languageScore + grammarScore;

    const suggestions: string[] = [];
    if (wordCount < currentPrompt.wordRequirement.min) {
      suggestions.push(`词数不足，建议至少写${currentPrompt.wordRequirement.min}词。`);
    }
    if (Math.random() > 0.5) {
      suggestions.push('注意使用多样化的句型结构。');
    }
    if (Math.random() > 0.5) {
      suggestions.push('可以添加更多具体例子来支持你的观点。');
    }
    if (Math.random() > 0.6) {
      suggestions.push('建议检查并修正一些语法错误。');
    }
    suggestions.push('注意段落之间的过渡，使文章更连贯。');

    const result: TestResult = {
      testId: `writing-test-${Date.now()}`,
      title: currentPrompt.title,
      type: currentPrompt.type,
      score: totalScore,
      content,
      wordCount,
      timeSpent,
      passed: totalScore >= 60,
      completedAt: new Date().toISOString(),
      feedback: {
        overall: totalScore >= 80 ? '优秀' : totalScore >= 60 ? '良好' : '需提高',
        contentScore,
        structureScore,
        languageScore,
        grammarScore,
        suggestions,
      },
    };

    localStorage.setItem('latestWritingTestResult', JSON.stringify(result));
    setIsSubmitting(false);
    setShowResult(true);
  }, [currentPrompt, content, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const typeText: Record<string, string> = {
    NARRATIVE: '记叙文',
    EXPOSITORY: '说明文',
    ARGUMENTATIVE: '议论文',
    PRACTICAL: '应用文',
  };

  const difficultyInfo = {
    BEGINNER: { name: '初级', time: '20分钟', desc: '150-200词' },
    INTERMEDIATE: { name: '中级', time: '25分钟', desc: '200-300词' },
    ADVANCED: { name: '高级', time: '30分钟', desc: '300-400词' },
  };

  // 结果页面
  if (showResult) {
    const resultStr = localStorage.getItem('latestWritingTestResult');
    const result: TestResult = resultStr ? JSON.parse(resultStr) : null;

    if (result) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">写作测试完成</h1>
              <div className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
                result.passed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.passed ? '🎉 恭喜通过!' : '😅 继续努力'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 text-center">
                <div className="text-sm opacity-90 mb-2">总分</div>
                <div className="text-5xl font-bold">{result.score}</div>
                <div className="text-lg mt-2 opacity-90">/ 100</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">详细评分</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">内容完整度</span>
                    <span className="font-bold text-gray-900">{result.feedback.contentScore}/25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">文章结构</span>
                    <span className="font-bold text-gray-900">{result.feedback.structureScore}/25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">语言表达</span>
                    <span className="font-bold text-gray-900">{result.feedback.languageScore}/30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">语法准确性</span>
                    <span className="font-bold text-gray-900">{result.feedback.grammarScore}/20</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-bold text-gray-900">{result.title}</div>
                  <div className="text-sm text-gray-600">
                    {typeText[result.type]} · {result.wordCount}词 · 用时{Math.floor(result.timeSpent / 60)}分{result.timeSpent % 60}秒
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                {result.content}
              </div>
            </div>

            {/* 改进建议 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">📝 改进建议</h3>
              <ul className="space-y-2">
                {result.feedback.suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="text-yellow-500 mr-2">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/writing/test"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium text-center"
              >
                再测一次
              </Link>
              <Link
                href="/writing/practice"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
              >
                自由练习
              </Link>
              <Link
                href="/writing"
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-center"
              >
                返回主页
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // 测试选择页面
  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">写作能力测试</h1>
            <p className="text-gray-600">
              选择难度等级，在限定时间内完成一篇作文，测试你的写作水平
            </p>
          </div>

          {/* 难度选择 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedDifficulty === level
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    selectedDifficulty === level ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {difficultyInfo[level].name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {difficultyInfo[level].desc}
                  </div>
                  <div className="text-sm text-gray-500">
                    限时: {difficultyInfo[level].time}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 提示 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <span className="text-red-600 mr-3 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-red-800">测试须知</h3>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• 测试开始后不能暂停，时间到自动提交</li>
                  <li>• 确保在限定时间内完成</li>
                  <li>• 达到60分即可通过测试</li>
                  <li>• 请独立完成，不要查阅资料</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
            >
              开始测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 测试进行中
  if (currentPrompt) {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const isWordCountValid = wordCount >= currentPrompt.wordRequirement.min;

    return (
      <div className="max-w-6xl mx-auto">
        {/* 顶部进度条 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/writing"
                className="text-gray-600 hover:text-gray-900"
              >
                ← 退出测试
              </Link>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-900">{currentPrompt.title}</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-600">词数</div>
                <div className={`font-bold ${isWordCountValid ? 'text-green-600' : 'text-orange-600'}`}>
                  {wordCount}/{currentPrompt.wordRequirement.min}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full font-bold ${
                timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isWordCountValid ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{
                  width: `${Math.min((wordCount / currentPrompt.wordRequirement.max) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 写作区域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* 题目 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2">{currentPrompt.title}</h3>
                <p className="text-gray-700">{currentPrompt.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  类型: {typeText[currentPrompt.type]} | 难度: {difficultyInfo[currentPrompt.difficulty].name}
                </div>
              </div>

              {/* 写作区 */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请在这里输入你的作文..."
                className="w-full h-80 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-800 leading-relaxed"
              />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !content.trim()}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    content.trim() && !isSubmitting
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? '提交中...' : '提交测试'}
                </button>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">评分标准</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">内容完整度</span>
                    <span className="font-medium">25分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-indigo-500 h-1 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">文章结构</span>
                    <span className="font-medium">25分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">语言表达</span>
                    <span className="font-medium">30分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">语法准确性</span>
                    <span className="font-medium">20分</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">注意事项</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    达到最低词数要求
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    注意文章结构
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    检查语法拼写
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    独立完成写作
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
