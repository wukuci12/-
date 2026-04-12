'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VocabularyItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  level: string;
  nextReview: string; // 下次复习时间
  reviewCount: number; // 复习次数
  easeFactor: number; // 易度因子 (间隔重复算法)
}

interface ReviewStats {
  totalDue: number;
  completed: number;
  accuracy: number;
  timeSpent: number;
}

type ReviewMode = 'meaning' | 'spelling' | 'sentence';

export default function ReviewVocabularyPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('meaning');
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [reviewedWords, setReviewedWords] = useState<number[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalDue: 0,
    completed: 0,
    accuracy: 0,
    timeSpent: 0,
  });
  const [startTime] = useState(Date.now());

  // 模拟到期复习的词汇数据 (基于间隔重复算法)
  const dueWords: VocabularyItem[] = [
    {
      id: 1,
      word: 'accommodate',
      phonetic: '/əˈkɒmədeɪt/',
      meaning: '容纳，提供住宿；使适应',
      example: 'The hotel can accommodate up to 500 guests.',
      exampleTranslation: '这家酒店可容纳多达500位客人。',
      level: 'ADVANCED',
      nextReview: '2024-04-10',
      reviewCount: 2,
      easeFactor: 2.5,
    },
    {
      id: 2,
      word: 'beneficial',
      phonetic: '/ˌbenɪˈfɪʃl/',
      meaning: '有益的，有利的',
      example: 'Regular exercise is beneficial to health.',
      exampleTranslation: '定期锻炼对健康有益。',
      level: 'INTERMEDIATE',
      nextReview: '2024-04-09',
      reviewCount: 1,
      easeFactor: 2.0,
    },
    {
      id: 3,
      word: 'consequence',
      phonetic: '/ˈkɒnsɪkwəns/',
      meaning: '结果，后果',
      example: 'He had to face the consequences of his actions.',
      exampleTranslation: '他必须面对自己行为的后果。',
      level: 'INTERMEDIATE',
      nextReview: '2024-04-09',
      reviewCount: 3,
      easeFactor: 2.8,
    },
    {
      id: 4,
      word: 'dilemma',
      phonetic: '/dɪˈlemə/',
      meaning: '困境，进退两难',
      example: 'She faced the dilemma of choosing between career and family.',
      exampleTranslation: '她面临着在事业和家庭之间做出选择的困境。',
      level: 'ADVANCED',
      nextReview: '2024-04-11',
      reviewCount: 0,
      easeFactor: 1.7,
    },
    {
      id: 5,
      word: 'elaborate',
      phonetic: '/ɪˈlæbərət/',
      meaning: '详细的，精心制作的',
      example: 'They made elaborate preparations for the ceremony.',
      exampleTranslation: '他们为仪式做了精心的准备。',
      level: 'ADVANCED',
      nextReview: '2024-04-10',
      reviewCount: 1,
      easeFactor: 2.2,
    },
  ];

  useEffect(() => {
    // 模拟API调用获取到期复习词汇
    setTimeout(() => {
      setWords(dueWords);
      setStats(prev => ({
        ...prev,
        totalDue: dueWords.length,
      }));
      setIsLoading(false);
    }, 500);
  }, []);

  const currentWord = words[currentIndex];

  // 根据复习模式生成题目
  const getQuestion = () => {
    if (!currentWord) return '';

    switch (reviewMode) {
      case 'meaning':
        return `单词 "${currentWord.word}" 的中文释义是什么？`;
      case 'spelling':
        return `根据发音 "${currentWord.phonetic}" 拼写单词：`;
      case 'sentence':
        return `用单词 "${currentWord.word}" 造一个英文句子：`;
      default:
        return '';
    }
  };

  // 检查答案
  const checkAnswer = () => {
    if (!currentWord) return false;

    const userAnswerLower = userAnswer.trim().toLowerCase();

    switch (reviewMode) {
      case 'meaning':
        // 检查是否包含关键词
        const keywords = currentWord.meaning.split(/[，；]/).map(k => k.trim());
        return keywords.some(keyword =>
          userAnswerLower.includes(keyword.toLowerCase())
        );
      case 'spelling':
        return userAnswerLower === currentWord.word.toLowerCase();
      case 'sentence':
        // 简单的句子检查：是否包含单词
        return userAnswerLower.includes(currentWord.word.toLowerCase());
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const correct = checkAnswer();
    setIsCorrect(correct);
    setShowFeedback(true);

    // 更新统计
    setStats(prev => ({
      ...prev,
      completed: prev.completed + 1,
      accuracy: prev.completed === 0
        ? (correct ? 100 : 0)
        : Math.round(((prev.accuracy * prev.completed / 100) + (correct ? 1 : 0)) / (prev.completed + 1) * 100),
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
    }));

    if (!reviewedWords.includes(currentWord.id)) {
      setReviewedWords([...reviewedWords, currentWord.id]);
    }
  };

  const handleNext = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setIsCorrect(false);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 所有单词复习完成
      router.push('/vocabulary/review/completed');
    }
  };

  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
  const reviewAccuracy = stats.completed > 0 ? stats.accuracy : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载复习词汇中...</p>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">没有到期复习的词汇</h2>
        <p className="text-gray-600 mb-8">恭喜！您已经完成了所有到期的复习任务。</p>
        <Link
          href="/vocabulary"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回词汇学习
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 复习模式和进度 */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">词汇复习</h1>
            <p className="text-gray-600 mt-1">巩固记忆，提高长期记忆效果</p>
          </div>

          {/* 复习模式选择 */}
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setReviewMode('meaning')}
              className={`px-4 py-2 rounded-lg font-medium ${reviewMode === 'meaning' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              释义测试
            </button>
            <button
              onClick={() => setReviewMode('spelling')}
              className={`px-4 py-2 rounded-lg font-medium ${reviewMode === 'spelling' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              拼写测试
            </button>
            <button
              onClick={() => setReviewMode('sentence')}
              className={`px-4 py-2 rounded-lg font-medium ${reviewMode === 'sentence' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              造句练习
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">
              单词 {currentIndex + 1} / {words.length}
            </div>
            <div className="text-sm font-medium text-gray-900">
              {Math.round(progress)}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 复习统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
            <div className="text-gray-600 text-sm">已完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{words.length - currentIndex - 1}</div>
            <div className="text-gray-600 text-sm">待复习</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{reviewAccuracy}%</div>
            <div className="text-gray-600 text-sm">准确率</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.timeSpent}s</div>
            <div className="text-gray-600 text-sm">用时</div>
          </div>
        </div>
      </div>

      {/* 复习卡片 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          {/* 题目区域 */}
          <div className="mb-8">
            <div className="text-sm font-medium text-gray-600 mb-2">题目</div>
            <div className="text-2xl font-bold text-gray-900">{getQuestion()}</div>
          </div>

          {/* 单词提示 (根据模式显示不同提示) */}
          {reviewMode === 'meaning' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">单词信息</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-gray-900">{currentWord.word}</div>
                  <div className="text-gray-600 font-mono">{currentWord.phonetic}</div>
                </div>
                <div className="text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {currentWord.level}
                  </span>
                </div>
              </div>
            </div>
          )}

          {reviewMode === 'spelling' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">发音提示</div>
              <div className="text-xl font-mono text-gray-900">{currentWord.phonetic}</div>
              <div className="text-sm text-gray-600 mt-2">根据国际音标拼写单词</div>
            </div>
          )}

          {reviewMode === 'sentence' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <div className="text-sm font-medium text-gray-600 mb-2">单词提示</div>
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-lg font-bold text-gray-900">{currentWord.word}</div>
                  <div className="text-gray-600">{currentWord.meaning}</div>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {currentWord.level}
                </div>
              </div>
            </div>
          )}

          {/* 答案输入区域 */}
          {!showFeedback ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  你的答案
                </label>
                <textarea
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={reviewMode === 'sentence' ? 3 : 1}
                  placeholder="输入你的答案..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交答案
              </button>
            </div>
          ) : (
            /* 反馈区域 */
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-6 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center mb-4">
                  <div className={`h-10 w-10 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mr-4`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {isCorrect ? '回答正确！' : '回答不正确'}
                    </div>
                    <div className="text-gray-600">
                      {isCorrect ? '你掌握了这个单词！' : '需要更多练习'}
                    </div>
                  </div>
                </div>

                {/* 正确答案展示 */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">单词</div>
                    <div className="text-xl font-bold text-gray-900">{currentWord.word}</div>
                    <div className="text-gray-600 font-mono">{currentWord.phonetic}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">释义</div>
                    <div className="text-lg text-gray-900">{currentWord.meaning}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">例句</div>
                    <div className="space-y-2">
                      <div className="text-gray-800 italic border-l-4 border-indigo-500 pl-4 py-2">
                        {currentWord.example}
                      </div>
                      <div className="text-gray-600 border-l-4 border-gray-300 pl-4 py-2">
                        {currentWord.exampleTranslation}
                      </div>
                    </div>
                  </div>

                  {/* 用户答案对比 (如果错误) */}
                  {!isCorrect && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">你的答案</div>
                      <div className="text-gray-700 bg-gray-50 p-3 rounded-lg">{userAnswer}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 复习建议 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">复习建议</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>下次复习时间：{currentWord.nextReview}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>已复习次数：{currentWord.reviewCount}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>记忆强度：{currentWord.easeFactor >= 2.5 ? '强' : currentWord.easeFactor >= 2.0 ? '中' : '弱'}</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg"
              >
                继续下一个单词
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 复习策略说明 */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">间隔重复复习策略</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">算法原理</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>根据记忆曲线安排复习时间</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>回答正确延长复习间隔</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>回答错误缩短复习间隔</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span>易度因子动态调整</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">复习效果</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>长期记忆保持率提高60%</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>减少无效复习时间</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>个性化学习路径</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>预防记忆遗忘</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <Link
          href="/vocabulary"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          返回词汇学习
        </Link>
        <div className="text-sm text-gray-600">
          按Enter键快速提交答案
        </div>
      </div>
    </div>
  );
}