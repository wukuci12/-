'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReadingResource {
  id: string;
  title: string;
  description: string;
  content: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: 'STORY' | 'NEWS' | 'SCIENCE' | 'HISTORY' | 'CULTURE' | 'OTHER';
  wordCount: number;
  estimatedTime: number;
  difficulty: number;
  tags: string[];
  completed?: boolean;
  score?: number;
}

const allResources: ReadingResource[] = [
  {
    id: 'res-1',
    title: 'The Secret Garden',
    description: '经典儿童文学作品节选，讲述一个关于友谊和自然的故事',
    content: '',
    level: 'BEGINNER',
    genre: 'STORY',
    wordCount: 450,
    estimatedTime: 5,
    difficulty: 2,
    tags: ['经典', '儿童文学', '友谊'],
    completed: true,
    score: 85,
  },
  {
    id: 'res-2',
    title: 'Climate Change Report',
    description: '关于全球气候变化的新闻报道，讨论环境问题',
    content: '',
    level: 'INTERMEDIATE',
    genre: 'NEWS',
    wordCount: 680,
    estimatedTime: 8,
    difficulty: 3,
    tags: ['环境', '新闻', '科学'],
  },
  {
    id: 'res-3',
    title: 'Albert Einstein Biography',
    description: '爱因斯坦生平简介，讲述这位伟大科学家的故事',
    content: '',
    level: 'INTERMEDIATE',
    genre: 'HISTORY',
    wordCount: 750,
    estimatedTime: 9,
    difficulty: 3,
    tags: ['名人', '科学家', '历史'],
  },
  {
    id: 'res-4',
    title: 'The Solar System',
    description: '太阳系行星介绍，探索宇宙的奥秘',
    content: '',
    level: 'BEGINNER',
    genre: 'SCIENCE',
    wordCount: 520,
    estimatedTime: 6,
    difficulty: 2,
    tags: ['宇宙', '科学', '天文'],
    completed: true,
    score: 90,
  },
  {
    id: 'res-5',
    title: 'Artificial Intelligence',
    description: '人工智能技术发展现状，探讨AI对未来的影响',
    content: '',
    level: 'ADVANCED',
    genre: 'SCIENCE',
    wordCount: 1200,
    estimatedTime: 15,
    difficulty: 5,
    tags: ['科技', 'AI', '未来'],
  },
  {
    id: 'res-6',
    title: 'Traditional Chinese Festivals',
    description: '中国传统节日介绍，弘扬中华文化',
    content: '',
    level: 'BEGINNER',
    genre: 'CULTURE',
    wordCount: 600,
    estimatedTime: 7,
    difficulty: 2,
    tags: ['文化', '中国', '传统'],
  },
  {
    id: 'res-7',
    title: 'Global Economic Trends',
    description: '全球经济趋势分析，讨论世界经济发展',
    content: '',
    level: 'ADVANCED',
    genre: 'NEWS',
    wordCount: 950,
    estimatedTime: 12,
    difficulty: 5,
    tags: ['经济', '金融', '全球'],
  },
  {
    id: 'res-8',
    title: 'The Great Wall of China',
    description: '长城历史与建筑特点，探索世界奇迹',
    content: '',
    level: 'INTERMEDIATE',
    genre: 'HISTORY',
    wordCount: 800,
    estimatedTime: 10,
    difficulty: 3,
    tags: ['建筑', '历史', '中国'],
  },
  {
    id: 'res-9',
    title: 'Space Exploration',
    description: '人类太空探索历程，从登月到火星计划',
    content: '',
    level: 'ADVANCED',
    genre: 'SCIENCE',
    wordCount: 1100,
    estimatedTime: 14,
    difficulty: 4,
    tags: ['太空', '科技', '探索'],
  },
  {
    id: 'res-10',
    title: 'The Story of Tea',
    description: '茶的起源与传播，品味东方文化',
    content: '',
    level: 'BEGINNER',
    genre: 'CULTURE',
    wordCount: 550,
    estimatedTime: 6,
    difficulty: 2,
    tags: ['茶文化', '历史', '传统'],
  },
  {
    id: 'res-11',
    title: 'Modern Architecture',
    description: '现代建筑设计理念与发展趋势',
    content: '',
    level: 'INTERMEDIATE',
    genre: 'OTHER',
    wordCount: 720,
    estimatedTime: 9,
    difficulty: 3,
    tags: ['建筑', '设计', '现代'],
  },
  {
    id: 'res-12',
    title: 'Ocean Conservation',
    description: '海洋生态保护的重要性与行动',
    content: '',
    level: 'ADVANCED',
    genre: 'SCIENCE',
    wordCount: 1050,
    estimatedTime: 13,
    difficulty: 4,
    tags: ['环保', '海洋', '生态'],
  },
];

export default function ReadingResourcesPage() {
  const [resources, setResources] = useState<ReadingResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setResources(allResources);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredResources = resources.filter((resource) => {
    if (selectedLevel !== 'all' && resource.level !== selectedLevel) return false;
    if (selectedGenre !== 'all' && resource.genre !== selectedGenre) return false;
    if (selectedDifficulty !== 'all' && resource.difficulty !== parseInt(selectedDifficulty)) return false;
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (!showCompleted && resource.completed) return false;
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

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载资源中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">阅读资源库</h1>
          <p className="text-gray-600 mt-2">
            共有 {resources.length} 篇阅读文章，开始你的阅读之旅吧
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* 搜索框 */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* 难度等级 */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">所有难度</option>
            <option value="BEGINNER">初级</option>
            <option value="INTERMEDIATE">中级</option>
            <option value="ADVANCED">高级</option>
          </select>

          {/* 文章类型 */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">所有类型</option>
            <option value="STORY">故事</option>
            <option value="NEWS">新闻</option>
            <option value="SCIENCE">科学</option>
            <option value="HISTORY">历史</option>
            <option value="CULTURE">文化</option>
            <option value="OTHER">其他</option>
          </select>

          {/* 难度星级 */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">所有难度星级</option>
            <option value="1">★☆☆☆☆</option>
            <option value="2">★★☆☆☆</option>
            <option value="3">★★★☆☆</option>
            <option value="4">★★★★☆</option>
            <option value="5">★★★★★</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-600">显示已完成的文章</span>
            </label>
          </div>
          <div className="text-sm text-gray-600">
            找到 {filteredResources.length} 篇文章
          </div>
        </div>
      </div>

      {/* 资源列表/网格 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                  </div>
                  {resource.completed && (
                    <span className="flex-shrink-0 text-green-500 text-xl">✓</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[resource.level]}`}>
                    {levelText[resource.level]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[resource.genre]}`}>
                    {genreText[resource.genre]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{resource.wordCount} 词</span>
                  <span>{resource.estimatedTime} 分钟</span>
                  <span className="text-yellow-500">{getDifficultyStars(resource.difficulty)}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {resource.completed ? (
                    <div className="text-sm">
                      <span className="text-gray-600">得分:</span>
                      <span className="ml-1 font-bold text-green-600">{resource.score}</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">未完成</div>
                  )}
                  <Link
                    href={`/reading/practice/${resource.id}`}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  >
                    {resource.completed ? '复习' : '开始阅读'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">文章标题</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">难度</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">类型</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">难度星级</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">词数/时间</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">状态</th>
                <th className="text-left py-4 px-6 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((resource) => (
                <tr key={resource.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">{resource.title}</div>
                    <div className="text-sm text-gray-500">{resource.description}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[resource.level]}`}>
                      {levelText[resource.level]}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${genreColors[resource.genre]}`}>
                      {genreText[resource.genre]}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-yellow-500">
                    {getDifficultyStars(resource.difficulty)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {resource.wordCount}词 / {resource.estimatedTime}分钟
                  </td>
                  <td className="py-4 px-6">
                    {resource.completed ? (
                      <div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          已完成
                        </span>
                        <div className="text-sm text-green-600 mt-1">得分: {resource.score}</div>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        未完成
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Link
                      href={`/reading/practice/${resource.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                      {resource.completed ? '复习' : '开始阅读'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredResources.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">没有找到匹配的文章</h3>
          <p className="text-gray-600">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}

      {/* 推荐阅读 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">为你推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources
            .filter((r) => !r.completed)
            .slice(0, 3)
            .map((resource) => (
              <Link
                key={resource.id}
                href={`/reading/practice/${resource.id}`}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[resource.level]}`}>
                    {levelText[resource.level]}
                  </span>
                  <span className="text-indigo-600 text-sm font-medium">开始阅读 →</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
