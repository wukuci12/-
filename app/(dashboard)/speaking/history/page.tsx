'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SpeakingRecord {
  id: string;
  topic: string;
  type: string;
  score: number;
  duration: number;
  feedback: string;
  pronunciation: number;
  fluency: number;
  vocabulary: number;
  grammar: number;
  completedAt: string;
}

const mockHistory: SpeakingRecord[] = [
  {
    id: 'rec-1',
    topic: 'Daily Routines',
    type: 'DIALOGUE',
    score: 85,
    duration: 180,
    feedback: 'Excellent pronunciation and natural conversation flow.',
    pronunciation: 88,
    fluency: 82,
    vocabulary: 85,
    grammar: 84,
    completedAt: '2024-04-09T10:30:00',
  },
  {
    id: 'rec-2',
    topic: 'My Hobbies',
    type: 'MONOLOGUE',
    score: 78,
    duration: 120,
    feedback: 'Good vocabulary usage, consider improving fluency.',
    pronunciation: 80,
    fluency: 72,
    vocabulary: 82,
    grammar: 78,
    completedAt: '2024-04-08T14:20:00',
  },
  {
    id: 'rec-3',
    topic: 'Environmental Protection',
    type: 'DISCUSSION',
    score: 82,
    duration: 240,
    feedback: 'Strong arguments and good sentence structures.',
    pronunciation: 85,
    fluency: 80,
    vocabulary: 84,
    grammar: 80,
    completedAt: '2024-04-07T16:45:00',
  },
  {
    id: 'rec-4',
    topic: 'At the Restaurant',
    type: 'DIALOGUE',
    score: 88,
    duration: 200,
    feedback: 'Very natural dialogue, professional vocabulary.',
    pronunciation: 90,
    fluency: 86,
    vocabulary: 90,
    grammar: 86,
    completedAt: '2024-04-06T09:15:00',
  },
];

export default function SpeakingHistoryPage() {
  const [records, setRecords] = useState<SpeakingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<SpeakingRecord | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    setTimeout(() => {
      setRecords(mockHistory);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredRecords = records.filter((record) => {
    if (filterType !== 'all' && record.type !== filterType) return false;
    return true;
  });

  const typeText: Record<string, string> = {
    DIALOGUE: '对话练习',
    MONOLOGUE: '独白练习',
    DISCUSSION: '话题讨论',
  };

  const typeColors: Record<string, string> = {
    DIALOGUE: 'bg-blue-100 text-blue-800',
    MONOLOGUE: 'bg-purple-100 text-purple-800',
    DISCUSSION: 'bg-green-100 text-green-800',
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  // 统计数据
  const totalSessions = records.length;
  const averageScore = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length)
    : 0;
  const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0);

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
        <h1 className="text-3xl font-bold text-gray-900">口语历史</h1>
        <p className="text-gray-600 mt-2">
          查看你的口语练习记录和能力进步
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">练习总数</p>
              <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
              <p className="text-sm text-gray-600 mt-1">次</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎤</span>
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
              <p className="text-sm text-gray-600">总练习时长</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(totalMinutes / 60)}</p>
              <p className="text-sm text-gray-600 mt-1">小时{Math.floor((totalMinutes % 3600) / 60)}分钟</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>
      </div>

      {/* 能力雷达 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">能力分布</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['pronunciation', 'fluency', 'vocabulary', 'grammar'].map((skill) => {
            const avgScore = records.length > 0
              ? Math.round(records.reduce((sum, r) => sum + (r as any)[skill], 0) / records.length)
              : 0;
            return (
              <div key={skill} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="#3b82f6"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${avgScore * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{avgScore}%</span>
                  </div>
                </div>
                <div className="font-medium text-gray-900 capitalize">
                  {skill === 'pronunciation' ? '发音' :
                   skill === 'fluency' ? '流利度' :
                   skill === 'vocabulary' ? '词汇' : '语法'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">所有类型</option>
            <option value="DIALOGUE">对话练习</option>
            <option value="MONOLOGUE">独白练习</option>
            <option value="DISCUSSION">话题讨论</option>
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            共 {filteredRecords.length} 条记录
          </div>
        </div>
      </div>

      {/* 历史记录 */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">话题</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">类型</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">总分</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">发音</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">流利度</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">时长</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">时间</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-bold text-gray-900">{record.topic}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[record.type]}`}>
                      {typeText[record.type]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-lg font-bold ${getScoreColor(record.score)}`}>
                      {record.score}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{record.pronunciation}%</td>
                  <td className="py-4 px-6 text-gray-600">{record.fluency}%</td>
                  <td className="py-4 px-6 text-gray-600">{formatDuration(record.duration)}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {new Date(record.completedAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
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
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">暂无练习记录</h3>
          <p className="text-gray-600 mb-6">开始你的第一次口语练习吧!</p>
          <Link
            href="/speaking/practice"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            开始练习
          </Link>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecord.topic}</h2>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[selectedRecord.type]}`}>
                  {typeText[selectedRecord.type]}
                </span>
                <span className="text-gray-500">{formatDuration(selectedRecord.duration)}</span>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-indigo-600">{selectedRecord.score}</div>
                <div className="text-gray-600">总分</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedRecord.pronunciation}%</div>
                  <div className="text-sm text-gray-600">发音</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedRecord.fluency}%</div>
                  <div className="text-sm text-gray-600">流利度</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedRecord.vocabulary}%</div>
                  <div className="text-sm text-gray-600">词汇</div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{selectedRecord.grammar}%</div>
                  <div className="text-sm text-gray-600">语法</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-2">AI评价</h3>
                <p className="text-gray-700">{selectedRecord.feedback}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
