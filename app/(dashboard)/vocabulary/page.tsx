'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';

// 发音函数
const speakWord = (word: string) => {
  if (typeof window === 'undefined') return;

  const synth = window.speechSynthesis;
  if (!synth) return;

  const voices = synth.getVoices();
  if (voices.length === 0) return;

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;

  const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (enVoice) utterance.voice = enVoice;

  synth.speak(utterance);
};

interface VocabularyStats {
  totalWords: number;
  masteredWords: number;
  learningWords: number;
  newWords: number;
  reviewDue: number;
  todayProgress: number;
}

export default function VocabularyPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<VocabularyStats>({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    newWords: 0,
    reviewDue: 0,
    todayProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentWords, setRecentWords] = useState<any[]>([]);

  useEffect(() => {
    // 模拟获取数据
    const fetchData = async () => {
      setIsLoading(true);
      // TODO: 实际API调用
      setTimeout(() => {
        setStats({
          totalWords: 4000,
          masteredWords: 50,
          learningWords: 100,
          newWords: 20,
          reviewDue: 30,
          todayProgress: 10,
        });
        setRecentWords([
          { id: 1, word: 'abandon', phonetic: '/əˈbændən/', meaning: '放弃，遗弃', status: 'LEARNING', lastReview: '2024-04-08' },
          { id: 2, word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力', status: 'REVIEWING', lastReview: '2024-04-07' },
          { id: 3, word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: '绝对的', status: 'MASTERED', lastReview: '2024-04-05' },
          { id: 4, word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: '学术的', status: 'LEARNING', lastReview: '2024-04-09' },
          { id: 5, word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: '完成', status: 'NEW', lastReview: null },
        ]);
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const statusColors: Record<string, string> = {
    NEW: 'bg-gray-100 text-gray-800',
    LEARNING: 'bg-blue-100 text-blue-800',
    REVIEWING: 'bg-yellow-100 text-yellow-800',
    MASTERED: 'bg-green-100 text-green-800',
  };

  const statusText: Record<string, string> = {
    NEW: '新词',
    LEARNING: '学习中',
    REVIEWING: '复习中',
    MASTERED: '已掌握',
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载词汇数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">词汇学习</h1>
        <p className="text-gray-600 mt-2">
          掌握高中英语核心词汇，提升词汇量和应用能力
        </p>
      </div>

      {/* 数据统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">总词汇量</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalWords}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>已掌握</span>
              <span>{Math.round((stats.masteredWords / stats.totalWords) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(stats.masteredWords / stats.totalWords) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日任务</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.newWords + stats.reviewDue}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.newWords}个新词 + {stats.reviewDue}个复习
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>今日进度</span>
              <span>{stats.todayProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${stats.todayProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">学习状态</p>
              <p className="text-3xl font-bold text-gray-900">{stats.learningWords}</p>
              <p className="text-sm text-gray-600 mt-1">正在学习的词汇</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-gray-900">{stats.masteredWords}</div>
              <div className="text-xs text-gray-600">已掌握</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-gray-900">{stats.reviewDue}</div>
              <div className="text-xs text-gray-600">待复习</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-lg font-bold text-gray-900">{stats.newWords}</div>
              <div className="text-xs text-gray-600">新词</div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/vocabulary/learn"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">➕</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">学习新词</h3>
            <p className="text-gray-600 mb-6">
              学习{stats.newWords}个新词汇，扩展你的词汇量
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">
              开始学习
            </div>
          </Link>

          <Link
            href="/vocabulary/review"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">复习词汇</h3>
            <p className="text-gray-600 mb-6">
              复习{stats.reviewDue}个到期词汇，巩固记忆
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium">
              开始复习
            </div>
          </Link>

          <Link
            href="/vocabulary/test"
            className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">词汇测试</h3>
            <p className="text-gray-600 mb-6">
              测试你的词汇掌握程度，发现薄弱环节
            </p>
            <div className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg font-medium">
              开始测试
            </div>
          </Link>
        </div>
      </div>

      {/* 最近学习记录 */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最近学习</h2>
          <Link
            href="/vocabulary/history"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            查看全部
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">单词</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">释义</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">状态</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">最后复习</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentWords.map((word) => (
                <tr key={word.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {word.word}
                      <button
                        onClick={() => speakWord(word.word)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition"
                        title="播放发音"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">{word.phonetic || '暂无音标'}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{word.meaning}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[word.status]}`}>
                      {statusText[word.status]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {word.lastReview ? new Date(word.lastReview).toLocaleDateString('zh-CN') : '未学习'}
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                      练习
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学习建议 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">学习建议</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">每天学习10-15个新词汇效果最佳</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">按照系统安排的复习时间进行复习</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">结合例句理解词汇用法</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">定期进行词汇测试检验学习效果</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">今日目标</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">学习新词</span>
                <span className="font-medium">{stats.newWords}个</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">复习词汇</span>
                <span className="font-medium">{stats.reviewDue}个</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">连续学习天数</span>
                <span className="font-medium">{user?.streak || 0}天</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${Math.min((user?.streak || 0) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}