'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReadingRecord {
  id: string;
  articleId: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: string;
  wordCount: number;
  estimatedTime: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: number; // 分钟
  completedAt: string;
  wrongAnswers?: {
    question: string;
    yourAnswer: string;
    correctAnswer: string;
  }[];
}

const mockHistory: ReadingRecord[] = [
  {
    id: 'rec-1',
    articleId: 'res-1',
    title: 'The Secret Garden',
    description: '经典儿童文学作品节选',
    level: 'BEGINNER',
    genre: 'STORY',
    wordCount: 450,
    estimatedTime: 5,
    score: 85,
    correctCount: 4,
    totalQuestions: 5,
    timeSpent: 6,
    completedAt: '2024-04-09T14:30:00',
  },
  {
    id: 'rec-2',
    articleId: 'res-2',
    title: 'Climate Change Report',
    description: '关于全球气候变化的新闻报道',
    level: 'INTERMEDIATE',
    genre: 'NEWS',
    wordCount: 680,
    estimatedTime: 8,
    score: 72,
    correctCount: 4,
    totalQuestions: 6,
    timeSpent: 12,
    completedAt: '2024-04-08T16:20:00',
  },
  {
    id: 'rec-3',
    articleId: 'res-4',
    title: 'The Solar System',
    description: '太阳系行星介绍',
    level: 'BEGINNER',
    genre: 'SCIENCE',
    wordCount: 520,
    estimatedTime: 6,
    score: 90,
    correctCount: 5,
    totalQuestions: 5,
    timeSpent: 7,
    completedAt: '2024-04-07T10:15:00',
  },
  {
    id: 'rec-4',
    articleId: 'res-3',
    title: 'Albert Einstein Biography',
    description: '爱因斯坦生平简介',
    level: 'INTERMEDIATE',
    genre: 'HISTORY',
    wordCount: 750,
    estimatedTime: 9,
    score: 68,
    correctCount: 3,
    totalQuestions: 5,
    timeSpent: 15,
    completedAt: '2024-04-06T09:45:00',
    wrongAnswers: [
      {
        question: 'When was Einstein born?',
        yourAnswer: '1879',
        correctAnswer: '1879',
      },
    ],
  },
  {
    id: 'rec-5',
    articleId: 'res-8',
    title: 'The Great Wall of China',
    description: '长城历史与建筑特点',
    level: 'INTERMEDIATE',
    genre: 'HISTORY',
    wordCount: 800,
    estimatedTime: 10,
    score: 78,
    correctCount: 4,
    totalQuestions: 5,
    timeSpent: 11,
    completedAt: '2024-04-05T15:30:00',
  },
  {
    id: 'rec-6',
    articleId: 'res-6',
    title: 'Traditional Chinese Festivals',
    description: '中国传统节日介绍',
    level: 'BEGINNER',
    genre: 'CULTURE',
    wordCount: 600,
    estimatedTime: 7,
    score: 92,
    correctCount: 5,
    totalQuestions: 5,
    timeSpent: 6,
    completedAt: '2024-04-04T11:20:00',
  },
];

export default function ReadingHistoryPage() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<ReadingRecord | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');

  useEffect(() => {
    setTimeout(() => {
      setRecords(mockHistory);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filterLevel !== 'all' && record.level !== filterLevel) return false;
    if (filterGenre !== 'all' && record.genre !== filterGenre) return false;
    if (timeRange !== 'all') {
      const recordDate = new Date(record.completedAt);
      const now = new Date();
      if (timeRange === 'week' && now.getTime() - recordDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
      if (timeRange === 'month' && now.getTime() - recordDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  });

  const levelColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
  };

  const levelText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
  };

  const genreColors: Record<string, string> = {
    STORY: 'bg-yellow-100 text-yellow-800',
    NEWS: 'bg-blue-100 text-blue-800',
    SCIENCE: 'bg-green-100 text-green-800',
    HISTORY: 'bg-red-100 text-red-800',
    CULTURE: 'bg-purple-100 text-purple-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  const genreText: Record<string, string> = {
    STORY: '故事',
    NEWS: '新闻',
    SCIENCE: '科学',
    HISTORY: '历史',
    CULTURE: '文化',
    OTHER: '其他',
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 60) return 'bg-orange-100';
    return 'bg-red-100';
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

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays === 2) return '前天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}个月前`;
  };

  // 计算统计数据
  const totalArticles = records.length;
  const averageScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
    : 0;
  const totalWords = records.reduce((sum, r) => sum + r.wordCount, 0);
  const totalTime = records.reduce((sum, r) => sum + r.timeSpent, 0);
  const totalCorrect = records.reduce((sum, r) => sum + r.correctCount, 0);
  const totalQuestions = records.reduce((sum, r) => sum + r.totalQuestions, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载历史记录中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">阅读历史</h1>
        <p className="text-gray-600 mt-2">
          查看你的阅读记录和学习轨迹
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">阅读文章</p>
              <p className="text-3xl font-bold text-gray-900">{totalArticles}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均分数</p>
              <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">阅读词数</p>
              <p className="text-3xl font-bold text-gray-900">{totalWords.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总阅读时间</p>
              <p className="text-3xl font-bold text-gray-900">{totalTime}</p>
              <p className="text-sm text-gray-600">分钟</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>
      </div>

      {/* 正确率概览 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">整体正确率</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">
              {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalCorrect}/{totalQuestions} 题正确
            </div>
          </div>
          <div className="flex-1 mx-8">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                style={{ width: `${totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {records.filter((r) => r.score >= 90).length}
            </div>
            <div className="text-sm text-gray-600">优秀 (90+)</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">
              {records.filter((r) => r.score >= 70 && r.score < 90).length}
            </div>
            <div className="text-sm text-gray-600">良好 (70-89)</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">
              {records.filter((r) => r.score < 70).length}
            </div>
            <div className="text-sm text-gray-600">需努力 (&lt;70)</div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">所有难度</option>
            <option value="BEGINNER">初级</option>
            <option value="INTERMEDIATE">中级</option>
            <option value="ADVANCED">高级</option>
          </select>

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">所有类型</option>
            <option value="STORY">故事</option>
            <option value="NEWS">新闻</option>
            <option value="SCIENCE">科学</option>
            <option value="HISTORY">历史</option>
            <option value="CULTURE">文化</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">全部时间</option>
            <option value="week">最近一周</option>
            <option value="month">最近一月</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            共 {filteredRecords.length} 条记录
          </div>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">文章</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">难度</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">类型</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">分数</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">正确率</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">用时</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">时间</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{record.title}</div>
                    <div className="text-sm text-gray-500">{record.description}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[record.level]}`}>
                      {levelText[record.level]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[record.genre]}`}>
                      {genreText[record.genre]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBg(record.score)} ${getScoreColor(record.score)}`}>
                      {record.score}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <span className="font-medium">{record.correctCount}/{record.totalQuestions}</span>
                      <span className="text-gray-500 ml-1">
                        ({Math.round((record.correctCount / record.totalQuestions) * 100)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {record.timeSpent}分钟
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{getRelativeTime(record.completedAt)}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.completedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mr-4"
                    >
                      查看详情
                    </button>
                    <Link
                      href={`/reading/practice/${record.articleId}`}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      再读一遍
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">暂无阅读记录</h3>
          <p className="text-gray-600 mb-6">开始你的第一次阅读吧!</p>
          <Link
            href="/reading/practice"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            开始阅读
          </Link>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">阅读详情</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedRecord.title}</h3>
                <p className="text-gray-600">{selectedRecord.description}</p>
                <div className="flex items-center space-x-2 mt-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[selectedRecord.level]}`}>
                    {levelText[selectedRecord.level]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[selectedRecord.genre]}`}>
                    {genreText[selectedRecord.genre]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {selectedRecord.wordCount}词 · {selectedRecord.estimatedTime}分钟
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">{selectedRecord.score}</div>
                  <div className="text-sm text-gray-600">得分</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {selectedRecord.correctCount}/{selectedRecord.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">正确题数</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">完成时间</span>
                  <span className="font-medium">{formatDate(selectedRecord.completedAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">阅读用时</span>
                  <span className="font-medium">{selectedRecord.timeSpent} 分钟</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">正确率</span>
                  <span className="font-medium">
                    {Math.round((selectedRecord.correctCount / selectedRecord.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>

              {selectedRecord.wrongAnswers && selectedRecord.wrongAnswers.length > 0 && (
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-bold text-red-800 mb-3">错题回顾</h4>
                  <div className="space-y-3">
                    {selectedRecord.wrongAnswers.map((item, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="text-gray-700 mb-1">{item.question}</div>
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">你的答案: {item.yourAnswer}</span>
                          <span className="text-green-600">正确答案: {item.correctAnswer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                关闭
              </button>
              <Link
                href={`/reading/practice/${selectedRecord.articleId}`}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                再读一遍
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
