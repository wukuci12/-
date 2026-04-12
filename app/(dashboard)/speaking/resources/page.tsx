'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SpeakingTip {
  id: string;
  title: string;
  category: string;
  content: string;
  examples?: string[];
}

interface CommonPhrase {
  id: string;
  category: string;
  phrase: string;
  usage: string;
}

const speakingTips: SpeakingTip[] = [
  {
    id: 'tip-1',
    title: '正确使用音调',
    category: '发音',
    content: '英语是一种语调语言，正确的语调可以帮助你更清晰地表达意思。升调通常用于问句，降调用于陈述句。',
    examples: [
      'Are you going home? (升调)',
      'I am going home. (降调)',
    ],
  },
  {
    id: 'tip-2',
    title: '连读技巧',
    category: '发音',
    content: '在英语口语中，相邻单词之间经常会发生连读现象。掌握连读技巧可以让你的发音更加自然流畅。',
    examples: [
      'turn + on = "turnon"',
      'not + at + all = "notatal"',
    ],
  },
  {
    id: 'tip-3',
    title: '如何开始对话',
    category: '对话',
    content: '在英语对话中，合适的开场白很重要。可以从简单的话题开始，如天气、今天的工作等。',
    examples: [
      'Nice to meet you!',
      'How is it going?',
      'What do you do for a living?',
    ],
  },
  {
    id: 'tip-4',
    title: '表达意见的句型',
    category: '表达',
    content: '在表达个人观点时，使用恰当的句型可以让你听起来更加地道和专业。',
    examples: [
      'In my opinion...',
      'I believe that...',
      'From my perspective...',
    ],
  },
];

const commonPhrases: CommonPhrase[] = [
  {
    id: 'phrase-1',
    category: '问候',
    phrase: 'How are you doing?',
    usage: '非正式问候，意为"你最近怎么样？"',
  },
  {
    id: 'phrase-2',
    category: '问候',
    phrase: 'Nice to meet you!',
    usage: '第一次见面时的问候语',
  },
  {
    id: 'phrase-3',
    category: '询问',
    phrase: 'Could you please repeat that?',
    usage: '礼貌地请求对方重复',
  },
  {
    id: 'phrase-4',
    category: '表达',
    phrase: 'I would like to...',
    usage: '礼貌地表达想要做的事情',
  },
  {
    id: 'phrase-5',
    category: '观点',
    phrase: 'In my opinion...',
    usage: '引出个人观点',
  },
  {
    id: 'phrase-6',
    category: '结束',
    phrase: 'It was nice talking to you!',
    usage: '结束对话时的礼貌用语',
  },
];

export default function SpeakingResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tips' | 'phrases'>('tips');

  const categories = ['all', '发音', '对话', '表达', '结束'];

  const filteredTips = speakingTips.filter((tip) => {
    if (selectedCategory === 'all') return true;
    return tip.category === selectedCategory;
  });

  const filteredPhrases = commonPhrases.filter((phrase) => {
    if (selectedCategory === 'all') return true;
    return phrase.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">口语素材</h1>
          <p className="text-gray-600 mt-2">学习口语技巧和常用表达</p>
        </div>
        <Link
          href="/speaking"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← 返回
        </Link>
      </div>

      {/* 标签切换 */}
      <div className="bg-white rounded-xl shadow-lg p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'tips'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💡 口语技巧
          </button>
          <button
            onClick={() => setActiveTab('phrases')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'phrases'
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 常用短语
          </button>
        </div>
      </div>

      {activeTab === 'tips' ? (
        <>
          {/* 分类筛选 */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex space-x-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 技巧列表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {tip.category}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{tip.content}</p>
                {tip.examples && tip.examples.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">示例:</div>
                    {tip.examples.map((ex, idx) => (
                      <div key={idx} className="text-gray-600 italic mb-1">
                        "{ex}"
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 分类筛选 */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex space-x-2">
              {['all', '问候', '询问', '表达', '观点', '结束'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* 短语列表 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-700 font-medium">分类</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-medium">短语</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-medium">用法</th>
                </tr>
              </thead>
              <tbody>
                {filteredPhrases.map((phrase) => (
                  <tr key={phrase.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {phrase.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{phrase.phrase}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {phrase.usage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 学习建议 */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">提升计划</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-900 mb-2">设定目标</h3>
            <p className="text-sm text-gray-600">确定每周练习目标</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🎤</div>
            <h3 className="font-bold text-gray-900 mb-2">每天朗读</h3>
            <p className="text-sm text-gray-600">练习15-30分钟</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">👂</div>
            <h3 className="font-bold text-gray-900 mb-2">多听多模仿</h3>
            <p className="text-sm text-gray-600">跟读英语材料</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-bold text-gray-900 mb-2">大胆开口</h3>
            <p className="text-sm text-gray-600">不要害怕犯错</p>
          </div>
        </div>
      </div>
    </div>
  );
}
