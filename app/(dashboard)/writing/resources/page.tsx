'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WritingSample {
  id: string;
  title: string;
  type: 'NARRATIVE' | 'EXPOSITORY' | 'ARGUMENTATIVE' | 'PRACTICAL';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  content: string;
  wordCount: number;
  score: number;
  analysis: string;
  tags: string[];
}

interface WritingTip {
  id: string;
  title: string;
  category: string;
  content: string;
  examples: string[];
}

const writingSamples: WritingSample[] = [
  {
    id: 'sample-1',
    title: 'My Summer Vacation',
    type: 'NARRATIVE',
    difficulty: 'BEGINNER',
    content: `Last summer, I spent two wonderful weeks at my grandparents' house in the countryside. It was the most memorable vacation I have ever had.

On the first day, my grandfather took me to the nearby river. The water was cool and clear. I saw many fish swimming happily. My grandmother cooked delicious food every day. I especially loved her homemade noodles.

The best part of the trip was watching the stars at night. Without city lights, the sky was filled with thousands of bright stars. It was like a beautiful painting.

I learned to help with farm work too. I fed the chickens and water the vegetables. It was hard work, but I enjoyed it. This vacation taught me to appreciate the simple things in life and the importance of family.`,
    wordCount: 180,
    score: 88,
    analysis: '文章结构完整，时间顺序清晰。使用了丰富的感官细节和具体例子。情感表达真挚。',
    tags: ['假期', '乡村', '亲情'],
  },
  {
    id: 'sample-2',
    title: 'How to Learn English Effectively',
    type: 'EXPOSITORY',
    difficulty: 'INTERMEDIATE',
    content: `Learning English effectively requires a combination of consistent practice and smart strategies. Here are some proven methods to help you improve your English skills.

First, develop a daily reading habit. Read English articles, books, or news every day. This helps expand your vocabulary and improves your comprehension skills. Start with materials that match your current level and gradually increase the difficulty.

Second, practice speaking whenever possible. Join English clubs, find language exchange partners, or simply talk to yourself in English. Don't be afraid of making mistakes—they are an essential part of the learning process.

Third, use technology to your advantage. Language learning apps, podcasts, and online courses can provide valuable practice opportunities. Many free resources are available online.

Finally, keep a vocabulary journal. Write down new words, their meanings, and example sentences. Review them regularly to strengthen your memory.

Remember, consistency is key. Even 15-20 minutes of daily practice is more effective than long, irregular sessions.`,
    wordCount: 220,
    score: 85,
    analysis: '说明文结构清晰，使用了列举和因果关系。观点明确，有具体建议。语言流畅专业。',
    tags: ['学习方法', '英语', '技巧'],
  },
  {
    id: 'sample-3',
    title: 'Should Mobile Phones Be Banned in Schools?',
    type: 'ARGUMENTATIVE',
    difficulty: 'ADVANCED',
    content: `The debate about banning mobile phones in schools has attracted considerable attention in recent years. While some argue that phones should be prohibited entirely, I believe a more balanced approach is necessary.

On one hand, supporters of a ban raise valid concerns. First, mobile phones can be a major distraction in the classroom. Studies show that students who use phones during lessons score significantly lower on tests. Second, phones facilitate cheating during exams. Third, excessive screen time can lead to health issues such as eye strain and poor sleep.

However, a complete ban may not be the optimal solution. Modern smartphones are powerful learning tools. Students can access educational apps, research information, and collaborate with classmates. Banning phones entirely would deprive students of these benefits.

A better approach would be to establish clear guidelines for phone use. Schools should designate specific times and places for phone use. Teaching students responsible digital citizenship is more valuable than simply taking phones away.

In conclusion, rather than imposing a blanket ban, schools should develop thoughtful policies that maximize the educational benefits of mobile technology while minimizing its potential harms.`,
    wordCount: 260,
    score: 90,
    analysis: '议论文结构严谨，论点论据充分。使用了对比论证和举例论证。语言正式准确，逻辑严密。',
    tags: ['教育', '科技', '辩论'],
  },
];

const writingTips: WritingTip[] = [
  {
    id: 'tip-1',
    title: '如何写好开头',
    category: '结构',
    content: '一个好的开头应该吸引读者的注意力，可以用一个有趣的事实、问题或引语开始。避免使用过于笼统的陈述。',
    examples: [
      '"The early morning sun..." (描述性开头)',
      '"Have you ever wondered..." (问题开头)',
      '"As the famous writer once said..." (引语开头)',
    ],
  },
  {
    id: 'tip-2',
    title: '使用连接词',
    category: '语言',
    content: '恰当使用连接词可以使文章更流畅。常见的连接词包括：',
    examples: [
      'First, Second, Finally (顺序)',
      'However, Nevertheless, On the other hand (对比)',
      'Therefore, As a result, Consequently (因果)',
      'Furthermore, In addition, Moreover (递进)',
    ],
  },
  {
    id: 'tip-3',
    title: '避免常见错误',
    category: '语法',
    content: '写作中常见的一些语法错误需要避免：',
    examples: [
      '主谓不一致',
      '时态混用',
      'run-on sentences (流水句)',
      '拼写错误',
    ],
  },
];

export default function WritingResourcesPage() {
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [tips] = useState<WritingTip[]>(writingTips);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedSample, setSelectedSample] = useState<WritingSample | null>(null);
  const [activeTab, setActiveTab] = useState<'samples' | 'tips'>('samples');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSamples(writingSamples);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredSamples = samples.filter((sample) => {
    if (selectedType !== 'all' && sample.type !== selectedType) return false;
    if (selectedDifficulty !== 'all' && sample.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const typeText: Record<string, string> = {
    NARRATIVE: '记叙文',
    EXPOSITORY: '说明文',
    ARGUMENTATIVE: '议论文',
    PRACTICAL: '应用文',
  };

  const difficultyText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
  };

  const typeColors: Record<string, string> = {
    NARRATIVE: 'bg-purple-100 text-purple-800',
    EXPOSITORY: 'bg-blue-100 text-blue-800',
    ARGUMENTATIVE: 'bg-red-100 text-red-800',
    PRACTICAL: 'bg-green-100 text-green-800',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载素材中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">写作素材库</h1>
          <p className="text-gray-600 mt-2">浏览优秀范文和学习写作技巧</p>
        </div>
        <Link
          href="/writing"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← 返回
        </Link>
      </div>

      {/* 标签切换 */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'samples'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 优秀范文 ({samples.length})
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'tips'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💡 写作技巧 ({tips.length})
          </button>
        </div>
      </div>

      {activeTab === 'samples' ? (
        <>
          {/* 筛选栏 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有类型</option>
                <option value="NARRATIVE">记叙文</option>
                <option value="EXPOSITORY">说明文</option>
                <option value="ARGUMENTATIVE">议论文</option>
                <option value="PRACTICAL">应用文</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有难度</option>
                <option value="BEGINNER">初级</option>
                <option value="INTERMEDIATE">中级</option>
                <option value="ADVANCED">高级</option>
              </select>

              <div className="text-sm text-gray-600 flex items-center">
                找到 {filteredSamples.length} 篇范文
              </div>
            </div>
          </div>

          {/* 范文列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedSample(sample)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{sample.title}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[sample.type]}`}>
                        {typeText[sample.type]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {difficultyText[sample.difficulty]}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{sample.score}</div>
                    <div className="text-xs text-gray-500">得分</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{sample.content}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {sample.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{sample.wordCount}词</span>
                  <span className="text-indigo-600 font-medium text-sm">查看详情 →</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 写作技巧 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {tip.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{tip.content}</p>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">示例:</div>
                  {tip.examples.map((ex, idx) => (
                    <div key={idx} className="text-sm text-gray-600 italic pl-4 border-l-2 border-indigo-200">
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 写作提示卡片 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">写作能力提升计划</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📖</div>
                <h3 className="font-bold text-gray-900 mb-2">每日阅读</h3>
                <p className="text-sm text-gray-600">阅读优秀范文</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">✍️</div>
                <h3 className="font-bold text-gray-900 mb-2">定期写作</h3>
                <p className="text-sm text-gray-600">每周练习2-3篇</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-bold text-gray-900 mb-2">积累词汇</h3>
                <p className="text-sm text-gray-600">记录好词好句</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-bold text-gray-900 mb-2">自我检查</h3>
                <p className="text-sm text-gray-600">提交前检查语法</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 范文详情弹窗 */}
      {selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSample.title}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[selectedSample.type]}`}>
                      {typeText[selectedSample.type]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {difficultyText[selectedSample.difficulty]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedSample.wordCount}词
                    </span>
                    <span className="text-green-600 font-bold">
                      得分: {selectedSample.score}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSample(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">范文正文</h3>
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {selectedSample.content}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">文章分析</h3>
                <p className="text-gray-700">{selectedSample.analysis}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedSample.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedSample(null)}
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
