'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ComparisonTopic {
  id: string;
  title: string;
  description: string;
  category: 'TENSES' | 'CLAUSES' | 'VOICE' | 'OTHER';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  grammarPoints: {
    pointA: {
      title: string;
      description: string;
      structure: string;
      examples: string[];
      usage: string;
      commonErrors: string[];
    };
    pointB: {
      title: string;
      description: string;
      structure: string;
      examples: string[];
      usage: string;
      commonErrors: string[];
    };
  };
  keyDifferences: {
    aspect: string;
    pointA: string;
    pointB: string;
  }[];
  similarityWarnings: string[];
  practiceExamples: {
    question: string;
    correctAnswer: string;
    explanation: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  }[];
}

export default function GrammarComparePage() {
  const [topics, setTopics] = useState<ComparisonTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ComparisonTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  useEffect(() => {
    // 模拟API获取对比主题数据
    setTimeout(() => {
      const mockTopics: ComparisonTopic[] = [
        {
          id: '1',
          title: '现在完成时 vs 一般过去时',
          description: '掌握两个时态的核心区别和适用场景',
          category: 'TENSES',
          difficulty: 'MEDIUM',
          points: 15,
          grammarPoints: {
            pointA: {
              title: '现在完成时',
              description: '表示过去发生的动作对现在的影响或结果，或从过去持续到现在的动作',
              structure: 'have/has + 过去分词',
              examples: [
                'I have finished my homework.',
                'She has lived here for 5 years.',
                'They have visited Paris three times.'
              ],
              usage: '强调与现在的联系、经历、结果、持续状态',
              commonErrors: [
                '混淆"for"和"since"的使用',
                '与具体过去时间状语连用',
                '忽略动作的持续性'
              ]
            },
            pointB: {
              title: '一般过去时',
              description: '表示过去某个特定时间发生的动作或状态',
              structure: '动词过去式',
              examples: [
                'I finished my homework yesterday.',
                'She lived in Beijing in 2010.',
                'They visited Paris last summer.'
              ],
              usage: '描述过去发生的具体事件、过去的习惯、已完成的动作',
              commonErrors: [
                '忘记使用动词过去式',
                '与现在完成时混淆使用',
                '错误的时间状语搭配'
              ]
            }
          },
          keyDifferences: [
            {
              aspect: '时间焦点',
              pointA: '强调与现在的联系',
              pointB: '强调过去的特定时间'
            },
            {
              aspect: '时间状语',
              pointA: 'for, since, already, yet, ever, never',
              pointB: 'yesterday, last week, in 2020, ago'
            },
            {
              aspect: '动作状态',
              pointA: '可能持续到现在',
              pointB: '已完全结束'
            }
          ],
          similarityWarnings: [
            '两者都涉及过去的时间',
            '某些动词的过去分词和过去式相同',
            '中文翻译可能相似'
          ],
          practiceExamples: [
            {
              question: 'I (live) in Shanghai ___ 10 years.',
              correctAnswer: 'have lived',
              explanation: '表示从过去持续到现在的状态，用现在完成时',
              difficulty: 'EASY'
            },
            {
              question: 'She (go) to Japan last month.',
              correctAnswer: 'went',
              explanation: '有具体过去时间状语"last month"，用一般过去时',
              difficulty: 'EASY'
            },
            {
              question: '___ you ever (try) sushi?',
              correctAnswer: 'Have, tried',
              explanation: '询问经历，没有具体时间，用现在完成时',
              difficulty: 'MEDIUM'
            }
          ]
        },
        {
          id: '2',
          title: '定语从句 vs 状语从句',
          description: '区分两种从句的功能和连接词',
          category: 'CLAUSES',
          difficulty: 'MEDIUM',
          points: 20,
          grammarPoints: {
            pointA: {
              title: '定语从句',
              description: '修饰名词或代词的从句，相当于形容词',
              structure: '先行词 + 关系词 (who, which, that, whose, whom) + 从句',
              examples: [
                'The book that I borrowed is interesting.',
                'The man who is talking is my teacher.',
                'This is the house where I grew up.'
              ],
              usage: '限定或描述先行词，提供额外信息',
              commonErrors: [
                '关系词选择错误',
                '从句语序错误',
                '省略不该省略的关系词'
              ]
            },
            pointB: {
              title: '状语从句',
              description: '修饰动词、形容词或副词的从句，表示时间、条件、原因等',
              structure: '从属连词 (when, if, because, although) + 从句',
              examples: [
                'I will call you when I arrive.',
                'If it rains, we will stay home.',
                'She studies hard because she wants to succeed.'
              ],
              usage: '表示时间、条件、原因、目的、结果、让步等',
              commonErrors: [
                '连词选择错误',
                '主从句时态不一致',
                '混淆不同功能的状语从句'
              ]
            }
          },
          keyDifferences: [
            {
              aspect: '功能',
              pointA: '修饰名词（形容词功能）',
              pointB: '修饰动词/句子（副词功能）'
            },
            {
              aspect: '位置',
              pointA: '通常紧接在被修饰词后',
              pointB: '位置相对灵活'
            },
            {
              aspect: '引导词',
              pointA: '关系代词/副词',
              pointB: '从属连词'
            }
          ],
          similarityWarnings: [
            '某些连接词可能相同（如where）但功能不同',
            '句子结构可能相似',
            '初学者容易混淆两者的功能'
          ],
          practiceExamples: [
            {
              question: 'The reason ___ she left is unknown.',
              correctAnswer: 'why',
              explanation: '定语从句，修饰reason，用关系副词why',
              difficulty: 'MEDIUM'
            },
            {
              question: '___ she was tired, she continued working.',
              correctAnswer: 'Although',
              explanation: '状语从句，表示让步关系',
              difficulty: 'HARD'
            },
            {
              question: 'This is the place ___ we first met.',
              correctAnswer: 'where',
              explanation: '定语从句，修饰place，用关系副词where',
              difficulty: 'EASY'
            }
          ]
        },
        {
          id: '3',
          title: '主动语态 vs 被动语态',
          description: '掌握两种语态的转换和适用场景',
          category: 'VOICE',
          difficulty: 'MEDIUM',
          points: 12,
          grammarPoints: {
            pointA: {
              title: '主动语态',
              description: '主语是动作的执行者',
              structure: '主语 + 谓语动词 + 宾语',
              examples: [
                'The teacher teaches the students.',
                'They built this house last year.',
                'She writes a letter every day.'
              ],
              usage: '强调动作的执行者，句子更直接有力',
              commonErrors: [
                '与被动语态混淆使用',
                '错误的主谓一致',
                '不恰当的语态选择'
              ]
            },
            pointB: {
              title: '被动语态',
              description: '主语是动作的承受者',
              structure: '主语 + be + 过去分词 + (by + 执行者)',
              examples: [
                'The students are taught by the teacher.',
                'This house was built last year.',
                'A letter is written every day.'
              ],
              usage: '强调动作的承受者、不知道执行者、不重要或不想提及执行者',
              commonErrors: [
                '忘记be动词',
                '错误使用过去分词',
                '不必要使用被动语态'
              ]
            }
          },
          keyDifferences: [
            {
              aspect: '主语角色',
              pointA: '动作执行者',
              pointB: '动作承受者'
            },
            {
              aspect: '句子重点',
              pointA: '强调谁做了某事',
              pointB: '强调某事被做了'
            },
            {
              aspect: '使用场景',
              pointA: '直接陈述事实',
              pointB: '正式文体、科学报告、未知执行者'
            }
          ],
          similarityWarnings: [
            '某些动词的被动形式与形容词相似',
            '中文表达可能不区分语态',
            '初学者可能过度使用被动语态'
          ],
          practiceExamples: [
            {
              question: 'The new bridge (build) ___ last year.',
              correctAnswer: 'was built',
              explanation: '被动语态，强调桥被建造',
              difficulty: 'EASY'
            },
            {
              question: 'Someone (steal) ___ my bike yesterday.',
              correctAnswer: 'stole',
              explanation: '主动语态，知道执行者',
              difficulty: 'MEDIUM'
            },
            {
              question: 'English (speak) ___ in many countries.',
              correctAnswer: 'is spoken',
              explanation: '被动语态，不知道或不强调执行者',
              difficulty: 'EASY'
            }
          ]
        },
        {
          id: '4',
          title: 'used to vs be used to',
          description: '区分两种表达的习惯用法',
          category: 'OTHER',
          difficulty: 'HARD',
          points: 18,
          grammarPoints: {
            pointA: {
              title: 'used to',
              description: '表示过去经常做某事但现在不做了',
              structure: 'used to + 动词原形',
              examples: [
                'I used to play basketball when I was young.',
                'She used to live in London.',
                'They used to go to that restaurant every week.'
              ],
              usage: '描述过去的习惯或状态',
              commonErrors: [
                '与be used to混淆',
                '错误使用动词形式',
                '用于现在时'
              ]
            },
            pointB: {
              title: 'be used to',
              description: '表示习惯于某事',
              structure: 'be used to + 名词/动名词',
              examples: [
                'I am used to the cold weather.',
                'She is used to working late.',
                'They are used to the noise now.'
              ],
              usage: '描述对某事的适应性',
              commonErrors: [
                '忘记be动词',
                '错误使用to后面的形式',
                '与used to混淆'
              ]
            }
          },
          keyDifferences: [
            {
              aspect: '含义',
              pointA: '过去习惯（现在已停止）',
              pointB: '现在习惯（已适应）'
            },
            {
              aspect: '结构',
              pointA: 'used to + do',
              pointB: 'be used to + doing/noun'
            },
            {
              aspect: '时态',
              pointA: '只用于过去',
              pointB: '可用于各种时态'
            }
          ],
          similarityWarnings: [
            '拼写相同但结构不同',
            '中文翻译可能相似',
            '初学者极易混淆'
          ],
          practiceExamples: [
            {
              question: 'I ___ get up early when I was a student.',
              correctAnswer: 'used to',
              explanation: '描述过去的习惯',
              difficulty: 'MEDIUM'
            },
            {
              question: 'She ___ living alone now.',
              correctAnswer: 'is used to',
              explanation: '描述现在的适应性',
              difficulty: 'MEDIUM'
            },
            {
              question: 'Did you ___ walk to school?',
              correctAnswer: 'use to',
              explanation: '疑问句中用use to',
              difficulty: 'HARD'
            }
          ]
        }
      ];
      setTopics(mockTopics);
      setSelectedTopic(mockTopics[0]);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = searchTerm === '' ||
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || topic.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || topic.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categoryLabels: Record<string, string> = {
    ALL: '全部',
    TENSES: '时态对比',
    CLAUSES: '从句对比',
    VOICE: '语态对比',
    OTHER: '其他对比'
  };

  const difficultyLabels: Record<string, string> = {
    ALL: '全部',
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难'
  };

  const difficultyColors: Record<string, string> = {
    EASY: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HARD: 'bg-red-100 text-red-800'
  };

  const categoryColors: Record<string, string> = {
    TENSES: 'bg-blue-100 text-blue-800',
    CLAUSES: 'bg-purple-100 text-purple-800',
    VOICE: 'bg-pink-100 text-pink-800',
    OTHER: 'bg-gray-100 text-gray-800'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载对比主题中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">语法对比学习</h1>
        <p className="text-gray-600 text-lg">
          对比易混淆的语法点，掌握核心区别和应用场景
        </p>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索主题</label>
            <input
              type="text"
              placeholder="搜索语法对比主题..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">分类筛选</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">难度筛选</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {Object.entries(difficultyLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            找到 {filteredTopics.length} 个对比主题
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">排序:</span>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>最新添加</option>
              <option>难度升序</option>
              <option>难度降序</option>
              <option>积分高低</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧主题列表 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">对比主题列表</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-6 cursor-pointer hover:bg-gray-50 transition-all ${
                    selectedTopic?.id === topic.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedTopic(topic)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${difficultyColors[topic.difficulty]}`}>
                      {difficultyLabels[topic.difficulty]}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[topic.category]}`}>
                      {categoryLabels[topic.category]}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600 text-sm">⭐ {topic.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学习统计 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">📊 对比学习统计</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">已学习主题</span>
                  <span className="font-medium">2/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">平均掌握率</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">累计积分</span>
                  <span className="font-medium">85 分</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">🎯 学习建议</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>先理解每个语法点的独立用法</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>对比表格帮助记忆核心区别</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>通过练习验证理解程度</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>定期复习易混淆点</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 右侧对比详情 */}
        <div className="lg:col-span-2">
          {selectedTopic ? (
            <div className="space-y-8">
              {/* 主题标题和元信息 */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h2>
                    <p className="text-gray-600">{selectedTopic.description}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors[selectedTopic.difficulty]}`}>
                      {difficultyLabels[selectedTopic.difficulty]}难度
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[selectedTopic.category]}`}>
                      {categoryLabels[selectedTopic.category]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* 语法点A */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-blue-800">{selectedTopic.grammarPoints.pointA.title}</h3>
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">A</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">定义</h4>
                        <p className="text-gray-700">{selectedTopic.grammarPoints.pointA.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">结构</h4>
                        <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-mono">
                          {selectedTopic.grammarPoints.pointA.structure}
                        </code>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">使用场景</h4>
                        <p className="text-gray-700">{selectedTopic.grammarPoints.pointA.usage}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">例句</h4>
                        <ul className="space-y-2">
                          {selectedTopic.grammarPoints.pointA.examples.map((example, idx) => (
                            <li key={idx} className="text-gray-700 bg-white p-3 rounded-lg">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 语法点B */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-green-800">{selectedTopic.grammarPoints.pointB.title}</h3>
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">B</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">定义</h4>
                        <p className="text-gray-700">{selectedTopic.grammarPoints.pointB.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">结构</h4>
                        <code className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-mono">
                          {selectedTopic.grammarPoints.pointB.structure}
                        </code>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">使用场景</h4>
                        <p className="text-gray-700">{selectedTopic.grammarPoints.pointB.usage}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">例句</h4>
                        <ul className="space-y-2">
                          {selectedTopic.grammarPoints.pointB.examples.map((example, idx) => (
                            <li key={idx} className="text-gray-700 bg-white p-3 rounded-lg">
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 核心区别对比表 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-6">核心区别对比</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-purple-200">
                          <th className="text-left py-3 px-4 text-purple-700 font-medium">对比方面</th>
                          <th className="text-left py-3 px-4 text-blue-700 font-medium">
                            {selectedTopic.grammarPoints.pointA.title}
                          </th>
                          <th className="text-left py-3 px-4 text-green-700 font-medium">
                            {selectedTopic.grammarPoints.pointB.title}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTopic.keyDifferences.map((diff, idx) => (
                          <tr key={idx} className="border-b border-purple-100 hover:bg-white/50">
                            <td className="py-4 px-4 font-medium text-gray-900">{diff.aspect}</td>
                            <td className="py-4 px-4 text-gray-700">{diff.pointA}</td>
                            <td className="py-4 px-4 text-gray-700">{diff.pointB}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 常见错误 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                    <h4 className="font-bold text-red-800 mb-4">
                      {selectedTopic.grammarPoints.pointA.title}常见错误
                    </h4>
                    <ul className="space-y-2">
                      {selectedTopic.grammarPoints.pointA.commonErrors.map((error, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span className="text-gray-700">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6">
                    <h4 className="font-bold text-yellow-800 mb-4">
                      {selectedTopic.grammarPoints.pointB.title}常见错误
                    </h4>
                    <ul className="space-y-2">
                      {selectedTopic.grammarPoints.pointB.commonErrors.map((error, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-yellow-600 mr-2">✗</span>
                          <span className="text-gray-700">{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 相似性警告 */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-6 mb-8">
                  <h4 className="font-bold text-gray-800 mb-4">⚠️ 相似性警告</h4>
                  <p className="text-gray-700 mb-4">这些语法点容易混淆，需要注意以下相似之处：</p>
                  <ul className="space-y-2">
                    {selectedTopic.similarityWarnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-gray-500 mr-2">•</span>
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 练习题目 */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-indigo-800 mb-6">📝 练习题目</h3>
                  <div className="space-y-6">
                    {selectedTopic.practiceExamples.map((example, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="font-bold text-gray-900 mb-2">题目 {idx + 1}</h5>
                            <p className="text-gray-700">{example.question}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            example.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                            example.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {example.difficulty}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-green-50 rounded-lg p-4">
                            <h6 className="font-medium text-green-800 mb-2">正确答案</h6>
                            <p className="text-green-900 font-mono">{example.correctAnswer}</p>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h6 className="font-medium text-blue-800 mb-2">答案解析</h6>
                            <p className="text-gray-700">{example.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 font-medium">
                      开始专项练习
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">选择对比主题</h3>
              <p className="text-gray-600 mb-8">请从左侧列表中选择一个语法对比主题开始学习</p>
              <button
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:opacity-90 font-medium"
                onClick={() => setSelectedTopic(topics[0])}
              >
                查看第一个主题
              </button>
            </div>
          )}

          {/* 学习进度 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">📈 学习进度跟踪</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600">2</div>
                <div className="text-gray-600 mt-2">已学习主题</div>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600">85%</div>
                <div className="text-gray-600 mt-2">平均正确率</div>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600">3.2</div>
                <div className="text-gray-600 mt-2">平均练习次数</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">🎯 下一步学习建议</h4>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  基于你的学习进度，建议接下来学习：
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">"虚拟语气 vs 条件句"</div>
                    <div className="text-sm text-gray-600">中等难度，15积分</div>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                    开始学习
                  </button>
                </div>
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
          坚持对比学习，语法掌握更精准！
        </div>
      </div>
    </div>
  );
}