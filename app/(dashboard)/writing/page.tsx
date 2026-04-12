'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

interface WritingStats {
  totalEssays: number;
  completedEssays: number;
  averageScore: number;
  averageWords: number;
  totalWords: number;
  topicsCovered: number;
  byType: {
    NARRATIVE: number;
    EXPOSITORY: number;
    ARGUMENTATIVE: number;
    PRACTICAL: number;
  };
}

interface RecentEssay {
  id: string;
  title: string;
  type: string;
  score: number;
  wordCount: number;
  feedback: string;
  completedAt: string;
}

interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  type: 'NARRATIVE' | 'EXPOSITORY' | 'ARGUMENTATIVE' | 'PRACTICAL';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  wordRequirement: string;
  tips: string[];
}

export default function WritingPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<WritingStats>({
    totalEssays: 50,
    completedEssays: 15,
    averageScore: 78,
    averageWords: 280,
    totalWords: 4200,
    topicsCovered: 12,
    byType: {
      NARRATIVE: 5,
      EXPOSITORY: 4,
      ARGUMENTATIVE: 3,
      PRACTICAL: 3,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentEssays, setRecentEssays] = useState<RecentEssay[]>([]);
  const [recommendedPrompts, setRecommendedPrompts] = useState<WritingPrompt[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setRecentEssays([
            {
              id: '1',
              title: 'My Favorite Holiday',
              type: 'NARRATIVE',
              score: 85,
              wordCount: 250,
              feedback: 'Excellent narrative structure with vivid details.',
              completedAt: '2024-04-09T10:30:00',
            },
            {
              id: '2',
              title: 'The Importance of Reading',
              type: 'EXPOSITORY',
              score: 78,
              wordCount: 320,
              feedback: 'Good organization, consider adding more examples.',
              completedAt: '2024-04-08T14:20:00',
            },
            {
              id: '3',
              title: 'Should Students Wear Uniforms?',
              type: 'ARGUMENTATIVE',
              score: 82,
              wordCount: 350,
              feedback: 'Strong arguments on both sides, well-supported.',
              completedAt: '2024-04-07T16:45:00',
            },
          ]);

          setRecommendedPrompts([
            {
              id: 'narrative-1',
              title: 'A Memorable Trip',
              description: 'Write about a memorable trip you have taken.',
              type: 'NARRATIVE',
              difficulty: 'BEGINNER',
              wordRequirement: '150-200 words',
              tips: ['Use past tense', 'Include sensory details', 'Describe emotions'],
            },
            {
              id: 'expository-1',
              title: 'How to Stay Healthy',
              description: 'Explain the best ways to maintain good health.',
              type: 'EXPOSITORY',
              difficulty: 'INTERMEDIATE',
              wordRequirement: '200-300 words',
              tips: ['Use logical order', 'Provide specific tips', 'Include reasons'],
            },
            {
              id: 'argumentative-1',
              title: 'Technology in Education',
              description: 'Discuss the role of technology in modern education.',
              type: 'ARGUMENTATIVE',
              difficulty: 'ADVANCED',
              wordRequirement: '300-400 words',
              tips: ['Present clear stance', 'Support with evidence', 'Address counterarguments'],
            },
          ]);

          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('获取写作数据错误:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const typeColors: Record<string, string> = {
    NARRATIVE: 'bg-purple-100 text-purple-800',
    EXPOSITORY: 'bg-blue-100 text-blue-800',
    ARGUMENTATIVE: 'bg-red-100 text-red-800',
    PRACTICAL: 'bg-green-100 text-green-800',
  };

  const typeText: Record<string, string> = {
    NARRATIVE: '记叙文',
    EXPOSITORY: '说明文',
    ARGUMENTATIVE: '议论文',
    PRACTICAL: '应用文',
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-blue-100 text-blue-800',
    ADVANCED: 'bg-purple-100 text-purple-800',
  };

  const difficultyText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载写作数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">写作训练</h1>
        <p className="text-gray-600 mt-2">
          提高你的英语写作能力，获得AI智能批改反馈
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已完成作文</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedEssays}</p>
              <p className="text-sm text-gray-600 mt-1">共{stats.totalEssays}篇</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>完成率</span>
              <span>{Math.round((stats.completedEssays / stats.totalEssays) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${(stats.completedEssays / stats.totalEssays) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均分数</p>
              <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>{stats.averageScore}</p>
              <p className="text-sm text-gray-600 mt-1">满分100分</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>写作水平</span>
              <span className="font-medium">
                {stats.averageScore >= 85 ? '优秀' : stats.averageScore >= 70 ? '良好' : '一般'}
              </span>
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
              <p className="text-sm text-gray-600">平均词数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageWords}</p>
              <p className="text-sm text-gray-600 mt-1">词/篇</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>总写作词数</span>
              <span>{stats.totalWords.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${Math.min((stats.totalWords / 10000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已覆盖话题</p>
              <p className="text-3xl font-bold text-gray-900">{stats.topicsCovered}</p>
              <p className="text-sm text-gray-600 mt-1">个话题</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>作文类型分布</span>
            </div>
            <div className="flex space-x-1 mt-2">
              <div className="h-6 bg-purple-500 flex-1 rounded-l" title={`记叙文: ${stats.byType.NARRATIVE}`}></div>
              <div className="h-6 bg-blue-500 flex-1" title={`说明文: ${stats.byType.EXPOSITORY}`}></div>
              <div className="h-6 bg-red-500 flex-1" title={`议论文: ${stats.byType.ARGUMENTATIVE}`}></div>
              <div className="h-6 bg-green-500 flex-1 rounded-r" title={`应用文: ${stats.byType.PRACTICAL}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">开始写作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/writing/practice"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✍️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">自由写作</h3>
            <p className="text-gray-600 mb-6">
              选择话题开始写作练习
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始写作
            </div>
          </Link>

          <Link
            href="/writing/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">写作测试</h3>
            <p className="text-gray-600 mb-6">
              在限定时间内完成写作任务
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>

          <Link
            href="/writing/resources"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">写作素材</h3>
            <p className="text-gray-600 mb-6">
              浏览优秀范文和写作技巧
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              浏览素材
            </div>
          </Link>

          <Link
            href="/writing/history"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">写作历史</h3>
            <p className="text-gray-600 mb-6">
              查看你的写作记录和进步
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium">
              查看历史
            </div>
          </Link>
        </div>
      </div>

      {/* 推荐写作话题 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">推荐写作话题</h2>
          <Link
            href="/writing/all"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部话题
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{prompt.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{prompt.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[prompt.type]}`}>
                  {typeText[prompt.type]}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[prompt.difficulty]}`}>
                  {difficultyText[prompt.difficulty]}
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                要求: {prompt.wordRequirement}
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">写作提示:</div>
                <div className="flex flex-wrap gap-1">
                  {prompt.tips.map((tip, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/writing/practice?prompt=${prompt.id}`}
                className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                开始写作
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 最近写作 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近写作</h2>
          <Link
            href="/writing/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">标题</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">类型</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">分数</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">词数</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">时间</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentEssays.map((essay) => (
                <tr key={essay.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900">{essay.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{essay.feedback}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[essay.type]}`}>
                      {typeText[essay.type]}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-lg font-bold ${getScoreColor(essay.score)}`}>
                      {essay.score}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {essay.wordCount}词
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {new Date(essay.completedAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/writing/history?id=${essay.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      查看详情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">写作学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">每天坚持写作练习，哪怕只是几句话</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">注意文章结构：开头、主体、结尾</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">使用多样化的句型和词汇</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">完成后检查语法和拼写错误</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">参考优秀范文，学习写作技巧</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI批改特点</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✨</span>
              <span className="text-gray-700">语法错误检测与纠正建议</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✨</span>
              <span className="text-gray-700">句子结构优化建议</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✨</span>
              <span className="text-gray-700">词汇使用评估与替换建议</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✨</span>
              <span className="text-gray-700">文章连贯性和逻辑性评价</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">✨</span>
              <span className="text-gray-700">个性化改进建议</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
