'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ListeningHistoryItem {
  id: string;
  title: string;
  type: 'PRACTICE' | 'TEST';
  score: number;
  totalQuestions: number;
  correctCount: number;
  duration: number; // 秒
  completedAt: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  category: string;
  pointsEarned: number;
}

export default function ListeningHistoryPage() {
  const [history, setHistory] = useState<ListeningHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ListeningHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('ALL');
  const [stats, setStats] = useState({
    totalItems: 0,
    averageScore: 0,
    totalPoints: 0,
    totalTime: 0,
  });

  // 模拟历史数据
  useEffect(() => {
    setTimeout(() => {
      const mockHistory: ListeningHistoryItem[] = [
        {
          id: '1',
          title: '机场日常对话练习',
          type: 'PRACTICE',
          score: 85,
          totalQuestions: 5,
          correctCount: 4,
          duration: 540, // 9分钟
          completedAt: '2024-04-10T10:30:00',
          difficulty: 'BEGINNER',
          category: 'CONVERSATION',
          pointsEarned: 10
        },
        {
          id: '2',
          title: '科技新闻听力测试',
          type: 'TEST',
          score: 78,
          totalQuestions: 10,
          correctCount: 8,
          duration: 1200, // 20分钟
          completedAt: '2024-04-09T15:45:00',
          difficulty: 'INTERMEDIATE',
          category: 'NEWS',
          pointsEarned: 25
        },
        {
          id: '3',
          title: '大学讲座听力练习',
          type: 'PRACTICE',
          score: 92,
          totalQuestions: 8,
          correctCount: 7,
          duration: 900, // 15分钟
          completedAt: '2024-04-08T14:20:00',
          difficulty: 'ADVANCED',
          category: 'LECTURE',
          pointsEarned: 20
        },
        {
          id: '4',
          title: '名人访谈练习',
          type: 'PRACTICE',
          score: 95,
          totalQuestions: 6,
          correctCount: 6,
          duration: 480, // 8分钟
          completedAt: '2024-04-07T11:15:00',
          difficulty: 'INTERMEDIATE',
          category: 'INTERVIEW',
          pointsEarned: 15
        },
        {
          id: '5',
          title: '高中英语听力综合测试',
          type: 'TEST',
          score: 82,
          totalQuestions: 15,
          correctCount: 12,
          duration: 2700, // 45分钟
          completedAt: '2024-04-06T09:30:00',
          difficulty: 'INTERMEDIATE',
          category: 'COMPREHENSIVE',
          pointsEarned: 50
        },
        {
          id: '6',
          title: '短篇故事听力练习',
          type: 'PRACTICE',
          score: 88,
          totalQuestions: 5,
          correctCount: 4,
          duration: 420, // 7分钟
          completedAt: '2024-04-05T16:40:00',
          difficulty: 'BEGINNER',
          category: 'STORY',
          pointsEarned: 10
        },
        {
          id: '7',
          title: '商务会议听力测试',
          type: 'TEST',
          score: 75,
          totalQuestions: 12,
          correctCount: 9,
          duration: 1800, // 30分钟
          completedAt: '2024-04-04T13:25:00',
          difficulty: 'ADVANCED',
          category: 'BUSINESS',
          pointsEarned: 30
        },
        {
          id: '8',
          title: '天气预报听力练习',
          type: 'PRACTICE',
          score: 90,
          totalQuestions: 4,
          correctCount: 4,
          duration: 360, // 6分钟
          completedAt: '2024-04-03T10:10:00',
          difficulty: 'BEGINNER',
          category: 'NEWS',
          pointsEarned: 8
        },
        {
          id: '9',
          title: '学术英语听力测试',
          type: 'TEST',
          score: 68,
          totalQuestions: 10,
          correctCount: 7,
          duration: 1500, // 25分钟
          completedAt: '2024-04-02T15:55:00',
          difficulty: 'EXPERT',
          category: 'ACADEMIC',
          pointsEarned: 20
        },
        {
          id: '10',
          title: '餐厅点餐对话练习',
          type: 'PRACTICE',
          score: 96,
          totalQuestions: 5,
          correctCount: 5,
          duration: 300, // 5分钟
          completedAt: '2024-04-01T12:05:00',
          difficulty: 'BEGINNER',
          category: 'CONVERSATION',
          pointsEarned: 10
        },
        {
          id: '11',
          title: '历史纪录片听力练习',
          type: 'PRACTICE',
          score: 84,
          totalQuestions: 7,
          correctCount: 6,
          duration: 600, // 10分钟
          completedAt: '2024-03-31T14:35:00',
          difficulty: 'ADVANCED',
          category: 'LECTURE',
          pointsEarned: 16
        },
        {
          id: '12',
          title: '体育新闻听力测试',
          type: 'TEST',
          score: 79,
          totalQuestions: 8,
          correctCount: 6,
          duration: 960, // 16分钟
          completedAt: '2024-03-30T17:20:00',
          difficulty: 'INTERMEDIATE',
          category: 'NEWS',
          pointsEarned: 24
        },
        {
          id: '13',
          title: '旅行问路对话练习',
          type: 'PRACTICE',
          score: 91,
          totalQuestions: 5,
          correctCount: 5,
          duration: 330, // 5.5分钟
          completedAt: '2024-03-29T11:45:00',
          difficulty: 'BEGINNER',
          category: 'CONVERSATION',
          pointsEarned: 10
        },
        {
          id: '14',
          title: '经济分析听力测试',
          type: 'TEST',
          score: 73,
          totalQuestions: 10,
          correctCount: 7,
          duration: 1320, // 22分钟
          completedAt: '2024-03-28T16:10:00',
          difficulty: 'ADVANCED',
          category: 'NEWS',
          pointsEarned: 28
        },
        {
          id: '15',
          title: '医患对话练习',
          type: 'PRACTICE',
          score: 87,
          totalQuestions: 6,
          correctCount: 5,
          duration: 450, // 7.5分钟
          completedAt: '2024-03-27T10:25:00',
          difficulty: 'INTERMEDIATE',
          category: 'CONVERSATION',
          pointsEarned: 12
        }
      ];

      setHistory(mockHistory);
      setFilteredHistory(mockHistory);

      // 计算统计数据
      const totalItems = mockHistory.length;
      const averageScore = Math.round(mockHistory.reduce((sum, item) => sum + item.score, 0) / totalItems);
      const totalPoints = mockHistory.reduce((sum, item) => sum + item.pointsEarned, 0);
      const totalTime = Math.round(mockHistory.reduce((sum, item) => sum + item.duration, 0) / 60); // 转换为分钟

      setStats({
        totalItems,
        averageScore,
        totalPoints,
        totalTime
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = [...history];

    // 类型筛选
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // 难度筛选
    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }

    // 时间范围筛选
    if (selectedTimeRange !== 'ALL') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (selectedTimeRange) {
        case 'WEEK':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'MONTH':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'THREE_MONTHS':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(item => new Date(item.completedAt) >= cutoffDate);
    }

    setFilteredHistory(filtered);
  }, [history, selectedType, selectedDifficulty, selectedTimeRange]);

  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
    EXPERT: 'bg-red-100 text-red-800',
  };

  const difficultyText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
    EXPERT: '专家',
  };

  const typeColors: Record<string, string> = {
    PRACTICE: 'bg-blue-100 text-blue-800',
    TEST: 'bg-purple-100 text-purple-800',
  };

  const typeText: Record<string, string> = {
    PRACTICE: '练习',
    TEST: '测试',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    if (score >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateProgress = () => {
    const daysActive = 30; // 假设用户活跃30天
    const targetPerDay = 2; // 每天目标完成2个练习
    const targetTotal = daysActive * targetPerDay;
    const completionRate = Math.min((stats.totalItems / targetTotal) * 100, 100);

    return {
      daysActive,
      targetPerDay,
      targetTotal,
      completionRate
    };
  };

  const progress = calculateProgress();

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
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">听力学习历史</h1>
        <p className="text-gray-600 mt-2">
          查看所有听力练习和测试的完成记录，跟踪学习进度和进步情况
        </p>
      </div>

      {/* 统计数据 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总完成数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
              <p className="text-sm text-gray-600 mt-1">{progress.completionRate.toFixed(1)}% 完成目标</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>进度</span>
              <span>{stats.totalItems}/{progress.targetTotal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${progress.completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均分数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
              <p className="text-sm text-gray-600 mt-1">满分100分</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>最高分</span>
              <span>{Math.max(...history.map(h => h.score))}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${stats.averageScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总积分</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600 mt-1">累计获得</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>今日积分</span>
              <span>15</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总学习时间</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTime}</p>
              <p className="text-sm text-gray-600 mt-1">分钟</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>平均时长</span>
              <span>{Math.round(stats.totalTime / stats.totalItems)}分钟</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              类型
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">全部类型</option>
              <option value="PRACTICE">练习</option>
              <option value="TEST">测试</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              难度
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="ALL">全部难度</option>
              {Object.entries(difficultyText).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              时间范围
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="ALL">全部时间</option>
              <option value="WEEK">最近一周</option>
              <option value="MONTH">最近一月</option>
              <option value="THREE_MONTHS">最近三月</option>
            </select>
          </div>
        </div>

        {/* 筛选结果统计 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700">
                找到 <span className="font-bold text-indigo-600">{filteredHistory.length}</span> 条记录
              </span>
              {(selectedType !== 'ALL' || selectedDifficulty !== 'ALL' || selectedTimeRange !== 'ALL') && (
                <button
                  onClick={() => {
                    setSelectedType('ALL');
                    setSelectedDifficulty('ALL');
                    setSelectedTimeRange('ALL');
                  }}
                  className="ml-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  清除筛选
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600">
              共 {history.length} 条历史记录
            </div>
          </div>
        </div>
      </div>

      {/* 历史记录列表 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left text-gray-700 font-bold">标题</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">类型</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">分数</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">正确题数</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">难度</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">时长</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">积分</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">完成时间</th>
                <th className="py-4 px-6 text-left text-gray-700 font-bold">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[item.type]}`}>
                      {typeText[item.type]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className={`text-xl font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </div>
                      <div className="text-sm text-gray-500 ml-2">/ 100</div>
                    </div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded-full ${getScoreBadge(item.score)}`}>
                      {item.score >= 90 ? '优秀' : item.score >= 70 ? '良好' : item.score >= 50 ? '一般' : '需提高'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{item.correctCount}/{item.totalQuestions}</div>
                    <div className="text-sm text-gray-500">
                      {Math.round((item.correctCount / item.totalQuestions) * 100)}% 正确率
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[item.difficulty]}`}>
                      {difficultyText[item.difficulty]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">⏱️</span>
                      <span className="font-medium">{formatDuration(item.duration)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⭐</span>
                      <span className="font-bold text-gray-900">{item.pointsEarned}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">{formatDate(item.completedAt)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <Link
                        href={`/listening/completed`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                      >
                        查看详情
                      </Link>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
                        重做
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 空状态 */}
        {filteredHistory.length === 0 && (
          <div className="text-center py-16">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">没有找到匹配的记录</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              尝试调整筛选条件，或者开始新的听力练习。
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setSelectedType('ALL');
                  setSelectedDifficulty('ALL');
                  setSelectedTimeRange('ALL');
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                显示所有记录
              </button>
              <Link
                href="/listening/practice"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                开始新练习
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 学习趋势分析 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 学习趋势分析</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">分数变化趋势</h3>
            <div className="space-y-4">
              {/* 模拟分数趋势图 */}
              <div className="flex items-end h-32 space-x-2">
                {history.slice(0, 8).reverse().map((item, idx) => (
                  <div key={item.id} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg"
                      style={{ height: `${item.score}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{idx + 1}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>最早</span>
                <span>最新</span>
              </div>
              <div className="text-center text-gray-700">
                平均分数从 {Math.min(...history.map(h => h.score))} 提升到 {Math.max(...history.map(h => h.score))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">难度分布</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">初级</span>
                  <span className="font-medium">
                    {history.filter(h => h.difficulty === 'BEGINNER').length} 次
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${(history.filter(h => h.difficulty === 'BEGINNER').length / history.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">中级</span>
                  <span className="font-medium">
                    {history.filter(h => h.difficulty === 'INTERMEDIATE').length} 次
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(history.filter(h => h.difficulty === 'INTERMEDIATE').length / history.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">高级</span>
                  <span className="font-medium">
                    {history.filter(h => h.difficulty === 'ADVANCED').length} 次
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{ width: `${(history.filter(h => h.difficulty === 'ADVANCED').length / history.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 导出和操作 */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200">
        <Link
          href="/listening"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium mb-4 sm:mb-0"
        >
          ← 返回听力训练
        </Link>

        <div className="flex space-x-4">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
            导出历史记录
          </button>
          <Link
            href="/listening/test"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            开始新测试
          </Link>
        </div>
      </div>
    </div>
  );
}