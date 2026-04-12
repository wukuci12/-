'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WritingRecord {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  content: string;
  score: number;
  wordCount: number;
  timeSpent: number;
  completedAt: string;
  feedback?: {
    overall: string;
    contentScore: number;
    structureScore: number;
    languageScore: number;
    grammarScore: number;
    suggestions: string[];
  };
}

const mockHistory: WritingRecord[] = [
  {
    id: 'rec-1',
    title: 'My Favorite Holiday',
    type: 'NARRATIVE',
    difficulty: 'BEGINNER',
    content: 'Last summer vacation was the most memorable one I have ever had...',
    score: 85,
    wordCount: 250,
    timeSpent: 1800,
    completedAt: '2024-04-09T10:30:00',
    feedback: {
      overall: '优秀',
      contentScore: 22,
      structureScore: 21,
      languageScore: 26,
      grammarScore: 16,
      suggestions: ['注意使用更多高级词汇', '可以添加更多细节描写'],
    },
  },
  {
    id: 'rec-2',
    title: 'The Importance of Reading',
    type: 'EXPOSITORY',
    difficulty: 'INTERMEDIATE',
    content: 'Reading is one of the most important skills we can develop...',
    score: 78,
    wordCount: 320,
    timeSpent: 2400,
    completedAt: '2024-04-08T14:20:00',
    feedback: {
      overall: '良好',
      contentScore: 20,
      structureScore: 19,
      languageScore: 23,
      grammarScore: 16,
      suggestions: ['结构可以更清晰', '建议添加更多具体例子'],
    },
  },
  {
    id: 'rec-3',
    title: 'Should Students Wear Uniforms?',
    type: 'ARGUMENTATIVE',
    difficulty: 'INTERMEDIATE',
    content: 'The debate about school uniforms has been ongoing for years...',
    score: 82,
    wordCount: 350,
    timeSpent: 2700,
    completedAt: '2024-04-07T16:45:00',
    feedback: {
      overall: '良好',
      contentScore: 21,
      structureScore: 20,
      languageScore: 25,
      grammarScore: 16,
      suggestions: ['论证逻辑严密', '可以加强结论部分'],
    },
  },
  {
    id: 'rec-4',
    title: 'A Letter to My Future Self',
    type: 'NARRATIVE',
    difficulty: 'BEGINNER',
    content: 'Dear future me, I hope this letter finds you well...',
    score: 88,
    wordCount: 200,
    timeSpent: 1500,
    completedAt: '2024-04-06T09:15:00',
    feedback: {
      overall: '优秀',
      contentScore: 23,
      structureScore: 21,
      languageScore: 27,
      grammarScore: 17,
      suggestions: ['情感真挚', '语言优美'],
    },
  },
];

export default function WritingHistoryPage() {
  const [records, setRecords] = useState<WritingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<WritingRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');

  useEffect(() => {
    setTimeout(() => {
      setRecords(mockHistory);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filterType !== 'all' && record.type !== filterType) return false;
    if (timeRange !== 'all') {
      const recordDate = new Date(record.completedAt);
      const now = new Date();
      if (timeRange === 'week' && now.getTime() - recordDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
      if (timeRange === 'month' && now.getTime() - recordDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
    }
    return true;
  });

  const typeText: Record<string, string> = {
    NARRATIVE: '记叙文',
    EXPOSITORY: '说明文',
    ARGUMENTATIVE: '议论文',
    PRACTICAL: '应用文',
  };

  const typeColors: Record<string, string> = {
    NARRATIVE: 'bg-purple-100 text-purple-800',
    EXPOSITORY: 'bg-blue-100 text-blue-800',
    ARGUMENTATIVE: 'bg-red-100 text-red-800',
    PRACTICAL: 'bg-green-100 text-green-800',
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-orange-100';
  };

  // 统计数据
  const totalEssays = records.length;
  const averageScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
    : 0;
  const totalWords = records.reduce((sum, r) => sum + r.wordCount, 0);
  const totalTime = records.reduce((sum, r) => sum + r.timeSpent, 0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

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
        <h1 className="text-3xl font-bold text-gray-900">写作历史</h1>
        <p className="text-gray-600 mt-2">
          查看你的写作记录和学习进步
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">写作总数</p>
              <p className="text-3xl font-bold text-gray-900">{totalEssays}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
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
              <p className="text-sm text-gray-600">总词数</p>
              <p className="text-3xl font-bold text-gray-900">{totalWords.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总用时</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(totalTime / 3600)}</p>
              <p className="text-sm text-gray-600">小时</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>
      </div>

      {/* 分数分布 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">分数分布</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600">
              {records.filter((r) => r.score >= 85).length}
            </div>
            <div className="text-sm text-gray-600">优秀 (85+)</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-3xl font-bold text-yellow-600">
              {records.filter((r) => r.score >= 70 && r.score < 85).length}
            </div>
            <div className="text-sm text-gray-600">良好 (70-84)</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">
              {records.filter((r) => r.score < 70).length}
            </div>
            <div className="text-sm text-gray-600">需提高 (&lt;70)</div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">所有类型</option>
            <option value="NARRATIVE">记叙文</option>
            <option value="EXPOSITORY">说明文</option>
            <option value="ARGUMENTATIVE">议论文</option>
            <option value="PRACTICAL">应用文</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                <th className="text-left py-4 px-6 text-gray-700 font-medium">标题</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">类型</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">分数</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">词数</th>
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
                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">{record.content}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[record.type]}`}>
                      {typeText[record.type]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBg(record.score)} ${getScoreColor(record.score)}`}>
                      {record.score}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {record.wordCount}词
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {formatTime(record.timeSpent)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(record.completedAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm mr-4"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">暂无写作记录</h3>
          <p className="text-gray-600 mb-6">开始你的第一次写作吧!</p>
          <Link
            href="/writing/practice"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            开始写作
          </Link>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.title}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[selectedRecord.type]}`}>
                      {typeText[selectedRecord.type]}
                    </span>
                    <span className="text-gray-500">{selectedRecord.wordCount}词</span>
                    <span className="text-gray-500">{formatTime(selectedRecord.timeSpent)}</span>
                  </div>
                </div>
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
              {/* 分数 */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-indigo-600">{selectedRecord.score}</div>
                    <div className="text-gray-600">总分</div>
                  </div>
                  <div className="flex-1 mx-8 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">内容完整度</span>
                      <span className="font-bold">{selectedRecord.feedback?.contentScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">文章结构</span>
                      <span className="font-bold">{selectedRecord.feedback?.structureScore}/25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">语言表达</span>
                      <span className="font-bold">{selectedRecord.feedback?.languageScore}/30</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">语法准确性</span>
                      <span className="font-bold">{selectedRecord.feedback?.grammarScore}/20</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 作文内容 */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">作文内容</h3>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedRecord.content}
                </div>
              </div>

              {/* 改进建议 */}
              {selectedRecord.feedback && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">改进建议</h3>
                  <ul className="space-y-2">
                    {selectedRecord.feedback.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start text-gray-700">
                        <span className="text-yellow-500 mr-2">→</span>
                        {s}
                      </li>
                    ))}
                  </ul>
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
                href="/writing/practice"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                继续练习
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
