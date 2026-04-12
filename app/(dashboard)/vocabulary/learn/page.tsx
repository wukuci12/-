'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { vocabularyData, getExtendedVocabulary } from '@/app/data/vocabulary';

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

interface VocabularyItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  level: string;
}

export default function LearnVocabularyPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [learnedWords, setLearnedWords] = useState<number[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);

  // 从数据文件获取词汇
  const allWords: VocabularyItem[] = vocabularyData.map(w => ({
    id: w.id,
    word: w.word,
    phonetic: w.phonetic,
    meaning: w.meaning,
    example: w.example,
    exampleTranslation: w.exampleTranslation,
    level: w.level
  }));

  // 获取当前批次的词汇（每批10个）
  const getCurrentBatchWords = () => {
    const start = currentBatch * 10;
    const end = start + 10;
    return allWords.slice(start, end);
  };

  useEffect(() => {
    setTimeout(() => {
      setWords(getCurrentBatchWords());
      setIsLoading(false);
    }, 500);
  }, [currentBatch]);

  const handleNextBatch = () => {
    setCurrentBatch(currentBatch + 1);
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const currentWord = words[currentIndex];

  const handleKnow = () => {
    if (!learnedWords.includes(currentWord.id)) {
      setLearnedWords([...learnedWords, currentWord.id]);
    }
    nextWord();
  };

  const handleDontKnow = () => {
    nextWord();
  };

  const nextWord = () => {
    setShowAnswer(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 当前批次学完了，显示继续学习按钮
      setShowAnswer(true);
    }
  };

  const isBatchComplete = currentIndex >= words.length - 1 && showAnswer;

  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载词汇中...</p>
        </div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">没有更多词汇可以学习</h2>
        <p className="text-gray-600 mb-8">您已经学习了所有可用的新词汇。</p>
        <Link
          href="/vocabulary"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回词汇学习
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 进度和导航 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            单词 {currentIndex + 1} / {words.length}
          </div>
          <div className="text-sm font-medium text-gray-900">
            {Math.round(progress)}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>已学习: {learnedWords.length}</span>
          <span>剩余: {words.length - currentIndex - 1}</span>
        </div>
      </div>

      {/* 词汇卡片 */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="p-8">
          {/* 单词和音标 */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
              {currentWord.word}
              <button
                onClick={() => speakWord(currentWord.word)}
                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition"
                title="播放发音"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
            </h1>
            <div className="text-xl text-gray-600 font-mono">{currentWord.phonetic}</div>
            <div className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentWord.level}
            </div>
          </div>

          {/* 答案区域 */}
          {showAnswer ? (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">释义</h3>
                <div className="text-2xl font-bold text-gray-900">{currentWord.meaning}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">例句</h3>
                <div className="space-y-3">
                  <div className="text-lg italic text-gray-800 border-l-4 border-indigo-500 pl-4 py-2 flex items-center gap-2">
                    {currentWord.example}
                    <button
                      onClick={() => speakWord(currentWord.example)}
                      className="p-1 text-indigo-600 hover:text-indigo-800 transition"
                      title="播放例句"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-gray-600 border-l-4 border-gray-300 pl-4 py-2">
                    {currentWord.exampleTranslation}
                  </div>
                </div>
              </div>

              {/* 记忆提示 */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">记忆提示</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>关联记忆：将单词与个人经历或图像关联</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>词根分析：分析单词构成，理解词源</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>造句练习：尝试用单词造自己的句子</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">点击下方按钮查看单词释义和例句</div>
              <button
                onClick={() => setShowAnswer(true)}
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium text-lg"
              >
                显示答案
              </button>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          {isBatchComplete ? (
            <div className="text-center">
              <p className="text-xl font-bold text-green-600 mb-4">恭喜完成本轮学习！</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/vocabulary/learn/completed')}
                  className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg transition"
                >
                  查看学习结果
                </button>
                <button
                  onClick={handleNextBatch}
                  className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-lg transition"
                >
                  继续学习下一组
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              {showAnswer ? (
                <>
                  <button
                    onClick={handleDontKnow}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-lg transition"
                  >
                    还需要练习
                  </button>
                  <button
                    onClick={handleKnow}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg transition"
                  >
                    已经掌握
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-lg transition"
                >
                  显示答案
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 学习统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900">{learnedWords.length}</div>
          <div className="text-gray-600">本次已掌握</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900">{words.length - currentIndex - 1}</div>
          <div className="text-gray-600">剩余单词</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="text-3xl font-bold text-gray-900">
            {Math.round((learnedWords.length / words.length) * 100)}%
          </div>
          <div className="text-gray-600">掌握率</div>
        </div>
      </div>

      {/* 学习提示 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">学习建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">有效记忆策略</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>大声朗读单词和例句</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>观察单词的词根和前缀后缀</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>将单词与已知词汇关联</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">复习计划</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">⏰</span>
                <span>今日学习的单词将在24小时后复习</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">⏰</span>
                <span>3天后进行第二次复习</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">⏰</span>
                <span>一周后进行第三次复习</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        <Link
          href="/vocabulary"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          返回词汇学习
        </Link>
        <div className="text-sm text-gray-600">
          按空格键可以快速显示/隐藏答案
        </div>
      </div>
    </div>
  );
}