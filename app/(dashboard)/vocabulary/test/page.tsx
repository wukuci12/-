'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-blank' | 'match' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  accuracy: number;
  difficultyBreakdown: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
}

export default function VocabularyTestPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | number | boolean | null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | number | boolean | null>(null);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10分钟，单位秒
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟测试题目
  const testQuestions: TestQuestion[] = [
    {
      id: 1,
      type: 'multiple-choice',
      question: '单词 "accommodate" 的中文意思是什么？',
      options: ['适应，容纳', '加速，促进', '指责，批评', '接受，承认'],
      correctAnswer: '适应，容纳',
      explanation: 'accommodate 意为"容纳，提供住宿；使适应"，常见于酒店接待、适应环境等场景。',
      difficulty: 'MEDIUM',
      points: 10,
    },
    {
      id: 2,
      type: 'fill-blank',
      question: '根据发音 /ˈkɒnsɪkwəns/ 拼写单词：______',
      correctAnswer: 'consequence',
      explanation: 'consequence 发音为 /ˈkɒnsɪkwəns/，意为"结果，后果"。',
      difficulty: 'EASY',
      points: 5,
    },
    {
      id: 3,
      type: 'true-false',
      question: '单词 "beneficial" 的意思是"有害的"。',
      correctAnswer: false,
      explanation: 'beneficial 意为"有益的，有利的"，反义词是"harmful"。',
      difficulty: 'EASY',
      points: 5,
    },
    {
      id: 4,
      type: 'match',
      question: '请将下列单词与正确释义匹配：',
      options: ['dilemma', 'elaborate', 'accommodate'],
      correctAnswer: 0, // 匹配题的正确顺序索引
      explanation: 'dilemma: 困境；elaborate: 详细的；accommodate: 容纳',
      difficulty: 'HARD',
      points: 15,
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: '"They made ______ preparations for the ceremony." 应填入哪个单词？',
      options: ['elaborate', 'beneficial', 'consequence', 'dilemma'],
      correctAnswer: 'elaborate',
      explanation: 'elaborate 意为"详细的，精心制作的"，符合句子语境。',
      difficulty: 'MEDIUM',
      points: 10,
    },
  ];

  const currentQuestion = testQuestions[currentQuestionIndex];
  const totalQuestions = testQuestions.length;

  // 计时器
  useEffect(() => {
    if (!isTestStarted || isTestCompleted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTestCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, timeLeft]);

  const startTest = () => {
    setIsTestStarted(true);
    setUserAnswers(new Array(totalQuestions).fill(null));
  };

  const handleAnswerSelect = (answer: string | number | boolean) => {
    setSelectedOption(answer);
  };

  const handleNextQuestion = () => {
    // 保存当前答案
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setUserAnswers(newAnswers);

    // 清空选择
    setSelectedOption(null);

    // 移动到下一题或完成测试
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleTestCompletion();
    }
  };

  const handleTestCompletion = () => {
    setIsTestCompleted(true);
    setIsTestStarted(false);

    // 计算分数
    const finalAnswers = [...userAnswers];
    if (selectedOption !== null && userAnswers[currentQuestionIndex] === null) {
      finalAnswers[currentQuestionIndex] = selectedOption;
    }

    let correctAnswers = 0;
    const difficultyBreakdown = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    };

    testQuestions.forEach((question, index) => {
      const userAnswer = finalAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      // 统计难度分布
      switch (question.difficulty) {
        case 'EASY':
          difficultyBreakdown.easy.total++;
          if (isCorrect) difficultyBreakdown.easy.correct++;
          break;
        case 'MEDIUM':
          difficultyBreakdown.medium.total++;
          if (isCorrect) difficultyBreakdown.medium.correct++;
          break;
        case 'HARD':
          difficultyBreakdown.hard.total++;
          if (isCorrect) difficultyBreakdown.hard.correct++;
          break;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = 600 - timeLeft;

    setTestResult({
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      accuracy: score,
      difficultyBreakdown,
    });

    setIsLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '简单';
      case 'MEDIUM': return '中等';
      case 'HARD': return '困难';
      default: return difficulty;
    }
  };

  if (!isTestStarted && !isTestCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">词汇水平测试</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            测试你的词汇掌握程度，发现薄弱环节，获得个性化学习建议
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">测试说明</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">测试内容</h3>
                  <p className="text-gray-600">
                    {totalQuestions}道题目，包含选择题、填空题、判断题和匹配题
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">⏱️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">时间限制</h3>
                  <p className="text-gray-600">
                    10分钟完成测试，合理安排时间
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">难度分级</h3>
                  <p className="text-gray-600">
                    题目难度分为简单、中等、困难三个级别
                  </p>
                </div>
              </div>
            </div>

            {/* 难度分布 */}
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4">题目难度分布</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {testQuestions.filter(q => q.difficulty === 'EASY').length}
                  </div>
                  <div className="text-gray-600">简单</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {testQuestions.filter(q => q.difficulty === 'MEDIUM').length}
                  </div>
                  <div className="text-gray-600">中等</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {testQuestions.filter(q => q.difficulty === 'HARD').length}
                  </div>
                  <div className="text-gray-600">困难</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <button
              onClick={startTest}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium text-lg"
            >
              开始测试
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/vocabulary"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            ← 返回词汇学习
          </Link>
        </div>
      </div>
    );
  }

  if (isTestStarted && !isTestCompleted) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* 测试头部 */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">词汇水平测试</h1>
              <p className="text-gray-600 mt-1">评估你的词汇掌握程度</p>
            </div>

            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <div className="text-sm text-gray-600">剩余时间</div>
                <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow">
                <div className="text-sm text-gray-600">题目进度</div>
                <div className="text-xl font-bold text-gray-900">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </div>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 测试题目卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            {/* 题目难度和类型 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {getDifficultyText(currentQuestion.difficulty)}
                </span>
                <span className="text-sm text-gray-600">
                  {currentQuestion.type === 'multiple-choice' && '选择题'}
                  {currentQuestion.type === 'fill-blank' && '填空题'}
                  {currentQuestion.type === 'true-false' && '判断题'}
                  {currentQuestion.type === 'match' && '匹配题'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {currentQuestion.points} 分
              </div>
            </div>

            {/* 题目内容 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentQuestion.question}
              </h2>

              {/* 根据题目类型渲染不同的输入方式 */}
              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition ${selectedOption === option
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 ${selectedOption === option
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                          }`}>
                          {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'fill-blank' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={selectedOption as string || ''}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="输入单词..."
                  />
                  <div className="text-sm text-gray-600">
                    提示：注意大小写和拼写
                  </div>
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswerSelect(true)}
                    className={`p-6 rounded-xl border-2 text-center transition ${selectedOption === true
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-2">✓</div>
                    <div className="font-medium">正确</div>
                  </button>
                  <button
                    onClick={() => handleAnswerSelect(false)}
                    className={`p-6 rounded-xl border-2 text-center transition ${selectedOption === false
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="text-2xl mb-2">✗</div>
                    <div className="font-medium">错误</div>
                  </button>
                </div>
              )}

              {currentQuestion.type === 'match' && (
                <div className="space-y-4">
                  <div className="text-gray-600 mb-4">
                    请将左侧单词拖到右侧正确释义上
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="font-medium text-gray-900 mb-2">单词</div>
                      {currentQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="font-medium text-gray-900 mb-2">释义</div>
                      {['困境，进退两难', '详细的，精心制作的', '容纳，提供住宿'].map((meaning, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[3rem]"
                          onDragOver={(e) => e.preventDefault()}
                        >
                          {/* 匹配目标区域 */}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    注：此版本为演示，实际功能需要实现拖放
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1);
                    setSelectedOption(userAnswers[currentQuestionIndex - 1]);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一题
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex < totalQuestions - 1 ? '下一题' : '完成测试'}
              </button>
            </div>
          </div>
        </div>

        {/* 测试提示 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">测试提示</h3>
              <p className="text-gray-600 text-sm">
                仔细阅读题目，合理分配时间。不确定的题目可以先跳过，稍后返回检查。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTestCompleted && testResult) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* 结果标题 */}
        <div className="text-center mb-12">
          <div className="h-24 w-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-white">📊</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">测试完成！</h1>
          <p className="text-xl text-gray-600">
            你的词汇水平测试结果如下
          </p>
        </div>

        {/* 总成绩卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="text-center mb-10">
              <div className="inline-block">
                <div className="text-6xl font-bold text-gray-900 mb-2">{testResult.score}</div>
                <div className="text-gray-600">总分 / 100</div>
              </div>
            </div>

            {/* 详细统计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">{testResult.correctAnswers}</div>
                <div className="text-gray-600">正确数</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">{testResult.totalQuestions}</div>
                <div className="text-gray-600">总题数</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">
                  {Math.floor(testResult.timeSpent / 60)}:{String(testResult.timeSpent % 60).padStart(2, '0')}
                </div>
                <div className="text-gray-600">用时</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900">{testResult.accuracy}%</div>
                <div className="text-gray-600">准确率</div>
              </div>
            </div>

            {/* 难度分布分析 */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-900 mb-6">难度表现分析</h3>
              <div className="space-y-6">
                {['easy', 'medium', 'hard'].map((level) => {
                  const data = testResult.difficultyBreakdown[level as keyof typeof testResult.difficultyBreakdown];
                  const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                  const colorClass = level === 'easy' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-500' : 'bg-red-500';
                  const textClass = level === 'easy' ? 'text-green-700' : level === 'medium' ? 'text-yellow-700' : 'text-red-700';

                  return (
                    <div key={level}>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${textClass} ${colorClass.replace('500', '100')}`}>
                            {level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难'}
                          </span>
                          <span className="ml-3 text-gray-700">
                            {data.correct}/{data.total} 正确
                          </span>
                        </div>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${colorClass}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 学习建议 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📚 学习建议</h3>
              <div className="space-y-4">
                {testResult.score >= 80 ? (
                  <>
                    <p className="text-gray-700">
                      <span className="font-medium text-green-600">优秀！</span> 你的词汇掌握程度很好，继续保持每天学习新词和定期复习的习惯。
                    </p>
                    <p className="text-gray-700">
                      建议挑战更高难度的词汇，或者开始学习同义词、反义词和词汇搭配。
                    </p>
                  </>
                ) : testResult.score >= 60 ? (
                  <>
                    <p className="text-gray-700">
                      <span className="font-medium text-yellow-600">良好！</span> 你的词汇基础不错，但还有提升空间。
                    </p>
                    <p className="text-gray-700">
                      建议加强中等难度词汇的学习，重点关注错误题目的单词。
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700">
                      <span className="font-medium text-red-600">需要加强！</span> 你的词汇基础需要巩固。
                    </p>
                    <p className="text-gray-700">
                      建议从简单词汇开始系统学习，每天坚持学习新词并复习旧词。
                    </p>
                  </>
                )}
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
                学习新词
              </Link>
              <Link
                href="/vocabulary/review"
                className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
              >
                复习词汇
              </Link>
              <button
                onClick={() => {
                  setIsTestStarted(false);
                  setIsTestCompleted(false);
                  setCurrentQuestionIndex(0);
                  setUserAnswers([]);
                  setSelectedOption(null);
                  setTimeLeft(600);
                  setTestResult(null);
                }}
                className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:opacity-90 font-medium"
              >
                重新测试
              </button>
            </div>
          </div>
        </div>

        {/* 返回导航 */}
        <div className="text-center">
          <Link
            href="/vocabulary"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← 返回词汇学习
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    </div>
  );
}