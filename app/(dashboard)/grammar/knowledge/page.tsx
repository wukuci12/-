'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GrammarTopic {
  id: string;
  title: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  keyPoints: string[];
  examples: { sentence: string; translation: string }[];
  commonErrors: string[];
  relatedTopics: string[];
}

interface GrammarCategory {
  id: string;
  name: string;
  description: string;
  topics: GrammarTopic[];
}

export default function GrammarKnowledgePage() {
  const [categories, setCategories] = useState<GrammarCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 模拟加载语法知识点数据
    const loadGrammarData = async () => {
      setIsLoading(true);
      try {
        // TODO: 实际API调用
        setTimeout(() => {
          const mockCategories: GrammarCategory[] = [
            {
              id: 'tenses',
              name: '时态',
              description: '英语中表示动作发生时间的语法形式',
              topics: [
                {
                  id: 'present_simple',
                  title: '一般现在时',
                  category: 'tenses',
                  level: 'BEGINNER',
                  description: '表示习惯性、经常性的动作或客观事实',
                  keyPoints: [
                    '表示习惯性动作：I usually get up at 6 am.',
                    '表示客观事实：The sun rises in the east.',
                    '表示真理、格言：Practice makes perfect.',
                    '表示按计划或时间表将要发生的动作：The train leaves at 8 pm.',
                  ],
                  examples: [
                    { sentence: 'She works in a hospital.', translation: '她在医院工作。' },
                    { sentence: 'Water boils at 100°C.', translation: '水在100摄氏度沸腾。' },
                    { sentence: 'The meeting starts at 2 pm tomorrow.', translation: '会议明天下午2点开始。' },
                  ],
                  commonErrors: [
                    '误用现在进行时表示习惯：He is usually going to bed late. (错) → He usually goes to bed late. (对)',
                    '第三人称单数忘记加s：She speak English very well. (错) → She speaks English very well. (对)',
                  ],
                  relatedTopics: ['现在进行时', '一般过去时'],
                },
                {
                  id: 'present_continuous',
                  title: '现在进行时',
                  category: 'tenses',
                  level: 'BEGINNER',
                  description: '表示正在进行的动作或现阶段正在进行的动作',
                  keyPoints: [
                    '表示说话时正在进行的动作：I am reading a book now.',
                    '表示现阶段正在进行的动作（不一定说话时正在进行）：She is studying English this semester.',
                    '表示计划好的近期将要发生的动作：We are leaving for Beijing next week.',
                    '与always, constantly等连用，表示经常发生的动作，带有感情色彩：He is always complaining.',
                  ],
                  examples: [
                    { sentence: 'Look! It is raining outside.', translation: '看！外面正在下雨。' },
                    { sentence: 'They are building a new school in our town.', translation: '他们正在我们镇上建一所新学校。' },
                    { sentence: 'I am meeting my friend for lunch tomorrow.', translation: '我明天要和朋友一起吃午饭。' },
                  ],
                  commonErrors: [
                    '误用一般现在时表示正在进行的动作：I read a book now. (错) → I am reading a book now. (对)',
                    '现在进行时与静态动词连用：I am knowing the answer. (错) → I know the answer. (对)',
                  ],
                  relatedTopics: ['一般现在时', '过去进行时'],
                },
                {
                  id: 'present_perfect',
                  title: '现在完成时',
                  category: 'tenses',
                  level: 'INTERMEDIATE',
                  description: '表示过去发生的动作对现在造成的影响或结果，或表示从过去开始持续到现在的动作或状态',
                  keyPoints: [
                    '表示过去发生的动作对现在的影响：I have lost my keys. (我现在没有钥匙)',
                    '表示从过去开始持续到现在的动作或状态：She has lived here for 10 years.',
                    '表示过去的经历：I have been to Paris twice.',
                    '与just, already, yet, ever, never等词连用',
                  ],
                  examples: [
                    { sentence: 'I have finished my homework.', translation: '我已经完成了作业。' },
                    { sentence: 'They have known each other since childhood.', translation: '他们从小就认识。' },
                    { sentence: 'Have you ever eaten sushi?', translation: '你吃过寿司吗？' },
                  ],
                  commonErrors: [
                    '与具体过去时间连用：I have seen him yesterday. (错) → I saw him yesterday. (对)',
                    '混淆since和for：I have lived here since 5 years. (错) → I have lived here for 5 years. (对)',
                  ],
                  relatedTopics: ['一般过去时', '现在完成进行时'],
                },
              ],
            },
            {
              id: 'clauses',
              name: '从句',
              description: '在句子中充当某一成分的句子',
              topics: [
                {
                  id: 'noun_clause',
                  title: '名词性从句',
                  category: 'clauses',
                  level: 'INTERMEDIATE',
                  description: '在句子中起名词作用的句子，可以作主语、宾语、表语、同位语',
                  keyPoints: [
                    '主语从句：What he said is true.',
                    '宾语从句：I know that he is honest.',
                    '表语从句：The fact is that she didn\'t come.',
                    '同位语从句：The news that we won the game excited everyone.',
                  ],
                  examples: [
                    { sentence: 'That he will come is certain.', translation: '他要求是肯定的。' },
                    { sentence: 'I wonder why he didn\'t show up.', translation: '我想知道他为什么没来。' },
                    { sentence: 'My suggestion is that we should start early.', translation: '我的建议是我们应该早点出发。' },
                  ],
                  commonErrors: [
                    '缺少连接词：I think he is right. (正确，但think后省略that)',
                    '词序错误：I don\'t know where is he. (错) → I don\'t know where he is. (对)',
                  ],
                  relatedTopics: ['定语从句', '状语从句'],
                },
                {
                  id: 'adjective_clause',
                  title: '定语从句',
                  category: 'clauses',
                  level: 'INTERMEDIATE',
                  description: '在句子中起定语作用的句子，修饰名词或代词',
                  keyPoints: [
                    '关系代词：who, whom, whose, which, that',
                    '关系副词：when, where, why',
                    '限制性定语从句：The book that I borrowed is interesting.',
                    '非限制性定语从句：My sister, who lives in Shanghai, is a doctor.',
                  ],
                  examples: [
                    { sentence: 'The man who is standing there is my teacher.', translation: '站在那里的那个人是我的老师。' },
                    { sentence: 'This is the house where I was born.', translation: '这就是我出生的房子。' },
                    { sentence: 'I still remember the day when we first met.', translation: '我仍然记得我们第一次见面的那一天。' },
                  ],
                  commonErrors: [
                    '关系代词使用错误：The book who I bought is expensive. (错) → The book that I bought is expensive. (对)',
                    '缺少先行词：This is the place I visited last year. (正确，省略that/which)',
                  ],
                  relatedTopics: ['名词性从句', '状语从句'],
                },
                {
                  id: 'adverbial_clause',
                  title: '状语从句',
                  category: 'clauses',
                  level: 'ADVANCED',
                  description: '在句子中起状语作用的句子，表示时间、地点、原因、条件等',
                  keyPoints: [
                    '时间状语从句：When I arrived, the meeting had already started.',
                    '条件状语从句：If it rains tomorrow, we will cancel the picnic.',
                    '原因状语从句：Because he was ill, he didn\'t go to school.',
                    '让步状语从句：Although it was raining, we went out.',
                  ],
                  examples: [
                    { sentence: 'Where there is a will, there is a way.', translation: '有志者事竟成。' },
                    { sentence: 'If you work hard, you will succeed.', translation: '如果你努力工作，你就会成功。' },
                    { sentence: 'He spoke so fast that I couldn\'t understand him.', translation: '他说得太快了，我听不懂。' },
                  ],
                  commonErrors: [
                    '时间状语从句误用将来时：When I will arrive, I will call you. (错) → When I arrive, I will call you. (对)',
                    'though/although与but连用：Although he is rich, but he is not happy. (错) → Although he is rich, he is not happy. (对)',
                  ],
                  relatedTopics: ['定语从句', '名词性从句'],
                },
              ],
            },
            {
              id: 'voice',
              name: '语态',
              description: '表示主语和谓语之间关系的语法形式',
              topics: [
                {
                  id: 'passive_voice',
                  title: '被动语态',
                  category: 'voice',
                  level: 'INTERMEDIATE',
                  description: '表示主语是动作的承受者',
                  keyPoints: [
                    '基本结构：be + 过去分词',
                    '时态变化体现在be动词上',
                    'by短语表示动作的执行者',
                    '不及物动词没有被动语态',
                  ],
                  examples: [
                    { sentence: 'The book was written by him.', translation: '这本书是他写的。' },
                    { sentence: 'English is spoken all over the world.', translation: '全世界都说英语。' },
                    { sentence: 'The building is being constructed.', translation: '大楼正在建设中。' },
                  ],
                  commonErrors: [
                    '误用不及物动词的被动语态：The accident was happened yesterday. (错) → The accident happened yesterday. (对)',
                    '被动语态结构错误：The letter has been wrote. (错) → The letter has been written. (对)',
                  ],
                  relatedTopics: ['主动语态', '使役动词'],
                },
              ],
            },
          ];

          setCategories(mockCategories);
          setActiveCategory(mockCategories[0].id);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('加载语法知识点错误:', error);
        setIsLoading(false);
      }
    };

    loadGrammarData();
  }, []);

  // 获取当前分类
  const currentCategory = categories.find(cat => cat.id === activeCategory);

  // 搜索过滤
  const filteredTopics = currentCategory?.topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载语法知识点中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">语法知识点库</h1>
        <p className="text-gray-600 text-lg">
          系统学习高中英语语法知识点，掌握核心语法规则
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：分类导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">语法分类</h2>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setSelectedTopic(null);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {category.topics.length} 个知识点
                  </div>
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索知识点..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">学习统计</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">知识点总数</span>
                  <span className="font-medium">{categories.reduce((sum, cat) => sum + cat.topics.length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">分类数量</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">当前分类</span>
                  <span className="font-medium">{currentCategory?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：内容区域 */}
        <div className="lg:col-span-3">
          {/* 分类标题 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentCategory?.name}</h2>
                <p className="text-gray-600 mt-2">{currentCategory?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{filteredTopics.length}</div>
                <div className="text-sm text-gray-500">个知识点</div>
              </div>
            </div>

            {/* 知识点列表 */}
            {filteredTopics.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">未找到知识点</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? `没有找到包含"${searchQuery}"的知识点` : '该分类下暂无知识点'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    清除搜索
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredTopics.map(topic => (
                  <div
                    key={topic.id}
                    className={`border rounded-xl p-6 hover:shadow-md transition-all cursor-pointer ${
                      selectedTopic?.id === topic.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[topic.level]}`}>
                            {levelText[topic.level]}
                          </span>
                          <span className="text-sm text-gray-500">{topic.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">相关主题</div>
                        <div className="text-sm font-medium">{topic.relatedTopics.join(', ')}</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{topic.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-2">核心要点：</div>
                        <ul className="space-y-1">
                          {topic.keyPoints.slice(0, 3).map((point, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                          {topic.keyPoints.length > 3 && (
                            <li className="text-gray-500">...还有{topic.keyPoints.length - 3}个要点</li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-2">常见错误：</div>
                        <ul className="space-y-1">
                          {topic.commonErrors.slice(0, 2).map((error, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-500 mr-2">✗</span>
                              <span className="text-gray-700">{error}</span>
                            </li>
                          ))}
                          {topic.commonErrors.length > 2 && (
                            <li className="text-gray-500">...还有{topic.commonErrors.length - 2}个常见错误</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        点击查看详细解析
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(topic);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        查看详情 →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 知识点详情 */}
          {selectedTopic && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTopic.title}</h2>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[selectedTopic.level]}`}>
                      {levelText[selectedTopic.level]}
                    </span>
                    <span className="text-gray-500">{selectedTopic.description}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                {/* 核心要点 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">核心要点</h3>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <ul className="space-y-3">
                      {selectedTopic.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-3">{index + 1}.</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 例句展示 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">例句展示</h3>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="space-y-4">
                      {selectedTopic.examples.map((example, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg">
                          <div className="text-gray-700 font-medium mb-2">{example.sentence}</div>
                          <div className="text-gray-600 text-sm">{example.translation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 常见错误 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">常见错误</h3>
                  <div className="bg-red-50 rounded-xl p-6">
                    <ul className="space-y-3">
                      {selectedTopic.commonErrors.map((error, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-600 mr-3">✗</span>
                          <div>
                            <div className="text-gray-700">{error}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 相关主题 */}
                {selectedTopic.relatedTopics.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">相关主题</h3>
                    <div className="bg-purple-50 rounded-xl p-6">
                      <div className="flex flex-wrap gap-3">
                        {selectedTopic.relatedTopics.map((topicName, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-white text-purple-700 rounded-lg font-medium hover:bg-purple-100 cursor-pointer"
                          >
                            {topicName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 学习建议 */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">学习建议</h3>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">✓</span>
                        <span className="text-gray-700">熟记核心要点，理解语法规则的本质</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">✓</span>
                        <span className="text-gray-700">通过例句掌握实际用法，不要死记硬背</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">✓</span>
                        <span className="text-gray-700">注意常见错误，避免在实际使用中犯错</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">✓</span>
                        <span className="text-gray-700">结合相关主题进行系统性学习</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  返回列表
                </button>
                <div className="flex space-x-4">
                  <Link
                    href={`/grammar/quiz?topic=${selectedTopic.id}`}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    专项测试
                  </Link>
                  <Link
                    href={`/grammar/compare?topic1=${selectedTopic.id}`}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
                  >
                    对比学习
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 学习建议 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📚 语法学习方法</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">系统学习</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">按分类系统学习，建立知识体系</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">从易到难，循序渐进</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">理解规则背后的逻辑</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">实践应用</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">通过例句掌握实际用法</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">完成相关练习巩固知识</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span className="text-gray-700">在写作和口语中应用所学语法</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/grammar"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回语法学习
        </Link>
        <div className="text-sm text-gray-600">
          共 {categories.reduce((sum, cat) => sum + cat.topics.length, 0)} 个语法知识点
        </div>
      </div>
    </div>
  );
}