'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  grammarPoint: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number; // 秒
}

interface QuizConfig {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number; // 分钟
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  category: string;
  points: number;
  experience: number;
}

interface QuizProgress {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  isAnswered: boolean[];
  timeSpent: number[];
  startTime: number;
}

export default function GrammarQuizPage() {
  const router = useRouter();
  const [quizConfigs, setQuizConfigs] = useState<QuizConfig[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizState, setQuizState] = useState<'SELECTING' | 'IN_PROGRESS' | 'REVIEWING' | 'COMPLETED'>('SELECTING');
  const [timer, setTimer] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    // 模拟API获取测验配置
    setTimeout(() => {
      const mockConfigs: QuizConfig[] = [
        {
          id: '1',
          title: '时态专项测验',
          description: '测试你对各种时态的掌握程度',
          totalQuestions: 10,
          timeLimit: 15,
          difficulty: 'MIXED',
          category: 'TENSES',
          points: 20,
          experience: 30
        },
        {
          id: '2',
          title: '从句快速测验',
          description: '检验定语从句、状语从句等的理解',
          totalQuestions: 8,
          timeLimit: 12,
          difficulty: 'MEDIUM',
          category: 'CLAUSES',
          points: 15,
          experience: 25
        },
        {
          id: '3',
          title: '语态转换挑战',
          description: '主动语态和被动语态的转换练习',
          totalQuestions: 10,
          timeLimit: 10,
          difficulty: 'EASY',
          category: 'VOICE',
          points: 12,
          experience: 20
        },
        {
          id: '4',
          title: '语法综合测验',
          description: '包含各种语法点的综合测试',
          totalQuestions: 15,
          timeLimit: 20,
          difficulty: 'HARD',
          category: 'ALL',
          points: 30,
          experience: 40
        },
        {
          id: '5',
          title: '易错语法点测验',
          description: '针对常见易错语法点的专项测试',
          totalQuestions: 12,
          timeLimit: 18,
          difficulty: 'MEDIUM',
          category: 'ERRORS',
          points: 18,
          experience: 28
        },
        {
          id: '6',
          title: '语法应用测验',
          description: '在实际语境中应用语法知识',
          totalQuestions: 10,
          timeLimit: 15,
          difficulty: 'HARD',
          category: 'APPLICATION',
          points: 25,
          experience: 35
        }
      ];
      setQuizConfigs(mockConfigs);
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizState === 'IN_PROGRESS' && quizProgress && selectedConfig) {
      interval = setInterval(() => {
        setTimer(prev => {
          const elapsed = prev + 1;
          // 检查是否超时
          if (elapsed >= selectedConfig.timeLimit * 60) {
            handleTimeout();
            return elapsed;
          }
          return elapsed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizState, quizProgress, selectedConfig]);

  const startQuiz = (config: QuizConfig) => {
    setSelectedConfig(config);
    setIsLoading(true);

    // 模拟API获取题目
    setTimeout(() => {
      const mockQuestions: QuizQuestion[] = Array.from({ length: config.totalQuestions }, (_, i) => ({
        id: `${config.id}-${i + 1}`,
        question: `下列句子中，选择正确的语法形式填空：\n"I ___ (study) English for 5 years, and I still ___ (learn) new things every day."`,
        options: [
          'have studied, learn',
          'studied, learned',
          'have studied, am learning',
          'studied, am learning'
        ],
        correctAnswer: 2, // have studied, am learning
        explanation: '第一个空用现在完成时表示从过去持续到现在的动作；第二个空用现在进行时表示当前正在进行的动作。',
        grammarPoint: '现在完成时 vs 现在进行时',
        difficulty: i % 3 === 0 ? 'EASY' : i % 3 === 1 ? 'MEDIUM' : 'HARD',
        timeLimit: 60
      }));

      setQuestions(mockQuestions);
      setQuizProgress({
        currentQuestion: 0,
        selectedAnswers: new Array(config.totalQuestions).fill(null),
        isAnswered: new Array(config.totalQuestions).fill(false),
        timeSpent: new Array(config.totalQuestions).fill(0),
        startTime: Date.now()
      });
      setTimer(0);
      setQuizState('IN_PROGRESS');
      setIsLoading(false);
    }, 1000);
  };

  const selectAnswer = (answerIndex: number) => {
    if (!quizProgress) return;

    const newProgress = { ...quizProgress };
    const currentQ = newProgress.currentQuestion;

    if (!newProgress.isAnswered[currentQ]) {
      newProgress.selectedAnswers[currentQ] = answerIndex;
      newProgress.isAnswered[currentQ] = true;
      newProgress.timeSpent[currentQ] = timer - (currentQ > 0 ? newProgress.timeSpent.slice(0, currentQ).reduce((a, b) => a + b, 0) : 0);

      setQuizProgress(newProgress);
      setShowExplanation(true);

      // 自动跳转到下一题
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          goToQuestion(currentQ + 1);
        } else {
          finishQuiz();
        }
      }, 2000);
    }
  };

  const goToQuestion = (index: number) => {
    if (!quizProgress) return;

    setQuizProgress({
      ...quizProgress,
      currentQuestion: index
    });
    setShowExplanation(false);
  };

  const handleTimeout = () => {
    if (!quizProgress || !selectedConfig) return;

    // 标记所有未回答的题目
    const newProgress = { ...quizProgress };
    for (let i = 0; i < questions.length; i++) {
      if (!newProgress.isAnswered[i]) {
        newProgress.selectedAnswers[i] = null;
        newProgress.isAnswered[i] = true;
      }
    }

    setQuizProgress(newProgress);
    finishQuiz();
  };

  const finishQuiz = () => {
    setQuizState('REVIEWING');
  };

  const submitQuiz = () => {
    // 计算分数
    if (!quizProgress || !selectedConfig) return;

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (quizProgress.selectedAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = timer;

    // 保存结果到本地存储或API
    const result = {
      quizId: selectedConfig.id,
      title: selectedConfig.title,
      score,
      correctCount,
      totalQuestions: questions.length,
      timeSpent,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('latestQuizResult', JSON.stringify(result));
    setQuizState('COMPLETED');

    // 导航到结果页面
    setTimeout(() => {
      router.push('/grammar/completed');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '简单';
      case 'MEDIUM': return '中等';
      case 'HARD': return '困难';
      case 'MIXED': return '混合';
      default: return difficulty;
    }
  };

  if (isLoading && quizState === 'SELECTING') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载测验配置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">语法测验</h1>
        <p className="text-gray-600 text-lg">
          通过限时测验检验语法掌握程度，挑战自我！
        </p>
      </div>

      {quizState === 'SELECTING' && (
        <>
          {/* 测验配置选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {quizConfigs.map((config) => (
              <div
                key={config.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h3>
                      <p className="text-gray-600 text-sm">{config.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${getDifficultyColor(config.difficulty)}`}>
                      {getDifficultyLabel(config.difficulty)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{config.totalQuestions}</div>
                      <div className="text-sm text-gray-600">题目数量</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{config.timeLimit}分</div>
                      <div className="text-sm text-gray-600">时间限制</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-yellow-600 mr-1">⭐</span>
                        <span className="font-medium">{config.points}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-1">📈</span>
                        <span className="font-medium">{config.experience}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {config.category}
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(config)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    开始测验
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 测验说明 */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 测验规则说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600">⏱️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">时间限制</h4>
                    <p className="text-gray-600">
                      每个测验都有时间限制，超时后自动提交。答题时请注意时间管理。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">即时反馈</h4>
                    <p className="text-gray-600">
                      每题回答后会显示答案解析，帮助你立即理解知识点。
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">奖励机制</h4>
                    <p className="text-gray-600">
                      根据测验成绩获得积分和经验值，用于提升学习等级。
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-yellow-600">📊</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">进度跟踪</h4>
                    <p className="text-gray-600">
                      系统记录你的测验历史和成绩，分析学习进步情况。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {quizState === 'IN_PROGRESS' && selectedConfig && quizProgress && questions.length > 0 && (
        <div className="space-y-8">
          {/* 测验头部信息 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedConfig.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(selectedConfig.difficulty)}`}>
                    {getDifficultyLabel(selectedConfig.difficulty)}
                  </span>
                  <span className="text-gray-600">
                    第 {quizProgress.currentQuestion + 1} / {questions.length} 题
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{formatTime(timer)}</div>
                  <div className="text-sm text-gray-600">已用时间</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {quizProgress.isAnswered.filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-600">已回答</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {selectedConfig.timeLimit * 60 - timer}
                  </div>
                  <div className="text-sm text-gray-600">剩余秒数</div>
                </div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mt-6">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">测验进度</span>
                <span className="font-medium">
                  {Math.round(((quizProgress.currentQuestion + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((quizProgress.currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 题目卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyColor(questions[quizProgress.currentQuestion].difficulty)}`}>
                    {getDifficultyLabel(questions[quizProgress.currentQuestion].difficulty)}
                  </span>
                  <span className="text-gray-600">
                    {questions[quizProgress.currentQuestion].grammarPoint}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  题目 {quizProgress.currentQuestion + 1}
                </h3>
                <div className="text-gray-800 text-lg whitespace-pre-line">
                  {questions[quizProgress.currentQuestion].question}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">时间限制</div>
                <div className="text-2xl font-bold text-blue-600">
                  {questions[quizProgress.currentQuestion].timeLimit}秒
                </div>
              </div>
            </div>

            {/* 选项 */}
            <div className="space-y-4 mb-8">
              {questions[quizProgress.currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={quizProgress.isAnswered[quizProgress.currentQuestion]}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
                    quizProgress.isAnswered[quizProgress.currentQuestion]
                      ? idx === questions[quizProgress.currentQuestion].correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : idx === quizProgress.selectedAnswers[quizProgress.currentQuestion]
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                      quizProgress.isAnswered[quizProgress.currentQuestion]
                        ? idx === questions[quizProgress.currentQuestion].correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : idx === quizProgress.selectedAnswers[quizProgress.currentQuestion]
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="text-gray-800 text-lg">{option}</div>
                    {quizProgress.isAnswered[quizProgress.currentQuestion] && idx === questions[quizProgress.currentQuestion].correctAnswer && (
                      <div className="ml-auto text-green-600 font-bold">
                        ✓ 正确答案
                      </div>
                    )}
                    {quizProgress.isAnswered[quizProgress.currentQuestion] &&
                     idx === quizProgress.selectedAnswers[quizProgress.currentQuestion] &&
                     idx !== questions[quizProgress.currentQuestion].correctAnswer && (
                      <div className="ml-auto text-red-600 font-bold">
                        ✗ 你的选择
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 题目导航 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">题目导航</h4>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`h-12 w-12 rounded-lg flex items-center justify-center text-lg font-medium ${
                      idx === quizProgress.currentQuestion
                        ? 'bg-indigo-600 text-white'
                        : quizProgress.isAnswered[idx]
                        ? quizProgress.selectedAnswers[idx] === questions[idx].correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* 答案解析 */}
            {showExplanation && quizProgress.isAnswered[quizProgress.currentQuestion] && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h4 className="text-lg font-bold text-gray-900 mb-4">📚 答案解析</h4>
                <div className="text-gray-700 mb-4">
                  {questions[quizProgress.currentQuestion].explanation}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    本题用时: {quizProgress.timeSpent[quizProgress.currentQuestion]}秒
                  </div>
                  <div className="text-sm font-medium">
                    {quizProgress.selectedAnswers[quizProgress.currentQuestion] ===
                     questions[quizProgress.currentQuestion].correctAnswer
                      ? '✅ 回答正确'
                      : '❌ 回答错误'}
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => goToQuestion(Math.max(0, quizProgress.currentQuestion - 1))}
                disabled={quizProgress.currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                上一题
              </button>

              {quizProgress.currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => goToQuestion(quizProgress.currentQuestion + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  下一题 →
                </button>
              ) : (
                <button
                  onClick={finishQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  完成测验
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizState === 'REVIEWING' && selectedConfig && quizProgress && (
        <div className="space-y-8">
          {/* 复习标题 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">测验完成！</h2>
            <p className="text-gray-600 text-lg">
              请检查你的答案，确认无误后提交测验
            </p>
          </div>

          {/* 统计摘要 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 测验摘要</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">
                  {quizProgress.isAnswered.filter(Boolean).length}/{questions.length}
                </div>
                <div className="text-gray-600">已回答题目</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">
                  {quizProgress.selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length}
                </div>
                <div className="text-gray-600">正确答案</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">
                  {formatTime(timer)}
                </div>
                <div className="text-gray-600">总用时</div>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round(
                    (quizProgress.selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length /
                     questions.length) * 100
                  )}%
                </div>
                <div className="text-gray-600">预估分数</div>
              </div>
            </div>

            {/* 题目回顾列表 */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">📝 题目回顾</h4>
              {questions.map((question, idx) => {
                const isCorrect = quizProgress.selectedAnswers[idx] === question.correctAnswer;
                return (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold text-gray-900">题目 {idx + 1}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyLabel(question.difficulty)}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? '正确' : '错误'}
                          </span>
                        </div>
                        <p className="text-gray-800">{question.question}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">用时</div>
                        <div className="font-medium">{quizProgress.timeSpent[idx]}秒</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">你的选择</h5>
                        <div className={`p-4 rounded-lg ${
                          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          {quizProgress.selectedAnswers[idx] !== null ? (
                            <div>
                              <div className="font-medium mb-1">
                                {String.fromCharCode(65 + quizProgress.selectedAnswers[idx]!)}
                              </div>
                              <div className="text-gray-700">
                                {question.options[quizProgress.selectedAnswers[idx]!]}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-600">未回答</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">正确答案</h5>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-medium mb-1">
                            {String.fromCharCode(65 + question.correctAnswer)}
                          </div>
                          <div className="text-gray-700">
                            {question.options[question.correctAnswer]}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h6 className="font-medium text-gray-900 mb-2">答案解析</h6>
                      <p className="text-gray-700">{question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => {
                  setQuizState('IN_PROGRESS');
                  setShowExplanation(false);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                ← 返回修改
              </button>
              <button
                onClick={submitQuiz}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                提交测验 →
              </button>
            </div>
          </div>
        </div>
      )}

      {quizState === 'COMPLETED' && (
        <div className="text-center py-16">
          <div className="h-24 w-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-white">🏆</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">测验已提交！</h2>
          <p className="text-gray-600 text-lg mb-8">
            正在生成测验结果，请稍候...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      )}

      {/* 返回导航 */}
      {quizState === 'SELECTING' && (
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/grammar"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← 返回语法学习
          </Link>
          <div className="text-sm text-gray-600">
            选择适合的测验，挑战你的语法能力！
          </div>
        </div>
      )}
    </div>
  );
}