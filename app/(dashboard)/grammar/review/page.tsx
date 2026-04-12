'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WrongQuestion {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  questionId: number;
  questionContent: string;
  userAnswer: any;
  correctAnswer: any;
  explanation: string;
  errorType: string;
  completedAt: string;
  retried?: boolean;
  retryCorrect?: boolean;
}

export default function GrammarReviewPage() {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unretried, retried
  const [selectedQuestion, setSelectedQuestion] = useState<WrongQuestion | null>(null);

  useEffect(() => {
    // 模拟加载错题数据
    const loadWrongQuestions = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        setTimeout(() => {
          const mockWrongQuestions: WrongQuestion[] = [
            {
              id: '1',
              exerciseId: '1',
              exerciseTitle: '时态选择练习',
              questionId: 3,
              questionContent: 'I usually ______ (go) to school by bus, but today I ______ (walk).',
              userAnswer: ['go', 'walk'],
              correctAnswer: ['go', 'am walking'],
              explanation: '第一空表示习惯性动作用一般现在时，第二空表示正在进行的动作用现在进行时。',
              errorType: '时态错误',
              completedAt: '2024-04-08T10:30:00Z',
              retried: true,
              retryCorrect: true,
            },
            {
              id: '2',
              exerciseId: '2',
              exerciseTitle: '动词不定式',
              questionId: 5,
              questionContent: 'She wants ______ (become) a doctor when she grows up.',
              userAnswer: 'becoming',
              correctAnswer: 'to become',
              explanation: 'want后面应该接动词不定式，而不是动名词。',
              errorType: '非谓语动词错误',
              completedAt: '2024-04-07T15:20:00Z',
              retried: true,
              retryCorrect: false,
            },
            {
              id: '3',
              exerciseId: '3',
              exerciseTitle: '定语从句',
              questionId: 2,
              questionContent: 'This is the book ______ I bought yesterday.',
              userAnswer: 'what',
              correctAnswer: 'that/which',
              explanation: '定语从句中，当先行词是物时，关系代词可以用that或which，不能用what。',
              errorType: '关系代词错误',
              completedAt: '2024-04-09T09:15:00Z',
              retried: false,
            },
            {
              id: '4',
              exerciseId: '4',
              exerciseTitle: '虚拟语气',
              questionId: 7,
              questionContent: 'If I ______ (be) you, I would accept the offer.',
              userAnswer: 'am',
              correctAnswer: 'were',
              explanation: '虚拟语气中，be动词在条件句中所有人称都用were。',
              errorType: '虚拟语气错误',
              completedAt: '2024-04-06T14:45:00Z',
              retried: false,
            },
            {
              id: '5',
              exerciseId: '5',
              exerciseTitle: '主谓一致',
              questionId: 1,
              questionContent: 'Neither the students nor the teacher ______ (like) the new textbook.',
              userAnswer: 'likes',
              correctAnswer: 'likes',
              explanation: '就近原则：neither...nor...连接两个主语时，谓语动词与nor后面的主语一致。',
              errorType: '主谓一致错误',
              completedAt: '2024-04-05T11:30:00Z',
              retried: true,
              retryCorrect: true,
            },
          ];

          setWrongQuestions(mockWrongQuestions);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('加载错题数据错误:', error);
        setIsLoading(false);
      }
    };

    loadWrongQuestions();
  }, []);

  const filteredQuestions = wrongQuestions.filter(q => {
    if (filter === 'unretried') return !q.retried;
    if (filter === 'retried') return q.retried;
    return true;
  });

  const stats = {
    total: wrongQuestions.length,
    unretried: wrongQuestions.filter(q => !q.retried).length,
    retriedCorrect: wrongQuestions.filter(q => q.retried && q.retryCorrect).length,
    retriedWrong: wrongQuestions.filter(q => q.retried && !q.retryCorrect).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载错题数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">错题复习</h1>
        <p className="text-gray-600 text-lg">
          分析错误原因，巩固薄弱知识点，避免重复犯错
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总错题数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">待复习</p>
              <p className="text-3xl font-bold text-gray-900">{stats.unretried}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">复习正确</p>
              <p className="text-3xl font-bold text-gray-900">{stats.retriedCorrect}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">复习错误</p>
              <p className="text-3xl font-bold text-gray-900">{stats.retriedWrong}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✗</span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和操作 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">错题列表</h2>
            <p className="text-gray-600 text-sm">
              共 {wrongQuestions.length} 道错题，其中 {stats.unretried} 道待复习
            </p>
          </div>

          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="all">全部错题</option>
              <option value="unretried">待复习</option>
              <option value="retried">已复习</option>
            </select>

            <button
              onClick={() => {
                // 随机选择一道未复习的错题进行练习
                const unretriedQuestions = wrongQuestions.filter(q => !q.retried);
                if (unretriedQuestions.length > 0) {
                  const randomQuestion = unretriedQuestions[Math.floor(Math.random() * unretriedQuestions.length)];
                  setSelectedQuestion(randomQuestion);
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
              disabled={stats.unretried === 0}
            >
              随机复习
            </button>
          </div>
        </div>

        {/* 错题列表 */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">恭喜！</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? '你目前还没有错题记录。'
                  : filter === 'unretried'
                    ? '所有错题都已复习完成！'
                    : '暂无符合条件的错题。'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  查看全部错题
                </button>
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`p-6 border rounded-xl hover:shadow-md transition-all cursor-pointer ${
                  selectedQuestion?.id === question.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : question.retried
                    ? question.retryCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => setSelectedQuestion(question)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {question.retried ? (
                        question.retryCorrect ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium mr-3">
                            复习正确
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium mr-3">
                            复习错误
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium mr-3">
                          待复习
                        </span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {question.errorType}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {question.exerciseTitle} - 第 {question.questionId} 题
                    </h3>
                    <p className="text-gray-700 mb-3">{question.questionContent}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">你的答案</div>
                        <div className="font-medium text-red-600">
                          {typeof question.userAnswer === 'object'
                            ? JSON.stringify(question.userAnswer)
                            : question.userAnswer}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">正确答案</div>
                        <div className="font-medium text-green-600">
                          {typeof question.correctAnswer === 'object'
                            ? JSON.stringify(question.correctAnswer)
                            : question.correctAnswer}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <div className="text-sm text-gray-500 text-right">
                      {new Date(question.completedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 错题详情面板 */}
      {selectedQuestion && (
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">错题详情</h2>
            <button
              onClick={() => setSelectedQuestion(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* 题目信息 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">题目信息</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-gray-700 text-lg mb-4">{selectedQuestion.questionContent}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">错误类型</div>
                    <div className="font-medium">{selectedQuestion.errorType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">所属练习</div>
                    <div className="font-medium">{selectedQuestion.exerciseTitle}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 答案解析 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">答案解析</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="text-gray-700 mb-4">{selectedQuestion.explanation}</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">你的答案</div>
                    <div className="font-medium p-3 bg-white rounded border border-red-200">
                      {typeof selectedQuestion.userAnswer === 'object'
                        ? JSON.stringify(selectedQuestion.userAnswer)
                        : selectedQuestion.userAnswer}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">正确答案</div>
                    <div className="font-medium p-3 bg-white rounded border border-green-200 text-green-700">
                      {typeof selectedQuestion.correctAnswer === 'object'
                        ? JSON.stringify(selectedQuestion.correctAnswer)
                        : selectedQuestion.correctAnswer}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 复习建议 */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">复习建议</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">理解错误原因，避免重复犯错</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">记录相关语法规则，加强记忆</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">寻找类似题目进行针对性练习</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">定期复习，巩固学习效果</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // 标记为已复习
                    setWrongQuestions(prev =>
                      prev.map(q =>
                        q.id === selectedQuestion.id
                          ? { ...q, retried: true, retryCorrect: true }
                          : q
                      )
                    );
                    setSelectedQuestion(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  标记为掌握
                </button>
                <button
                  onClick={() => {
                    // 需要更多练习
                    setWrongQuestions(prev =>
                      prev.map(q =>
                        q.id === selectedQuestion.id
                          ? { ...q, retried: true, retryCorrect: false }
                          : q
                      )
                    );
                    setSelectedQuestion(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  仍需练习
                </button>
              </div>

              <Link
                href={`/grammar/${selectedQuestion.exerciseId}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                返回原练习
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">错题复习方法</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">①</span>
              <span className="text-gray-700">分析错误原因，理解语法规则</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">②</span>
              <span className="text-gray-700">记录错题和正确解法，建立错题本</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">③</span>
              <span className="text-gray-700">定期复习错题，巩固薄弱环节</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">④</span>
              <span className="text-gray-700">寻找类似题目，进行针对性练习</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">复习计划</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">今日复习目标</span>
                <span className="font-medium">3-5道错题</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min((stats.retriedCorrect + stats.retriedWrong) / Math.max(stats.total, 1) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">建议复习频率</div>
              <div className="text-lg font-medium text-gray-900">每周2-3次</div>
              <div className="text-sm text-gray-600">每次15-20分钟</div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex justify-between items-center">
        <Link
          href="/grammar"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回语法学习
        </Link>
        <div className="text-sm text-gray-600">
          已复习 {stats.retriedCorrect + stats.retriedWrong}/{stats.total} 道错题
        </div>
      </div>
    </div>
  );
}