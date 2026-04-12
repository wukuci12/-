'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface WritingPrompt {
  id: string;
  title: string;
  description: string;
  type: 'NARRATIVE' | 'EXPOSITORY' | 'ARGUMENTATIVE' | 'PRACTICAL';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  wordRequirement: { min: number; max: number };
  tips: string[];
  example?: string;
}

interface WritingState {
  prompt: WritingPrompt;
  content: string;
  wordCount: number;
  startTime: number;
  isSubmitting: boolean;
  autoSaveTime: number;
}

const writingPrompts: WritingPrompt[] = [
  {
    id: 'narrative-1',
    title: 'A Memorable Trip',
    description: 'Write about a memorable trip you have taken. Describe the place, the people, and what made it special.',
    type: 'NARRATIVE',
    difficulty: 'BEGINNER',
    wordRequirement: { min: 150, max: 200 },
    tips: ['Use past tense consistently', 'Include sensory details', 'Describe your emotions'],
    example: 'Last summer, my family and I visited the beautiful coastal city of Qingdao...',
  },
  {
    id: 'narrative-2',
    title: 'An Unforgettable Experience',
    description: 'Write about an experience that changed your life or taught you an important lesson.',
    type: 'NARRATIVE',
    difficulty: 'INTERMEDIATE',
    wordRequirement: { min: 200, max: 300 },
    tips: ['Use chronological order', 'Include dialogue', 'Reflect on the experience'],
    example: 'It was a rainy afternoon when I first discovered my passion for reading...',
  },
  {
    id: 'expository-1',
    title: 'How to Stay Healthy',
    description: 'Explain the best ways to maintain good health. Include diet, exercise, and lifestyle tips.',
    type: 'EXPOSITORY',
    difficulty: 'BEGINNER',
    wordRequirement: { min: 150, max: 200 },
    tips: ['Use logical organization', 'Provide specific tips', 'Include reasons for each suggestion'],
    example: 'Maintaining good health is essential for a happy life. Here are some effective ways to stay healthy...',
  },
  {
    id: 'expository-2',
    title: 'The Benefits of Learning English',
    description: 'Explain why learning English is important in today\'s world.',
    type: 'EXPOSITORY',
    difficulty: 'INTERMEDIATE',
    wordRequirement: { min: 200, max: 300 },
    tips: ['Use supporting examples', 'Structure from general to specific', 'Address different aspects'],
    example: 'English has become the global language of communication...',
  },
  {
    id: 'argumentative-1',
    title: 'Technology in Education',
    description: 'Discuss the role of technology in modern education. Is it more beneficial or harmful?',
    type: 'ARGUMENTATIVE',
    difficulty: 'ADVANCED',
    wordRequirement: { min: 300, max: 400 },
    tips: ['Provide balanced arguments', 'Use specific examples', 'Draw conclusions', 'Consider multiple perspectives'],
    example: 'In the 21st century, technology has transformed every aspect of our lives, including education...',
  },
  {
    id: 'argumentative-2',
    title: 'Should Students Wear Uniforms?',
    description: 'Discuss whether students should be required to wear school uniforms. Present arguments for both sides.',
    type: 'ARGUMENTATIVE',
    difficulty: 'INTERMEDIATE',
    wordRequirement: { min: 200, max: 300 },
    tips: ['Present clear stance', 'Support with evidence', 'Address counterarguments', 'Use formal language'],
    example: 'The debate about school uniforms has been ongoing for years. While some argue that uniforms promote equality...',
  },
  {
    id: 'practical-1',
    title: 'A Letter to a Friend',
    description: 'Write a letter to your friend describing your recent school life and inviting them to visit.',
    type: 'PRACTICAL',
    difficulty: 'BEGINNER',
    wordRequirement: { min: 100, max: 150 },
    tips: ['Use appropriate salutation', 'Organize thoughts logically', 'Use friendly tone', 'Include closing'],
    example: 'Dear Tom, I hope this letter finds you in good health...',
  },
  {
    id: 'practical-2',
    title: 'Application for a Part-time Job',
    description: 'Write a formal application letter for a part-time job at a local restaurant.',
    type: 'PRACTICAL',
    difficulty: 'INTERMEDIATE',
    wordRequirement: { min: 150, max: 200 },
    tips: ['Use formal language', 'Highlight relevant skills', 'Be concise and professional', 'Include contact information'],
    example: 'Dear Hiring Manager, I am writing to apply for the part-time position...',
  },
];

export default function WritingPracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('prompt');

  const [writing, setWriting] = useState<WritingState | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(null);
  const [content, setContent] = useState('');
  const [showPromptSelector, setShowPromptSelector] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (promptId) {
      const prompt = writingPrompts.find((p) => p.id === promptId);
      if (prompt) {
        setSelectedPrompt(prompt);
        setShowPromptSelector(false);
      }
    }
  }, [promptId]);

  // 自动保存功能
  useEffect(() => {
    if (content && selectedPrompt && !showPromptSelector) {
      const timer = setTimeout(() => {
        localStorage.setItem('writingDraft', JSON.stringify({
          promptId: selectedPrompt.id,
          content,
          timestamp: Date.now(),
        }));
        setLastSaved(new Date());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, selectedPrompt, showPromptSelector]);

  const selectPrompt = (prompt: WritingPrompt) => {
    setSelectedPrompt(prompt);
    setContent('');
    setShowPromptSelector(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = useCallback(() => {
    if (!selectedPrompt || !content.trim()) return;

    const result = {
      id: `writing-${Date.now()}`,
      title: selectedPrompt.title,
      type: selectedPrompt.type,
      difficulty: selectedPrompt.difficulty,
      content: content.trim(),
      wordCount,
      promptId: selectedPrompt.id,
      completedAt: new Date().toISOString(),
      timeSpent: Math.floor((Date.now() - (writing?.startTime || Date.now())) / 1000),
    };

    // 保存结果
    localStorage.setItem('latestWritingResult', JSON.stringify(result));

    // 清除草稿
    localStorage.removeItem('writingDraft');

    // 跳转到结果页面
    router.push('/writing/completed');
  }, [selectedPrompt, content, wordCount, router, writing?.startTime]);

  const startWriting = () => {
    if (!selectedPrompt) return;
    setWriting({
      prompt: selectedPrompt,
      content: '',
      wordCount: 0,
      startTime: Date.now(),
      isSubmitting: false,
      autoSaveTime: Date.now(),
    });
  };

  const goBack = () => {
    if (content.trim()) {
      if (!confirm('确定要退出吗？未保存的内容将会丢失。')) {
        return;
      }
    }
    localStorage.removeItem('writingDraft');
    router.push('/writing');
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

  if (showPromptSelector) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">写作练习</h1>
              <p className="text-gray-600 mt-2">选择一个写作话题开始练习</p>
            </div>
            <Link
              href="/writing"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← 返回
            </Link>
          </div>
        </div>

        {/* 话题分类 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(['NARRATIVE', 'EXPOSITORY', 'ARGUMENTATIVE', 'PRACTICAL'] as const).map((type) => (
            <div key={type} className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-bold text-gray-900 mb-2">{typeText[type]}</h3>
              <p className="text-sm text-gray-600">
                {writingPrompts.filter((p) => p.type === type).length} 个话题
              </p>
            </div>
          ))}
        </div>

        {/* 话题列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {writingPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => selectPrompt(prompt)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{prompt.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[prompt.difficulty]}`}>
                    {prompt.difficulty === 'BEGINNER' ? '初级' : prompt.difficulty === 'INTERMEDIATE' ? '中级' : '高级'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{prompt.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  词数要求: {prompt.wordRequirement.min}-{prompt.wordRequirement.max}词
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 font-medium">
                    {typeText[prompt.type]}
                  </span>
                  <span className="text-indigo-600">选择 →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedPrompt) return null;

  const isWordCountValid = wordCount >= selectedPrompt.wordRequirement.min;

  return (
    <div className="max-w-6xl mx-auto">
      {/* 顶部导航 */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 退出
            </button>
            <div className="text-gray-400">|</div>
            <div>
              <h2 className="font-bold text-gray-900">{selectedPrompt.title}</h2>
              <p className="text-sm text-gray-600">{typeText[selectedPrompt.type]}</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">当前词数</div>
              <div className={`text-xl font-bold ${isWordCountValid ? 'text-green-600' : 'text-orange-600'}`}>
                {wordCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">要求词数</div>
              <div className="text-xl font-bold text-gray-900">
                {selectedPrompt.wordRequirement.min}-{selectedPrompt.wordRequirement.max}
              </div>
            </div>
            {lastSaved && (
              <div className="text-sm text-gray-500">
                已保存 {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* 词数进度 */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                isWordCountValid ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{
                width: `${Math.min((wordCount / selectedPrompt.wordRequirement.max) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 写作区域 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* 题目提示 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2">写作要求</h3>
              <p className="text-gray-700 mb-4">{selectedPrompt.description}</p>
              {selectedPrompt.example && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="text-sm text-gray-500 mb-1">开头示例:</div>
                  <p className="text-gray-600 italic">{selectedPrompt.example}</p>
                </div>
              )}
            </div>

            {/* 写作区域 */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="请在这里输入你的作文..."
              className="w-full h-96 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-800 leading-relaxed"
              disabled={!writing}
            />

            {/* 提示按钮 */}
            <div className="mt-4">
              <button
                onClick={() => setShowTips(!showTips)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showTips ? '隐藏写作提示' : '显示写作提示'}
              </button>
              {showTips && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2">写作提示:</h4>
                  <ul className="space-y-1">
                    {selectedPrompt.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="text-yellow-500 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            {!writing ? (
              <div className="mt-6 text-center">
                <button
                  onClick={startWriting}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg"
                >
                  开始写作
                </button>
              </div>
            ) : (
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    localStorage.setItem('writingDraft', JSON.stringify({
                      promptId: selectedPrompt.id,
                      content,
                      timestamp: Date.now(),
                    }));
                    alert('草稿已保存');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  保存草稿
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isWordCountValid || !content.trim()}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    isWordCountValid && content.trim()
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  提交批改
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h3 className="font-bold text-gray-900 mb-4">评分标准</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">内容完整度</span>
                  <span className="font-medium">25分</span>
                </div>
                <div className="text-xs text-gray-500">主题明确，内容丰富</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">文章结构</span>
                  <span className="font-medium">25分</span>
                </div>
                <div className="text-xs text-gray-500">层次清晰，逻辑连贯</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">语言表达</span>
                  <span className="font-medium">30分</span>
                </div>
                <div className="text-xs text-gray-500">词汇丰富，句式多样</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">语法准确性</span>
                  <span className="font-medium">20分</span>
                </div>
                <div className="text-xs text-gray-500">语法正确，拼写准确</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">注意事项</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  确保达到最低词数要求
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  不要复制他人作品
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  注意段落格式
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  使用恰当的时态和人称
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  const prompt = writingPrompts.find((p) => p.id !== selectedPrompt.id);
                  if (prompt) selectPrompt(prompt);
                }}
                className="w-full py-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                换一个话题 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
