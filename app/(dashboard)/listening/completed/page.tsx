'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PracticeResult {
  practiceId?: string;
  title: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
}

interface TestResult {
  testId: string;
  title: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number; // 秒
  completedAt: string;
}

type ResultType = 'practice' | 'test';

interface ListeningPractice {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  accent: 'AMERICAN' | 'BRITISH' | 'AUSTRALIAN' | 'OTHER';
  category: 'CONVERSATION' | 'NEWS' | 'LECTURE' | 'INTERVIEW' | 'STORY';
  points: number;
  completed?: boolean;
  score?: number;
  completedAt?: string;
}

// 模拟听力练习数据
const mockListeningPractices: ListeningPractice[] = [
  {
    id: '1',
    title: '机场对话',
    description: '旅客与工作人员的日常对话',
    duration: 120,
    difficulty: 'BEGINNER',
    accent: 'AMERICAN',
    category: 'CONVERSATION',
    points: 10,
    completed: false,
  },
  {
    id: '2',
    title: '科技新闻',
    description: '关于人工智能发展的新闻报道',
    duration: 180,
    difficulty: 'INTERMEDIATE',
    accent: 'BRITISH',
    category: 'NEWS',
    points: 15,
    completed: false,
  },
  {
    id: '3',
    title: '大学讲座',
    description: '环境科学课堂讲座片段',
    duration: 300,
    difficulty: 'ADVANCED',
    accent: 'AMERICAN',
    category: 'LECTURE',
    points: 20,
    completed: false,
  },
  {
    id: '4',
    title: '名人采访',
    description: '知名演员的访谈节目',
    duration: 240,
    difficulty: 'INTERMEDIATE',
    accent: 'AUSTRALIAN',
    category: 'INTERVIEW',
    points: 15,
    completed: false,
  },
  {
    id: '5',
    title: '短篇故事',
    description: '经典英文短篇故事朗读',
    duration: 150,
    difficulty: 'BEGINNER',
    accent: 'BRITISH',
    category: 'STORY',
    points: 10,
    completed: false,
  },
  {
    id: '6',
    title: '商务会议',
    description: '公司项目讨论会议记录',
    duration: 200,
    difficulty: 'INTERMEDIATE',
    accent: 'AMERICAN',
    category: 'CONVERSATION',
    points: 15,
    completed: false,
  },
  {
    id: '7',
    title: '天气预报',
    description: '多城市天气预报播报',
    duration: 90,
    difficulty: 'BEGINNER',
    accent: 'BRITISH',
    category: 'NEWS',
    points: 8,
    completed: false,
  },
  {
    id: '8',
    title: '学术演讲',
    description: 'TED演讲片段',
    duration: 240,
    difficulty: 'ADVANCED',
    accent: 'AMERICAN',
    category: 'LECTURE',
    points: 20,
    completed: false,
  },
];

// 获取下一个推荐练习
const getNextRecommendedPractice = (currentPracticeId?: string): ListeningPractice | null => {
  if (!currentPracticeId) {
    // 如果没有当前练习ID，返回第一个未完成的练习
    return mockListeningPractices.find(p => !p.completed) || mockListeningPractices[0];
  }

  // 查找当前练习的索引
  const currentIndex = mockListeningPractices.findIndex(p => p.id === currentPracticeId);
  if (currentIndex === -1) {
    // 如果找不到当前练习，返回第一个未完成的练习
    return mockListeningPractices.find(p => !p.completed) || mockListeningPractices[0];
  }

  // 查找下一个未完成的练习
  for (let i = currentIndex + 1; i < mockListeningPractices.length; i++) {
    if (!mockListeningPractices[i].completed) {
      return mockListeningPractices[i];
    }
  }

  // 如果后面没有未完成的练习，从头开始查找
  for (let i = 0; i < currentIndex; i++) {
    if (!mockListeningPractices[i].completed) {
      return mockListeningPractices[i];
    }
  }

  // 所有练习都已完成
  return null;
};

export default function ListeningCompletedPage() {
  const router = useRouter();
  const [result, setResult] = useState<PracticeResult | TestResult | null>(null);
  const [resultType, setResultType] = useState<ResultType>('practice');
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [nextPractice, setNextPractice] = useState<ListeningPractice | null>(null);

  // 辅助函数
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const accentColors: Record<string, string> = {
    AMERICAN: 'bg-red-100 text-red-800',
    BRITISH: 'bg-blue-100 text-blue-800',
    AUSTRALIAN: 'bg-yellow-100 text-yellow-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  const accentText: Record<string, string> = {
    AMERICAN: '美音',
    BRITISH: '英音',
    AUSTRALIAN: '澳音',
    OTHER: '其他',
  };

  const categoryColors: Record<string, string> = {
    CONVERSATION: 'bg-indigo-100 text-indigo-800',
    NEWS: 'bg-green-100 text-green-800',
    LECTURE: 'bg-purple-100 text-purple-800',
    INTERVIEW: 'bg-pink-100 text-pink-800',
    STORY: 'bg-yellow-100 text-yellow-800',
  };

  const categoryText: Record<string, string> = {
    CONVERSATION: '对话',
    NEWS: '新闻',
    LECTURE: '讲座',
    INTERVIEW: '采访',
    STORY: '故事',
  };

  useEffect(() => {
    // 从本地存储加载最新结果
    const practiceResult = localStorage.getItem('latestListeningResult');
    const testResult = localStorage.getItem('latestListeningTestResult');

    if (testResult) {
      // 优先显示测试结果
      const parsedResult: TestResult = JSON.parse(testResult);
      setResult(parsedResult);
      setResultType('test');
      generateTestAnalysis(parsedResult);
      // 对于测试，推荐第一个未完成的练习
      const nextPractice = getNextRecommendedPractice();
      setNextPractice(nextPractice);
    } else if (practiceResult) {
      const parsedResult: PracticeResult = JSON.parse(practiceResult);
      setResult(parsedResult);
      setResultType('practice');
      generatePracticeAnalysis(parsedResult);
      // 获取下一个推荐练习
      const nextPractice = getNextRecommendedPractice(parsedResult.practiceId);
      setNextPractice(nextPractice);
    } else {
      // 没有结果，返回主页面
      router.push('/listening');
    }

    setIsLoading(false);
  }, [router]);

  const generatePracticeAnalysis = (result: PracticeResult) => {
    const newAnalysis: string[] = [];
    const newRecommendations: string[] = [];

    // 根据分数生成分析
    if (result.score >= 90) {
      newAnalysis.push('听力理解能力优秀，能够准确捕捉音频中的关键信息。');
      newAnalysis.push('对日常对话场景理解透彻，反应迅速。');
      newRecommendations.push('可以挑战更高难度的听力材料，如新闻或讲座。');
      newRecommendations.push('尝试增加听力材料的长度和复杂度。');
    } else if (result.score >= 70) {
      newAnalysis.push('听力理解能力良好，基本能够理解音频主要内容。');
      newAnalysis.push('在部分细节理解上还有提升空间。');
      newRecommendations.push('建议多练习同一难度的材料，巩固理解能力。');
      newRecommendations.push('注意听力过程中的关键词捕捉。');
    } else if (result.score >= 50) {
      newAnalysis.push('听力理解能力一般，需要加强训练。');
      newAnalysis.push('对某些表达方式或口音可能不够熟悉。');
      newRecommendations.push('建议从慢速听力材料开始，逐步提高语速。');
      newRecommendations.push('反复听同一材料直到完全理解。');
    } else {
      newAnalysis.push('听力理解能力有待提高，需要系统训练。');
      newAnalysis.push('可能对基本词汇和表达不够熟悉。');
      newRecommendations.push('建议从最简单的听力材料开始。');
      newRecommendations.push('结合文本对照练习，提高词汇量。');
    }

    setAnalysis(newAnalysis);
    setRecommendations(newRecommendations);
  };

  const generateTestAnalysis = (result: TestResult) => {
    const newAnalysis: string[] = [];
    const newRecommendations: string[] = [];

    // 测试结果分析
    newAnalysis.push(`你在${result.title}中获得了${result.score}分。`);
    newAnalysis.push(`答对了${result.correctCount}题，共${result.totalQuestions}题。`);
    newAnalysis.push(`用时${Math.floor(result.timeSpent / 60)}分${result.timeSpent % 60}秒。`);

    if (result.passed) {
      newAnalysis.push('恭喜你通过了本次听力测试！');
      newRecommendations.push('继续保持定期听力训练，巩固现有水平。');
      newRecommendations.push('可以尝试更高难度的综合听力测试。');
    } else {
      newAnalysis.push('很遗憾，本次测试未达到及格标准。');
      newRecommendations.push('建议加强日常听力训练，特别是薄弱环节。');
      newRecommendations.push('从基础听力材料开始，逐步提高难度。');
    }

    // 根据各部分表现给出建议
    if (result.score >= 80) {
      newAnalysis.push('整体表现优秀，听力理解能力较强。');
    } else if (result.score >= 60) {
      newAnalysis.push('整体表现良好，部分内容需要加强。');
    } else {
      newAnalysis.push('需要系统性地提高听力能力。');
    }

    setAnalysis(newAnalysis);
    setRecommendations(newRecommendations);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    if (score >= 50) return 'bg-gradient-to-r from-orange-500 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载结果中...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到结果</h2>
        <p className="text-gray-600 mb-8">请先完成一个听力练习或测试。</p>
        <Link
          href="/listening"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回听力训练
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 结果标题 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.title}
              <span className="ml-4 text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                {resultType === 'test' ? '测试结果' : '练习结果'}
              </span>
            </h1>
            <p className="text-gray-600">
              完成于 {formatDate(result.completedAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/listening"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              ← 返回听力训练
            </Link>
          </div>
        </div>

        {/* 主要分数展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="col-span-2">
            <div className={`${getScoreBadge(result.score)} text-white p-8 rounded-2xl`}>
              <div className="text-center">
                <div className="text-sm opacity-90 mb-2">总分</div>
                <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
                <div className="text-xl mt-2 opacity-90">/ 100</div>
                <div className="mt-4 text-lg font-medium">
                  {resultType === 'test' && (result as TestResult).passed ? '✅ 通过' : '📊 得分'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">正确题数</div>
                <div className="text-3xl font-bold text-gray-900">
                  {result.correctCount}/{result.totalQuestions}
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(result.correctCount / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {resultType === 'test' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">用时</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor((result as TestResult).timeSpent / 60)}:{((result as TestResult).timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">分钟:秒</div>
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">完成状态</div>
                <div className={`px-4 py-2 rounded-full font-medium ${
                  resultType === 'test' && (result as TestResult).passed
                    ? 'bg-green-100 text-green-800'
                    : resultType === 'test'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {resultType === 'test'
                    ? (result as TestResult).passed ? '通过' : '未通过'
                    : '练习完成'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">详细数据</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📊 准确率分析</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">整体准确率</span>
                    <span className="font-medium">{Math.round((result.correctCount / result.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(result.correctCount / result.totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">得分率</span>
                    <span className="font-medium">{result.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 表现评估</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">表现等级</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    result.score >= 90 ? 'bg-green-100 text-green-800' :
                    result.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    result.score >= 50 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.score >= 90 ? '优秀' :
                     result.score >= 70 ? '良好' :
                     result.score >= 50 ? '一般' : '需提高'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">完成时间</span>
                  <span className="font-medium">
                    {resultType === 'test'
                      ? `${Math.floor((result as TestResult).timeSpent / 60)}分${(result as TestResult).timeSpent % 60}秒`
                      : '未记录'
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">测试类型</span>
                  <span className="font-medium">
                    {resultType === 'test' ? '综合测试' : '专项练习'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 智能分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 智能分析</h2>
            <div className="space-y-4">
              {analysis.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 学习建议</h2>
            <div className="space-y-4">
              {recommendations.map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">→</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 学习计划 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 下一步学习计划</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextPractice ? (
              <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">继续学习</h3>
                <div className="mb-4">
                  <div className="font-medium text-gray-900 mb-1">{nextPractice.title}</div>
                  <div className="text-sm text-gray-600 mb-2">{nextPractice.description}</div>
                  <div className="flex flex-wrap justify-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[nextPractice.difficulty]}`}>
                      {difficultyText[nextPractice.difficulty]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${accentColors[nextPractice.accent]}`}>
                      {accentText[nextPractice.accent]}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[nextPractice.category]}`}>
                      {categoryText[nextPractice.category]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    ⏱️ {formatDuration(nextPractice.duration)} · ⭐ {nextPractice.points} 积分
                  </div>
                </div>
                <Link
                  href={`/listening/practice?next=${nextPractice.id}`}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium text-sm"
                >
                  开始下一个练习 →
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">每日听力</h3>
                <p className="text-gray-600 mb-4">
                  每天坚持听力练习20-30分钟
                </p>
                <Link
                  href="/listening/practice"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  开始练习
                </Link>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">扩展资源</h3>
              <p className="text-gray-600 mb-4">
                尝试不同难度和类型的听力材料
              </p>
              <Link
                href="/listening"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                浏览资源
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">定期测试</h3>
              <p className="text-gray-600 mb-4">
                每周进行一次听力水平测试
              </p>
              <Link
                href="/listening/test"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                开始测试
              </Link>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t border-gray-200">
          <button
            onClick={() => {
              if (resultType === 'test') {
                localStorage.removeItem('latestListeningTestResult');
              } else {
                localStorage.removeItem('latestListeningResult');
              }
              router.push('/listening');
            }}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            返回听力训练
          </button>

          <button
            onClick={() => {
              if (resultType === 'test') {
                router.push('/listening/test');
              } else {
                router.push('/listening/practice');
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            再试一次
          </button>

          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg hover:opacity-90 font-medium text-center"
          >
            返回仪表板
          </Link>
        </div>
      </div>

      {/* 鼓励话语 */}
      <div className="text-center mt-8 pt-8 border-t border-gray-200">
        <p className="text-gray-600 italic">
          "听力能力的提高需要时间和坚持。每天进步一点点，积累起来就是巨大的飞跃。"
        </p>
      </div>
    </div>
  );
}