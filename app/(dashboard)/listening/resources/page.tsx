'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ListeningResource {
  id: string;
  title: string;
  description: string;
  duration: number; // 秒
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  accent: 'AMERICAN' | 'BRITISH' | 'AUSTRALIAN' | 'OTHER';
  category: 'CONVERSATION' | 'NEWS' | 'LECTURE' | 'INTERVIEW' | 'STORY' | 'BUSINESS' | 'ACADEMIC';
  points: number;
  completed?: boolean;
  score?: number;
  completedAt?: string;
  popularity: number; // 1-5
  tags: string[];
}

export default function ListeningResourcesPage() {
  const [resources, setResources] = useState<ListeningResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<ListeningResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedAccent, setSelectedAccent] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'POPULARITY' | 'DIFFICULTY' | 'DURATION' | 'POINTS'>('POPULARITY');

  // 模拟资源数据
  useEffect(() => {
    setTimeout(() => {
      const mockResources: ListeningResource[] = [
        {
          id: '1',
          title: '机场日常对话',
          description: '旅客与机场工作人员的日常交流，适合初学者',
          duration: 120,
          difficulty: 'BEGINNER',
          accent: 'AMERICAN',
          category: 'CONVERSATION',
          points: 10,
          completed: true,
          score: 85,
          completedAt: '2024-04-09',
          popularity: 5,
          tags: ['日常', '旅行', '基础']
        },
        {
          id: '2',
          title: '科技新闻简报',
          description: '最新科技发展新闻报道，中等语速',
          duration: 180,
          difficulty: 'INTERMEDIATE',
          accent: 'BRITISH',
          category: 'NEWS',
          points: 15,
          completed: true,
          score: 78,
          completedAt: '2024-04-08',
          popularity: 4,
          tags: ['科技', '新闻', '中等']
        },
        {
          id: '3',
          title: '大学环境科学讲座',
          description: '环境科学课堂讲座片段，学术英语',
          duration: 300,
          difficulty: 'ADVANCED',
          accent: 'AMERICAN',
          category: 'LECTURE',
          points: 20,
          completed: false,
          popularity: 4,
          tags: ['学术', '科学', '高级']
        },
        {
          id: '4',
          title: '名人深度访谈',
          description: '知名演员的深度访谈节目，自然语速',
          duration: 240,
          difficulty: 'INTERMEDIATE',
          accent: 'AUSTRALIAN',
          category: 'INTERVIEW',
          points: 15,
          completed: true,
          score: 92,
          completedAt: '2024-04-07',
          popularity: 5,
          tags: ['娱乐', '访谈', '文化']
        },
        {
          id: '5',
          title: '经典英文短篇故事',
          description: '经典英文短篇故事朗读，优美发音',
          duration: 150,
          difficulty: 'BEGINNER',
          accent: 'BRITISH',
          category: 'STORY',
          points: 10,
          completed: false,
          popularity: 4,
          tags: ['文学', '故事', '基础']
        },
        {
          id: '6',
          title: '商务会议记录',
          description: '公司项目讨论会议，商务英语',
          duration: 200,
          difficulty: 'INTERMEDIATE',
          accent: 'AMERICAN',
          category: 'BUSINESS',
          points: 15,
          completed: false,
          popularity: 3,
          tags: ['商务', '会议', '专业']
        },
        {
          id: '7',
          title: '多城市天气预报',
          description: '多城市天气预报播报，清晰发音',
          duration: 90,
          difficulty: 'BEGINNER',
          accent: 'BRITISH',
          category: 'NEWS',
          points: 8,
          completed: false,
          popularity: 3,
          tags: ['天气', '新闻', '基础']
        },
        {
          id: '8',
          title: 'TED演讲精选',
          description: 'TED演讲片段，激励性演讲',
          duration: 240,
          difficulty: 'ADVANCED',
          accent: 'AMERICAN',
          category: 'LECTURE',
          points: 20,
          completed: false,
          popularity: 5,
          tags: ['演讲', '教育', '高级']
        },
        {
          id: '9',
          title: '餐厅点餐对话',
          description: '顾客与服务员点餐对话，实用英语',
          duration: 100,
          difficulty: 'BEGINNER',
          accent: 'AMERICAN',
          category: 'CONVERSATION',
          points: 8,
          completed: true,
          score: 95,
          completedAt: '2024-04-06',
          popularity: 4,
          tags: ['餐饮', '日常', '实用']
        },
        {
          id: '10',
          title: '学术研究报告',
          description: '学术研究报告片段，专业术语',
          duration: 180,
          difficulty: 'EXPERT',
          accent: 'BRITISH',
          category: 'ACADEMIC',
          points: 25,
          completed: false,
          popularity: 3,
          tags: ['学术', '研究', '专家']
        },
        {
          id: '11',
          title: '旅行问路对话',
          description: '游客向当地人问路的对话',
          duration: 110,
          difficulty: 'BEGINNER',
          accent: 'AUSTRALIAN',
          category: 'CONVERSATION',
          points: 8,
          completed: false,
          popularity: 3,
          tags: ['旅行', '导航', '实用']
        },
        {
          id: '12',
          title: '经济新闻分析',
          description: '全球经济形势分析报道',
          duration: 220,
          difficulty: 'ADVANCED',
          accent: 'AMERICAN',
          category: 'NEWS',
          points: 18,
          completed: false,
          popularity: 4,
          tags: ['经济', '新闻', '分析']
        },
        {
          id: '13',
          title: '医生与患者对话',
          description: '医院场景中的医患对话',
          duration: 130,
          difficulty: 'INTERMEDIATE',
          accent: 'BRITISH',
          category: 'CONVERSATION',
          points: 12,
          completed: false,
          popularity: 3,
          tags: ['医疗', '专业', '实用']
        },
        {
          id: '14',
          title: '历史纪录片旁白',
          description: '历史纪录片解说片段',
          duration: 170,
          difficulty: 'ADVANCED',
          accent: 'AMERICAN',
          category: 'LECTURE',
          points: 16,
          completed: false,
          popularity: 4,
          tags: ['历史', '纪录片', '文化']
        },
        {
          id: '15',
          title: '职场面试模拟',
          description: '工作面试对话模拟',
          duration: 190,
          difficulty: 'INTERMEDIATE',
          accent: 'AMERICAN',
          category: 'INTERVIEW',
          points: 15,
          completed: false,
          popularity: 5,
          tags: ['职场', '面试', '专业']
        },
        {
          id: '16',
          title: '儿童英语故事',
          description: '适合儿童的英语故事朗读',
          duration: 140,
          difficulty: 'BEGINNER',
          accent: 'BRITISH',
          category: 'STORY',
          points: 8,
          completed: false,
          popularity: 3,
          tags: ['儿童', '故事', '基础']
        },
        {
          id: '17',
          title: '体育赛事报道',
          description: '足球比赛现场报道',
          duration: 160,
          difficulty: 'INTERMEDIATE',
          accent: 'AMERICAN',
          category: 'NEWS',
          points: 12,
          completed: false,
          popularity: 4,
          tags: ['体育', '新闻', '激情']
        },
        {
          id: '18',
          title: '学术论文讨论',
          description: '学术论文内容讨论',
          duration: 210,
          difficulty: 'EXPERT',
          accent: 'BRITISH',
          category: 'ACADEMIC',
          points: 22,
          completed: false,
          popularity: 3,
          tags: ['学术', '论文', '专家']
        },
        {
          id: '19',
          title: '酒店预订对话',
          description: '电话预订酒店房间对话',
          duration: 125,
          difficulty: 'BEGINNER',
          accent: 'AMERICAN',
          category: 'CONVERSATION',
          points: 10,
          completed: false,
          popularity: 4,
          tags: ['旅行', '酒店', '实用']
        },
        {
          id: '20',
          title: '科学播客片段',
          description: '科学主题播客精选片段',
          duration: 190,
          difficulty: 'ADVANCED',
          accent: 'AUSTRALIAN',
          category: 'LECTURE',
          points: 18,
          completed: false,
          popularity: 4,
          tags: ['科学', '播客', '教育']
        }
      ];

      setResources(mockResources);
      setFilteredResources(mockResources);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 筛选和排序逻辑
  useEffect(() => {
    let filtered = [...resources];

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 分类筛选
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // 难度筛选
    if (selectedDifficulty !== 'ALL') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    // 口音筛选
    if (selectedAccent !== 'ALL') {
      filtered = filtered.filter(resource => resource.accent === selectedAccent);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'POPULARITY':
          return b.popularity - a.popularity;
        case 'DIFFICULTY':
          const difficultyOrder = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2, EXPERT: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'DURATION':
          return a.duration - b.duration;
        case 'POINTS':
          return b.points - a.points;
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  }, [resources, searchQuery, selectedCategory, selectedDifficulty, selectedAccent, sortBy]);

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
    BUSINESS: 'bg-teal-100 text-teal-800',
    ACADEMIC: 'bg-amber-100 text-amber-800',
  };

  const categoryText: Record<string, string> = {
    CONVERSATION: '对话',
    NEWS: '新闻',
    LECTURE: '讲座',
    INTERVIEW: '采访',
    STORY: '故事',
    BUSINESS: '商务',
    ACADEMIC: '学术',
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPopularityStars = (popularity: number) => {
    return '⭐'.repeat(popularity) + '☆'.repeat(5 - popularity);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载听力资源中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">听力资源库</h1>
        <p className="text-gray-600 mt-2">
          丰富的听力练习资源，按难度、分类和口音筛选，全面提升英语听力能力
        </p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">资源总数</p>
              <p className="text-3xl font-bold text-gray-900">{resources.length}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已完成</p>
              <p className="text-3xl font-bold text-gray-900">
                {resources.filter(r => r.completed).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均时长</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatDuration(Math.round(resources.reduce((sum, r) => sum + r.duration, 0) / resources.length))}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏱️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均难度</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(resources.filter(r => r.difficulty === 'BEGINNER').length / resources.length * 100)}% 初级
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选和搜索栏 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 搜索框 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索资源
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题、描述或标签..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                🔍
              </div>
            </div>
          </div>

          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序方式
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="POPULARITY">按热度排序</option>
              <option value="DIFFICULTY">按难度排序（简单到难）</option>
              <option value="DURATION">按时长排序（短到长）</option>
              <option value="POINTS">按积分排序（高到低）</option>
            </select>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">全部分类</option>
              {Object.entries(categoryText).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
              口音
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedAccent}
              onChange={(e) => setSelectedAccent(e.target.value)}
            >
              <option value="ALL">全部口音</option>
              {Object.entries(accentText).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 筛选结果统计 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700">
                找到 <span className="font-bold text-indigo-600">{filteredResources.length}</span> 个资源
              </span>
              {(searchQuery || selectedCategory !== 'ALL' || selectedDifficulty !== 'ALL' || selectedAccent !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedDifficulty('ALL');
                    setSelectedAccent('ALL');
                  }}
                  className="ml-4 text-sm text-indigo-600 hover:text-indigo-800"
                >
                  清除筛选
                </button>
              )}
            </div>
            <div className="text-sm text-gray-600">
              共 {resources.length} 个资源
            </div>
          </div>
        </div>
      </div>

      {/* 资源列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* 资源头部 */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{resource.title}</h3>
                  <p className="text-gray-600 mt-1">{resource.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[resource.difficulty]}`}>
                    {difficultyText[resource.difficulty]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${accentColors[resource.accent]}`}>
                    {accentText[resource.accent]}
                  </span>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[resource.category]}`}>
                  {categoryText[resource.category]}
                </span>
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 资源详情 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">⏱️</span>
                  <div>
                    <div className="text-sm font-medium">{formatDuration(resource.duration)}</div>
                    <div className="text-xs text-gray-500">时长</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⭐</span>
                  <div>
                    <div className="text-sm font-medium">{resource.points} 积分</div>
                    <div className="text-xs text-gray-500">奖励</div>
                  </div>
                </div>
              </div>

              {/* 热度 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">热度</span>
                  <span className="text-sm text-gray-700">{resource.popularity}/5</span>
                </div>
                <div className="text-xl text-yellow-500">
                  {getPopularityStars(resource.popularity)}
                </div>
              </div>

              {/* 完成状态 */}
              {resource.completed && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">已完成</div>
                      <div className="text-sm text-green-700">
                        得分: {resource.score}/100
                      </div>
                    </div>
                    <div className="text-sm text-green-600">
                      {new Date(resource.completedAt!).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-100">
              {resource.completed ? (
                <div className="flex space-x-3">
                  <Link
                    href="/listening/all"
                    className="flex-1 py-3 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    查看详情
                  </Link>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                    重做
                  </button>
                </div>
              ) : (
                <Link
                  href="/listening/all"
                  className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  开始练习
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 分页和信息 */}
      {filteredResources.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">未找到匹配的资源</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            尝试调整筛选条件或搜索关键词，或者查看所有可用资源。
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedDifficulty('ALL');
              setSelectedAccent('ALL');
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            显示所有资源
          </button>
        </div>
      )}

      {/* 学习建议 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 听力学习建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">如何有效使用资源库</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">从适合自己水平的难度开始</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">尝试不同口音和分类的资源</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">热门资源通常更有学习价值</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">定期挑战更高难度的材料</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">听力学习计划</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">初学者</span>
                  <span className="font-medium">对话+故事</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">中级者</span>
                  <span className="font-medium">新闻+采访</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">高级者</span>
                  <span className="font-medium">讲座+学术</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <Link
          href="/listening"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回听力训练
        </Link>
        <div className="text-sm text-gray-600">
          共 {filteredResources.length} 个资源，{resources.filter(r => r.completed).length} 个已完成
        </div>
      </div>
    </div>
  );
}