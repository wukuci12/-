'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReadingArticle {
  id: string;
  title: string;
  content: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: 'STORY' | 'NEWS' | 'SCIENCE' | 'HISTORY' | 'OTHER';
  wordCount: number;
  estimatedTime: number;
  vocabulary: Array<{
    word: string;
    meaning: string;
  }>;
}

interface ReadingQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  points: number;
}

interface ReadingPractice {
  article: ReadingArticle;
  questions: ReadingQuestion[];
  currentQuestionIndex: number;
  userAnswers: (string | boolean | null)[];
  showResults: boolean;
  score: number;
  timeSpent: number;
  startTime: number;
}

export default function ReadingPracticePage() {
  const router = useRouter();
  const [practice, setPractice] = useState<ReadingPractice | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isArticleRead, setIsArticleRead] = useState(false);

  // 模拟阅读文章数据
  const sampleArticle: ReadingArticle = {
    id: '1',
    title: 'The Importance of Reading',
    content: `Reading is one of the most important skills we can develop. It opens up new worlds, introduces us to different ideas, and helps us understand other cultures. Whether you're reading a novel, a news article, or a scientific paper, the act of reading strengthens your brain and improves your vocabulary.

For students, reading is especially important. It helps with academic success in all subjects. When you read regularly, you become better at understanding complex texts, which is useful for studying history, science, and literature. Reading also improves your writing skills because you learn how sentences are structured and how ideas are expressed clearly.

Many people think reading is just about understanding words on a page, but it's much more than that. Reading involves critical thinking. You need to analyze what the author is saying, evaluate the information, and form your own opinions. This skill is valuable not only in school but also in everyday life.

In today's digital age, we have more reading materials available than ever before. However, it's important to choose quality content. Reading well-written books and articles will have a greater impact on your language development than just scrolling through social media posts.

The best way to improve your reading skills is to read every day. Start with materials that interest you, and gradually challenge yourself with more difficult texts. Remember, the goal is not just to finish the text, but to understand and learn from it.`,
    level: 'INTERMEDIATE',
    genre: 'OTHER',
    wordCount: 245,
    estimatedTime: 5,
    vocabulary: [
      { word: 'develop', meaning: '发展，培养' },
      { word: 'academic', meaning: '学术的' },
      { word: 'complex', meaning: '复杂的' },
      { word: 'critical thinking', meaning: '批判性思维' },
      { word: 'evaluate', meaning: '评估' },
    ],
  };

  // 模拟问题
  const sampleQuestions: ReadingQuestion[] = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'According to the article, why is reading important for students?',
      options: [
        'It helps with academic success in all subjects',
        'It is only important for literature classes',
        'It is not mentioned in the article',
        'It helps with physical education',
      ],
      correctAnswer: 'It helps with academic success in all subjects',
      explanation: '文章明确提到："For students, reading is especially important. It helps with academic success in all subjects."',
      points: 10,
    },
    {
      id: 2,
      type: 'true-false',
      question: 'Reading only involves understanding words on a page.',
      correctAnswer: false,
      explanation: '文章指出："Many people think reading is just about understanding words on a page, but it\'s much more than that. Reading involves critical thinking."',
      points: 5,
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'What does the article suggest about reading in the digital age?',
      options: [
        'We should choose quality content to read',
        'Social media is the best reading material',
        'All reading materials are equally beneficial',
        'Digital reading is not mentioned',
      ],
      correctAnswer: 'We should choose quality content to read',
      explanation: '文章提到："In today\'s digital age... it\'s important to choose quality content. Reading well-written books and articles will have a greater impact on your language development."',
      points: 10,
    },
    {
      id: 4,
      type: 'short-answer',
      question: 'According to the article, what is the best way to improve reading skills?',
      correctAnswer: 'read every day',
      explanation: '文章最后提到："The best way to improve your reading skills is to read every day."',
      points: 10,
    },
  ];

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setPractice({
        article: sampleArticle,
        questions: sampleQuestions,
        currentQuestionIndex: 0,
        userAnswers: new Array(sampleQuestions.length).fill(null),
        showResults: false,
        score: 0,
        timeSpent: 0,
        startTime: Date.now(),
      });
      setIsLoading(false);
    }, 800);
  }, []);

  const currentQuestion = practice?.questions[practice.currentQuestionIndex];

  const handleAnswerSelect = (answer: string | boolean) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!practice || selectedAnswer === null) return;

    // 保存当前答案
    const newUserAnswers = [...practice.userAnswers];
    newUserAnswers[practice.currentQuestionIndex] = selectedAnswer;

    // 计算当前得分
    let newScore = practice.score;
    const currentQ = practice.questions[practice.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    if (isCorrect) {
      newScore += currentQ.points;
    }

    if (practice.currentQuestionIndex < practice.questions.length - 1) {
      // 移动到下一题
      setPractice({
        ...practice,
        currentQuestionIndex: practice.currentQuestionIndex + 1,
        userAnswers: newUserAnswers,
        score: newScore,
      });
      setSelectedAnswer(practice.userAnswers[practice.currentQuestionIndex + 1]);
    } else {
      // 所有问题完成，显示结果
      const finalAnswers = [...newUserAnswers];
      finalAnswers[practice.currentQuestionIndex] = selectedAnswer;
      const finalScore = newScore;
      const totalTime = Math.floor((Date.now() - practice.startTime) / 1000);

      setPractice({
        ...practice,
        userAnswers: finalAnswers,
        score: finalScore,
        timeSpent: totalTime,
        showResults: true,
      });

      // 保存结果到本地存储
      const result = {
        articleId: practice.article.id,
        title: practice.article.title,
        score: Math.round((finalScore / (practice.questions.reduce((sum, q) => sum + q.points, 0))) * 100),
        correctCount: finalAnswers.filter((ans, idx) => ans === practice.questions[idx].correctAnswer).length,
        totalQuestions: practice.questions.length,
        completedAt: new Date().toISOString(),
        timeSpent: totalTime,
      };
      localStorage.setItem('latestReadingResult', JSON.stringify(result));
    }
  };

  const handlePrevQuestion = () => {
    if (!practice || practice.currentQuestionIndex === 0) return;

    setPractice({
      ...practice,
      currentQuestionIndex: practice.currentQuestionIndex - 1,
    });
    setSelectedAnswer(practice.userAnswers[practice.currentQuestionIndex - 1]);
  };

  const handleStartQuestions = () => {
    setIsArticleRead(true);
  };

  const handleFinishReading = () => {
    router.push('/reading/completed');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800';
      case 'ADVANCED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return '初级';
      case 'INTERMEDIATE': return '中级';
      case 'ADVANCED': return '高级';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载阅读练习中...</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
        <p className="text-gray-600 mb-8">无法加载阅读练习，请重试。</p>
        <Link
          href="/reading"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回阅读理解
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题和进度 */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">阅读理解练习</h1>
            <p className="text-gray-600 mt-1">阅读文章并回答相关问题</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-600">难度</div>
              <div className={`font-medium ${getLevelColor(practice.article.level)} px-2 py-1 rounded`}>
                {getLevelText(practice.article.level)}
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-600">问题进度</div>
              <div className="text-xl font-bold text-gray-900">
                {isArticleRead ? `${practice.currentQuestionIndex + 1} / ${practice.questions.length}` : '阅读文章'}
              </div>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: isArticleRead
                ? `${((practice.currentQuestionIndex + 1) / practice.questions.length) * 100}%`
                : '0%'
            }}
          ></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：文章区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{practice.article.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-600">{practice.article.wordCount}词</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-600">预计阅读时间: {practice.article.estimatedTime}分钟</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowVocabulary(!showVocabulary)}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-medium"
                >
                  {showVocabulary ? '隐藏词汇' : '显示词汇'}
                </button>
              </div>

              {/* 词汇列表 */}
              {showVocabulary && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3">重点词汇</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {practice.article.vocabulary.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="font-medium text-gray-900">{item.word}</div>
                        <div className="text-sm text-gray-600">{item.meaning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 文章内容 */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {practice.article.content}
                </div>
              </div>

              {/* 阅读完成按钮 */}
              {!isArticleRead && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">请仔细阅读以上文章，完成后点击按钮开始回答问题。</p>
                    <button
                      onClick={handleStartQuestions}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg"
                    >
                      我已阅读完成，开始答题
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：问题区域 */}
        <div className="lg:col-span-1">
          {isArticleRead ? (
            practice.showResults ? (
              // 结果显示
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="h-20 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-white">📊</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">练习完成！</h2>
                  <p className="text-gray-600">你的阅读理解练习结果如下</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {Math.round((practice.score / (practice.questions.reduce((sum, q) => sum + q.points, 0))) * 100)}
                      </div>
                      <div className="text-gray-600">得分 / 100</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow">
                      <div className="text-2xl font-bold text-gray-900">
                        {practice.userAnswers.filter((ans, idx) => ans === practice.questions[idx].correctAnswer).length}
                      </div>
                      <div className="text-gray-600 text-sm">正确题数</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                      <div className="text-2xl font-bold text-gray-900">{practice.timeSpent}s</div>
                      <div className="text-gray-600 text-sm">用时</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleFinishReading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium"
                    >
                      查看详细分析
                    </button>
                    <button
                      onClick={() => {
                        setPractice({
                          ...practice,
                          currentQuestionIndex: 0,
                          userAnswers: new Array(practice.questions.length).fill(null),
                          showResults: false,
                          score: 0,
                          timeSpent: 0,
                          startTime: Date.now(),
                        });
                        setSelectedAnswer(null);
                        setIsArticleRead(false);
                      }}
                      className="w-full mt-4 py-4 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                    >
                      重新练习
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 问题界面
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">问题 {practice.currentQuestionIndex + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{currentQuestion?.points} 分</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{currentQuestion?.question}</h3>
                </div>

                {/* 根据问题类型渲染不同输入方式 */}
                {currentQuestion?.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition ${
                          selectedAnswer === option
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 ${
                            selectedAnswer === option
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswerSelect(true)}
                      className={`p-6 rounded-xl border-2 text-center transition ${
                        selectedAnswer === true
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">✓</div>
                      <div className="font-medium">正确</div>
                    </button>
                    <button
                      onClick={() => handleAnswerSelect(false)}
                      className={`p-6 rounded-xl border-2 text-center transition ${
                        selectedAnswer === false
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">✗</div>
                      <div className="font-medium">错误</div>
                    </button>
                  </div>
                )}

                {currentQuestion?.type === 'short-answer' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedAnswer as string || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="输入你的答案..."
                    />
                    <div className="text-sm text-gray-600">
                      提示：答案可能是一个或多个关键词
                    </div>
                  </div>
                )}

                {/* 导航按钮 */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={practice.currentQuestionIndex === 0}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一题
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {practice.currentQuestionIndex < practice.questions.length - 1 ? '下一题' : '完成练习'}
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            // 阅读提示
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 阅读提示</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">仔细阅读文章，理解主要内容</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">注意文章的结构和逻辑关系</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">遇到生词可以查看右侧词汇表</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">阅读完成后将回答相关问题</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 底部导航 */}
      <div className="flex justify-between mt-8">
        <Link
          href="/reading"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回阅读理解
        </Link>
        <div className="text-sm text-gray-600">
          按空格键可以快速显示/隐藏词汇表
        </div>
      </div>
    </div>
  );
}