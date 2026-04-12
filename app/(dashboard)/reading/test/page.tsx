'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReadingTestQuestion {
  id: string;
  articleId: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface ReadingTestArticle {
  id: string;
  title: string;
  content: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: string;
  wordCount: number;
  estimatedTime: number;
  questions: ReadingTestQuestion[];
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

export default function ReadingTestPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('INTERMEDIATE');
  const [testStarted, setTestStarted] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ReadingTestArticle | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStartTime, setTestStartTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 模拟测试文章数据
  const testArticles: Record<string, ReadingTestArticle> = {
    BEGINNER: {
      id: 'test-beginner',
      title: 'A Day at School',
      content: `Today was an exciting day at school. I woke up early and got ready for my classes. At school, I learned about animals in science class. We talked about different kinds of pets like dogs, cats, and fish.

After lunch, I had a math class where we practiced adding numbers. It was fun! Then in art class, I painted a beautiful picture of a sunset. The colors were orange, yellow, and red.

After school, I played soccer with my friends. We had a great game. I scored two goals! My team won 3-2. I was very happy. On the way home, I bought an ice cream cone. It was chocolate flavor.

This was a wonderful day. I cannot wait to go to school again tomorrow.`,
      level: 'BEGINNER',
      genre: 'STORY',
      wordCount: 150,
      estimatedTime: 5,
      questions: [
        {
          id: 'q1',
          articleId: 'test-beginner',
          type: 'multiple-choice',
          question: 'What did the student learn about in science class?',
          options: ['Plants', 'Animals', 'Weather', 'Space'],
          correctAnswer: 'Animals',
          points: 10,
        },
        {
          id: 'q2',
          articleId: 'test-beginner',
          type: 'true-false',
          question: 'The student scored two goals in soccer.',
          correctAnswer: 'True',
          points: 10,
        },
        {
          id: 'q3',
          articleId: 'test-beginner',
          type: 'multiple-choice',
          question: 'What flavor was the ice cream?',
          options: ['Vanilla', 'Strawberry', 'Chocolate', 'Mint'],
          correctAnswer: 'Chocolate',
          points: 10,
        },
        {
          id: 'q4',
          articleId: 'test-beginner',
          type: 'fill-blank',
          question: 'The art class painted a picture of a ________.',
          correctAnswer: 'sunset',
          points: 10,
        },
      ],
    },
    INTERMEDIATE: {
      id: 'test-intermediate',
      title: 'The Importance of Reading',
      content: `Reading is one of the most important skills a person can develop. It opens doors to new ideas, cultures, and perspectives that we might never encounter in our daily lives. Whether we are reading a novel, a newspaper article, or scientific research, the act of reading helps us expand our knowledge and understanding of the world.

Studies have shown that regular reading can improve memory, concentration, and critical thinking skills. When we read, our brains create new neural pathways, which help keep our minds sharp and active. This is particularly important as we age, as reading has been linked to a reduced risk of cognitive decline.

Moreover, reading can be a source of great pleasure and relaxation. Getting lost in a good book can transport us to different worlds and allow us to experience lives very different from our own. This ability to empathize with fictional characters can also help us develop better relationships with the people around us.

In today's digital age, where we are constantly bombarded with short messages and quick updates, taking the time to read a book or a long-form article can be a refreshing change. It requires patience and focus, skills that are becoming increasingly rare in our fast-paced world.

To cultivate a reading habit, experts recommend setting aside a specific time each day for reading, even if it is just 15-20 minutes. Starting with books or articles on topics that genuinely interest you can make the experience more enjoyable and sustainable.`,
      level: 'INTERMEDIATE',
      genre: 'ESSAY',
      wordCount: 280,
      estimatedTime: 8,
      questions: [
        {
          id: 'q1',
          articleId: 'test-intermediate',
          type: 'multiple-choice',
          question: 'According to the passage, what can regular reading improve?',
          options: ['Only memory', 'Memory, concentration, and critical thinking', 'Only concentration', 'Physical fitness'],
          correctAnswer: 'Memory, concentration, and critical thinking',
          points: 10,
        },
        {
          id: 'q2',
          articleId: 'test-intermediate',
          type: 'true-false',
          question: 'Reading has been linked to a reduced risk of cognitive decline.',
          correctAnswer: 'True',
          points: 10,
        },
        {
          id: 'q3',
          articleId: 'test-intermediate',
          type: 'multiple-choice',
          question: 'What does the passage suggest about digital communication?',
          options: ['It is more important than reading', 'It lacks depth compared to long-form reading', 'It should replace books', 'It is harmful to health'],
          correctAnswer: 'It lacks depth compared to long-form reading',
          points: 10,
        },
        {
          id: 'q4',
          articleId: 'test-intermediate',
          type: 'fill-blank',
          question: 'Experts recommend setting aside at least ________ minutes each day for reading.',
          correctAnswer: '15-20',
          points: 10,
        },
        {
          id: 'q5',
          articleId: 'test-intermediate',
          type: 'multiple-choice',
          question: 'What does the phrase "opens doors" mean in the context of the passage?',
          options: ['Physical doors', 'New opportunities and possibilities', 'Buildings', 'Digital access'],
          correctAnswer: 'New opportunities and possibilities',
          points: 10,
        },
      ],
    },
    ADVANCED: {
      id: 'test-advanced',
      title: 'Climate Change and Global Response',
      content: `The phenomenon of anthropogenic climate change represents one of the most pressing challenges facing humanity in the 21st century. Driven primarily by the accumulation of greenhouse gases in the atmosphere, predominantly carbon dioxide and methane, global temperatures have risen by approximately 1.1°C since pre-industrial times. This seemingly modest increase has already begun to manifest in observable consequences, including rising sea levels, more frequent extreme weather events, and disruptions to ecosystems worldwide.

The scientific consensus on climate change, as articulated by the Intergovernmental Panel on Climate Change (IPCC), is that human activities are the dominant cause of observed warming since the mid-20th century. This conclusion is supported by multiple lines of evidence, including temperature records, ice core samples, and satellite observations. Despite this overwhelming evidence, public perception and political will to address climate change vary significantly across different regions and socioeconomic contexts.

The Paris Agreement, adopted in 2015, marked a watershed moment in international climate diplomacy. By bringing together nearly all nations in a common cause, the agreement established the goal of limiting global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels. To achieve this ambitious target, countries committed to submitting increasingly ambitious nationally determined contributions (NDCs) and to pursuing domestic policies to reduce greenhouse gas emissions.

However, the implementation of these commitments has been uneven. While some nations have made remarkable progress in transitioning to renewable energy sources and implementing carbon pricing mechanisms, others continue to rely heavily on fossil fuels. The concept of "climate justice" has emerged as a critical framework for understanding the differential responsibilities of developed and developing nations, as well as the disproportionate impacts of climate change on vulnerable populations.

The technological solutions to climate change exist, ranging from solar and wind energy to carbon capture and storage. The primary obstacles are economic, political, and social rather than technical. A successful transition will require massive investments in clean energy infrastructure, retraining of workers in affected industries, and fundamental changes in consumption patterns. Ultimately, addressing climate change will demand a collective response that transcends national boundaries and generational divides.`,
      level: 'ADVANCED',
      genre: 'ACADEMIC',
      wordCount: 350,
      estimatedTime: 12,
      questions: [
        {
          id: 'q1',
          articleId: 'test-advanced',
          type: 'multiple-choice',
          question: 'What is the primary driver of anthropogenic climate change according to the passage?',
          options: ['Natural temperature fluctuations', 'Accumulation of greenhouse gases', 'Solar radiation', 'Ocean currents'],
          correctAnswer: 'Accumulation of greenhouse gases',
          points: 10,
        },
        {
          id: 'q2',
          articleId: 'test-advanced',
          type: 'true-false',
          question: 'The Paris Agreement aimed to limit global warming to below 2°C.',
          correctAnswer: 'True',
          points: 10,
        },
        {
          id: 'q3',
          articleId: 'test-advanced',
          type: 'multiple-choice',
          question: 'What does the passage suggest about the main obstacles to addressing climate change?',
          options: ['They are primarily technical', 'They are economic, political, and social', 'They are primarily scientific', 'They are insurmountable'],
          correctAnswer: 'They are economic, political, and social',
          points: 10,
        },
        {
          id: 'q4',
          articleId: 'test-advanced',
          type: 'fill-blank',
          question: 'The concept of ________ has emerged as a critical framework for understanding differential responsibilities regarding climate change.',
          correctAnswer: 'climate justice',
          points: 10,
        },
        {
          id: 'q5',
          articleId: 'test-advanced',
          type: 'multiple-choice',
          question: 'What does "watershed moment" mean in the context of the passage?',
          options: ['A moment of drought', 'A significant turning point', 'A geographical feature', 'A time of crisis'],
          correctAnswer: 'A significant turning point',
          points: 10,
        },
        {
          id: 'q6',
          articleId: 'test-advanced',
          type: 'multiple-choice',
          question: 'What does "transcends" mean in the final paragraph?',
          options: ['Confines', 'Surpasses or goes beyond', 'Supports', 'Divides'],
          correctAnswer: 'Surpasses or goes beyond',
          points: 10,
        },
      ],
    },
  };

  const levelInfo = {
    BEGINNER: { name: '初级', time: 10, description: '适合初学者，词汇量约1500-2000' },
    INTERMEDIATE: { name: '中级', time: 15, description: '适合有一定基础的学习者，词汇量约3000-4000' },
    ADVANCED: { name: '高级', time: 20, description: '适合进阶学习者，词汇量约5000以上' },
  };

  const startTest = () => {
    const article = testArticles[selectedLevel as keyof typeof testArticles];
    setCurrentArticle(article);
    setTestStarted(true);
    setTimeLeft(levelInfo[selectedLevel as keyof typeof levelInfo].time * 60);
    setTestStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentArticle && currentQuestionIndex < currentArticle.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitTest = useCallback(() => {
    if (!currentArticle) return;

    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - testStartTime) / 1000);

    let correctCount = 0;
    currentArticle.questions.forEach((q) => {
      const userAnswer = answers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer.trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / currentArticle.questions.length) * 100);
    const passed = score >= 60;

    const result: TestResult = {
      testId: `reading-test-${Date.now()}`,
      title: `阅读测试 - ${levelInfo[selectedLevel as keyof typeof levelInfo].name}`,
      score,
      correctCount,
      totalQuestions: currentArticle.questions.length,
      passed,
      timeSpent,
      completedAt: new Date().toISOString(),
      level: selectedLevel,
    };

    localStorage.setItem('latestReadingTestResult', JSON.stringify(result));
    setIsSubmitting(false);
    setShowResult(true);
  }, [currentArticle, answers, testStartTime, selectedLevel]);

  // 计时器
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult) {
      submitTest();
    }
  }, [testStarted, timeLeft, showResult, submitTest]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 提交结果页面
  if (showResult) {
    const resultStr = localStorage.getItem('latestReadingTestResult');
    const result: TestResult = resultStr ? JSON.parse(resultStr) : null;

    if (result) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">阅读测试完成</h1>
              <div className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
                result.passed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.passed ? '🎉 恭喜通过!' : '😅 继续努力'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 text-center">
                <div className="text-sm opacity-90 mb-2">总分</div>
                <div className="text-5xl font-bold">{result.score}</div>
                <div className="text-lg mt-2 opacity-90">/ 100</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">正确题数</div>
                <div className="text-3xl font-bold text-gray-900">
                  {result.correctCount}/{result.totalQuestions}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {Math.round((result.correctCount / result.totalQuestions) * 100)}% 正确率
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">用时</div>
                <div className="text-3xl font-bold text-gray-900">
                  {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 mt-2">分钟:秒</div>
              </div>
            </div>

            {/* 智能分析 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 测试分析</h3>
              <div className="space-y-3">
                {result.score >= 80 && (
                  <>
                    <p className="text-gray-700">你的阅读理解能力很强，能够准确把握文章主旨和细节。</p>
                    <p className="text-gray-700">可以尝试更高难度的文章挑战自己。</p>
                  </>
                )}
                {result.score >= 60 && result.score < 80 && (
                  <>
                    <p className="text-gray-700">你的阅读理解能力良好，基本能够理解文章内容。</p>
                    <p className="text-gray-700">建议多练习，提高对细节信息的把握能力。</p>
                  </>
                )}
                {result.score < 60 && (
                  <>
                    <p className="text-gray-700">阅读理解能力需要加强训练。</p>
                    <p className="text-gray-700">建议从较低难度的文章开始，逐步提高。</p>
                  </>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/reading/test"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium text-center"
              >
                再测一次
              </Link>
              <Link
                href="/reading"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
              >
                返回阅读主页
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-center"
              >
                返回仪表板
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">阅读理解测试</h1>
            <p className="text-gray-600">
              选择适合你的难度等级，系统将为你准备一篇阅读理解测试
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedLevel === level
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    selectedLevel === level ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {levelInfo[level].name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {levelInfo[level].description}
                  </div>
                  <div className="text-sm text-gray-500">
                    测试时间: {levelInfo[level].time} 分钟
                  </div>
                  <div className={`mt-4 text-4xl ${
                    level === 'BEGINNER' ? '🌱' : level === 'INTERMEDIATE' ? '📚' : '🎓'
                  }`} />
                </div>
              </button>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-3 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-yellow-800">测试须知</h3>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• 测试包含阅读文章和理解问题</li>
                  <li>• 每篇文章有4-6道题目</li>
                  <li>• 完成后系统将给出评分和建议</li>
                  <li>• 达到60分即可通过测试</li>
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

  // 测试进行中页面
  if (currentArticle) {
    const currentQuestion = currentArticle.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const progress = (answeredCount / currentArticle.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* 顶部进度条 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Link
                href="/reading"
                className="text-gray-600 hover:text-gray-900"
              >
                ← 退出测试
              </Link>
              <span className="text-gray-400">|</span>
              <span className="font-medium text-gray-900">
                {currentArticle.title}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${
              timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            已回答: {answeredCount}/{currentArticle.questions.length} 题
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 文章阅读区 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{currentArticle.title}</h2>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentArticle.content}
                </p>
              </div>
            </div>
          </div>

          {/* 答题区 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">
                  问题 {currentQuestionIndex + 1}/{currentArticle.questions.length}
                </h3>
                <span className="text-sm text-gray-600">
                  {currentQuestion.points} 分
                </span>
              </div>

              <p className="text-gray-800 mb-6 font-medium">
                {currentQuestion.question}
              </p>

              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        answers[currentQuestion.id] === option
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <span className="font-medium text-gray-700">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(currentQuestion.id, 'True')}
                    className={`p-4 rounded-lg border-2 font-medium transition-all ${
                      answers[currentQuestion.id] === 'True'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    ✓ 正确
                  </button>
                  <button
                    onClick={() => handleAnswer(currentQuestion.id, 'False')}
                    className={`p-4 rounded-lg border-2 font-medium transition-all ${
                      answers[currentQuestion.id] === 'False'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    ✗ 错误
                  </button>
                </div>
              )}

              {currentQuestion.type === 'fill-blank' && (
                <div>
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="输入你的答案..."
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}

              {/* 导航按钮 */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-lg ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← 上一题
                </button>
                {currentQuestionIndex === currentArticle.questions.length - 1 ? (
                  <button
                    onClick={submitTest}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    {isSubmitting ? '提交中...' : '提交测试'}
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    下一题 →
                  </button>
                )}
              </div>

              {/* 问题列表 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">问题列表</h4>
                <div className="grid grid-cols-4 gap-2">
                  {currentArticle.questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        idx === currentQuestionIndex
                          ? 'bg-indigo-600 text-white'
                          : answers[q.id]
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
