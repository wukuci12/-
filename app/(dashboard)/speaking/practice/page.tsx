'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SpeakingTopic {
  id: string;
  title: string;
  description: string;
  type: 'DIALOGUE' | 'MONOLOGUE' | 'DISCUSSION';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // 秒
  vocabulary: string[];
  prompts?: string[];
}

const speakingTopics: SpeakingTopic[] = [
  {
    id: 'dialogue-1',
    title: 'At the Restaurant',
    description: 'Practice ordering food and having a conversation at a restaurant.',
    type: 'DIALOGUE',
    difficulty: 'BEGINNER',
    duration: 180,
    vocabulary: ['order', 'menu', 'recommend', 'delicious', 'bill'],
    prompts: [
      'Welcome to our restaurant! May I take your order?',
      'Could you recommend something special?',
      'I would like to have...',
      'How would you like your steak cooked?',
    ],
  },
  {
    id: 'dialogue-2',
    title: 'Asking for Directions',
    description: 'Practice asking for and giving directions in a city.',
    type: 'DIALOGUE',
    difficulty: 'BEGINNER',
    duration: 180,
    vocabulary: ['turn left', 'turn right', 'intersection', 'block', 'landmark'],
  },
  {
    id: 'dialogue-3',
    title: 'Job Interview',
    description: 'Practice common interview questions and answers.',
    type: 'DIALOGUE',
    difficulty: 'INTERMEDIATE',
    duration: 240,
    vocabulary: ['experience', 'qualification', 'strength', 'challenge', 'career'],
    prompts: [
      'Tell me about yourself.',
      'What are your strengths?',
      'Why do you want this job?',
      'Where do you see yourself in 5 years?',
    ],
  },
  {
    id: 'monologue-1',
    title: 'My Daily Routine',
    description: 'Describe your typical day from morning to evening.',
    type: 'MONOLOGUE',
    difficulty: 'BEGINNER',
    duration: 120,
    vocabulary: ['morning', 'routine', 'schedule', 'productive', 'relax'],
    prompts: [
      'I usually wake up at...',
      'In the morning, I...',
      'After school/work, I...',
      'Before going to bed, I...',
    ],
  },
  {
    id: 'monologue-2',
    title: 'My Hobbies',
    description: 'Talk about your hobbies and why you enjoy them.',
    type: 'MONOLOGUE',
    difficulty: 'INTERMEDIATE',
    duration: 150,
    vocabulary: ['hobby', 'passion', 'interest', 'leisure', 'benefit'],
    prompts: [
      'My favorite hobby is...',
      'I started this hobby when...',
      'The thing I enjoy most is...',
      'This hobby helps me...',
    ],
  },
  {
    id: 'monologue-3',
    title: 'Environmental Protection',
    description: 'Discuss the importance of environmental protection.',
    type: 'MONOLOGUE',
    difficulty: 'ADVANCED',
    duration: 180,
    vocabulary: ['climate change', 'sustainable', 'recycle', 'pollution', 'ecosystem'],
  },
  {
    id: 'discussion-1',
    title: 'Online Learning vs. Traditional Learning',
    description: 'Compare and discuss online learning and traditional classroom learning.',
    type: 'DISCUSSION',
    difficulty: 'INTERMEDIATE',
    duration: 240,
    vocabulary: ['flexibility', 'interaction', 'technology', 'self-discipline', 'resources'],
  },
  {
    id: 'discussion-2',
    title: 'Should Mobile Phones Be Banned in Schools?',
    description: 'Debate and discuss the use of mobile phones in schools.',
    type: 'DISCUSSION',
    difficulty: 'ADVANCED',
    duration: 300,
    vocabulary: ['distraction', 'concentration', 'academic', 'regulate', 'benefit'],
  },
];

export default function SpeakingPracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');

  const [isRecording, setIsRecording] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<SpeakingTopic | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (typeParam === 'monologue' && showTopics) {
      const monologueTopic = speakingTopics.find((t) => t.type === 'MONOLOGUE');
      if (monologueTopic) {
        setSelectedTopic(monologueTopic);
        setShowTopics(false);
      }
    }
  }, [typeParam, showTopics]);

  // 计时器
  useEffect(() => {
    if (isRecording && selectedTopic) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= selectedTopic.duration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, selectedTopic]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setIsRecording(true);
      setRecordingTime(0);
      setSessionStarted(true);
    } catch (error) {
      // 模拟录音模式
      setIsRecording(true);
      setRecordingTime(0);
      setSessionStarted(true);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (selectedTopic) {
      // 模拟AI评估
      simulateEvaluation();
    }
  }, [selectedTopic]);

  const simulateEvaluation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const result = {
        id: `speaking-${Date.now()}`,
        topic: selectedTopic?.title || '',
        type: selectedTopic?.type || 'DIALOGUE',
        score: Math.round(70 + Math.random() * 20),
        duration: recordingTime,
        completedAt: new Date().toISOString(),
        feedback: {
          pronunciation: Math.round(75 + Math.random() * 20),
          fluency: Math.round(70 + Math.random() * 20),
          vocabulary: Math.round(75 + Math.random() * 20),
          grammar: Math.round(70 + Math.random() * 20),
          suggestions: [
            'Try to speak more slowly and clearly',
            'Practice pronouncing difficult sounds',
            'Use more varied sentence structures',
          ],
        },
      };

      localStorage.setItem('latestSpeakingResult', JSON.stringify(result));
      setIsSimulating(false);
      router.push('/speaking/completed');
    }, 2000);
  };

  const selectTopic = (topic: SpeakingTopic) => {
    setSelectedTopic(topic);
    setShowTopics(false);
    setCurrentPromptIndex(0);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const typeText: Record<string, string> = {
    DIALOGUE: '对话练习',
    MONOLOGUE: '独白练习',
    DISCUSSION: '话题讨论',
  };

  const difficultyText: Record<string, string> = {
    BEGINNER: '初级',
    INTERMEDIATE: '中级',
    ADVANCED: '高级',
  };

  const typeColors: Record<string, string> = {
    DIALOGUE: 'bg-blue-100 text-blue-800',
    MONOLOGUE: 'bg-purple-100 text-purple-800',
    DISCUSSION: 'bg-green-100 text-green-800',
  };

  const difficultyColors: Record<string, string> = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-red-100 text-red-800',
  };

  if (isSimulating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI正在评估你的表现...</p>
        </div>
      </div>
    );
  }

  if (showTopics) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">口语练习</h1>
              <p className="text-gray-600 mt-2">选择一个话题开始练习</p>
            </div>
            <Link
              href="/speaking"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← 返回
            </Link>
          </div>
        </div>

        {/* 类型选择 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['DIALOGUE', 'MONOLOGUE', 'DISCUSSION'] as const).map((type) => (
            <div key={type} className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-bold text-gray-900 mb-2">{typeText[type]}</h3>
              <p className="text-sm text-gray-600">
                {speakingTopics.filter((t) => t.type === type).length} 个话题
              </p>
            </div>
          ))}
        </div>

        {/* 话题列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakingTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => selectTopic(topic)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[topic.type]}`}>
                  {typeText[topic.type]}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{topic.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[topic.difficulty]}`}>
                  {difficultyText[topic.difficulty]}
                </span>
                <span className="text-gray-500">
                  约 {Math.floor(topic.duration / 60)} 分钟
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedTopic) return null;

  const progress = (recordingTime / selectedTopic.duration) * 100;
  const prompt = selectedTopic.prompts?.[currentPromptIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* 顶部信息 */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (sessionStarted && !confirm('确定要退出吗？')) return;
                setSelectedTopic(null);
                setShowTopics(true);
                setSessionStarted(false);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 退出
            </button>
            <div className="text-gray-400">|</div>
            <div>
              <h2 className="font-bold text-gray-900">{selectedTopic.title}</h2>
              <p className="text-sm text-gray-600">{typeText[selectedTopic.type]}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">录音时间</div>
              <div className={`text-xl font-bold ${recordingTime >= selectedTopic.duration ? 'text-red-600' : 'text-gray-900'}`}>
                {formatTime(recordingTime)} / {formatTime(selectedTopic.duration)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                progress >= 100 ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 话题和提示 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">话题描述</h3>
          <p className="text-gray-700 mb-6">{selectedTopic.description}</p>

          {/* 词汇提示 */}
          {selectedTopic.vocabulary.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">相关词汇</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTopic.vocabulary.map((word, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 对话提示 */}
          {prompt && (
            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-bold text-green-800 mb-3">💡 表达提示</h4>
              <p className="text-green-700 italic">{prompt}</p>
            </div>
          )}
        </div>

        {/* 录音区域 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            {/* 录音动画 */}
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isRecording
                ? 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse'
                : 'bg-gradient-to-br from-gray-200 to-gray-300'
            }`}>
              <span className="text-5xl">🎤</span>
            </div>

            {/* 录音状态 */}
            <div className="mb-6">
              {isRecording ? (
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2">录音中...</div>
                  <div className="text-xl text-gray-600">{formatTime(recordingTime)}</div>
                </div>
              ) : sessionStarted ? (
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">录音完成</div>
                  <div className="text-gray-600">点击下方按钮提交评估</div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">准备就绪</div>
                  <div className="text-gray-600">点击开始录音</div>
                </div>
              )}
            </div>

            {/* 控制按钮 */}
            <div className="space-y-4">
              {!sessionStarted ? (
                <button
                  onClick={startRecording}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
                >
                  🎙️ 开始录音
                </button>
              ) : isRecording ? (
                <button
                  onClick={stopRecording}
                  className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
                >
                  ⏹️ 停止录音
                </button>
              ) : (
                <button
                  onClick={simulateEvaluation}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
                >
                  📊 提交评估
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-3 text-xl">💡</span>
          <div>
            <h3 className="font-medium text-yellow-800">练习提示</h3>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• 请在安静的环境中进行练习</li>
              <li>• 说话时尽量清晰、自然</li>
              <li>• 可以使用页面上的词汇和提示</li>
              <li>• 录音时间到达后会自动停止</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
