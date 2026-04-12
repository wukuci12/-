'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TestQuestion {
  id: string;
  type: 'READING' | 'REPEATING' | 'RESPONDING' | 'TOPIC';
  question: string;
  description: string;
  duration: number;
  score: number;
}

interface SpeakingTest {
  id: string;
  title: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  questions: TestQuestion[];
  totalTime: number;
}

const speakingTests: Record<string, SpeakingTest> = {
  BEGINNER: {
    id: 'test-beginner',
    title: '初级口语测试',
    difficulty: 'BEGINNER',
    totalTime: 300,
    questions: [
      {
        id: 'q1',
        type: 'READING',
        question: 'Read the following sentence aloud.',
        description: 'Please read this sentence clearly and with correct pronunciation.',
        duration: 30,
        score: 10,
      },
      {
        id: 'q2',
        type: 'REPEATING',
        question: 'Repeat after the speaker.',
        description: 'Listen carefully and repeat exactly what you hear.',
        duration: 20,
        score: 10,
      },
      {
        id: 'q3',
        type: 'RESPONDING',
        question: 'Answer the question.',
        description: 'Please answer the following question in 2-3 sentences.',
        duration: 45,
        score: 15,
      },
      {
        id: 'q4',
        type: 'TOPIC',
        question: 'Talk about your family.',
        description: 'Please talk about your family for about 30 seconds.',
        duration: 45,
        score: 15,
      },
    ],
  },
  INTERMEDIATE: {
    id: 'test-intermediate',
    title: '中级口语测试',
    difficulty: 'INTERMEDIATE',
    totalTime: 420,
    questions: [
      {
        id: 'q1',
        type: 'READING',
        question: 'Read the following passage aloud.',
        description: 'Read this short paragraph with good pronunciation and intonation.',
        duration: 45,
        score: 10,
      },
      {
        id: 'q2',
        type: 'RESPONDING',
        question: 'Answer the question.',
        description: 'Please give a detailed answer to the following question.',
        duration: 60,
        score: 15,
      },
      {
        id: 'q3',
        type: 'TOPIC',
        question: 'Describe a memorable trip.',
        description: 'Please describe a memorable trip you have taken.',
        duration: 90,
        score: 20,
      },
      {
        id: 'q4',
        type: 'RESPONDING',
        question: 'Give your opinion.',
        description: 'Do you think students should wear school uniforms? Why or why not?',
        duration: 75,
        score: 15,
      },
    ],
  },
  ADVANCED: {
    id: 'test-advanced',
    title: '高级口语测试',
    difficulty: 'ADVANCED',
    totalTime: 540,
    questions: [
      {
        id: 'q1',
        type: 'READING',
        question: 'Read the following text aloud.',
        description: 'Read this academic text with professional pronunciation.',
        duration: 60,
        score: 10,
      },
      {
        id: 'q2',
        type: 'RESPONDING',
        question: 'Analyze this situation.',
        description: 'What are the pros and cons of working from home?',
        duration: 90,
        score: 15,
      },
      {
        id: 'q3',
        type: 'TOPIC',
        question: 'Present your argument.',
        description: 'Is technology making us more isolated or more connected? Present your views.',
        duration: 120,
        score: 25,
      },
      {
        id: 'q4',
        type: 'RESPONDING',
        question: 'Discuss the topic.',
        description: 'How can we better protect the environment in our daily lives?',
        duration: 90,
        score: 15,
      },
      {
        id: 'q5',
        type: 'TOPIC',
        question: 'Future planning.',
        description: 'Where do you see yourself in 10 years? Describe your career goals.',
        duration: 90,
        score: 15,
      },
    ],
  },
};

interface TestResult {
  testId: string;
  title: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  feedback: {
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
    overall: string;
  };
  answers: Record<string, { recorded: boolean; score: number }>;
}

export default function SpeakingTestPage() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [testStarted, setTestStarted] = useState(false);
  const [currentTest, setCurrentTest] = useState<SpeakingTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [questionTime, setQuestionTime] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { recorded: boolean; score: number }>>({});
  const [showResult, setShowResult] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testStarted && currentTest && isRecording) {
      const question = currentTest.questions[currentQuestionIndex];
      timerRef.current = setInterval(() => {
        setQuestionTime((prev) => {
          if (prev >= question.duration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, currentTest, isRecording, currentQuestionIndex]);

  const startTest = () => {
    const test = speakingTests[selectedDifficulty];
    setCurrentTest(test);
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setQuestionTime(0);
    setAnswers({});
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      // 继续模拟
    }
    setIsRecording(true);
    setQuestionTime(0);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    // 模拟评分
    const score = Math.round(60 + Math.random() * 30);
    setAnswers((prev) => ({
      ...prev,
      [currentTest?.questions[currentQuestionIndex].id || '']: {
        recorded: true,
        score,
      },
    }));
  };

  const nextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTime(0);
      setIsRecording(false);
    }
  };

  const submitTest = () => {
    if (!currentTest) return;

    const result: TestResult = {
      testId: `speaking-test-${Date.now()}`,
      title: currentTest.title,
      score: Math.round(Object.values(answers).reduce((sum, a) => sum + a.score, 0) / currentTest.questions.length),
      passed: true,
      timeSpent: currentTest.totalTime,
      completedAt: new Date().toISOString(),
      feedback: {
        pronunciation: Math.round(70 + Math.random() * 20),
        fluency: Math.round(70 + Math.random() * 20),
        vocabulary: Math.round(70 + Math.random() * 20),
        grammar: Math.round(70 + Math.random() * 20),
        overall: '良好',
      },
      answers,
    };

    localStorage.setItem('latestSpeakingTestResult', JSON.stringify(result));
    setShowResult(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyInfo = {
    BEGINNER: { name: '初级', time: '5分钟', desc: '基础口语能力测试' },
    INTERMEDIATE: { name: '中级', time: '7分钟', desc: '中级口语能力测试' },
    ADVANCED: { name: '高级', time: '9分钟', desc: '高级口语能力测试' },
  };

  const questionTypeText: Record<string, string> = {
    READING: '朗读',
    REPEATING: '跟读',
    RESPONDING: '回答问题',
    TOPIC: '主题演讲',
  };

  // 结果页面
  if (showResult) {
    const resultStr = localStorage.getItem('latestSpeakingTestResult');
    const result: TestResult = resultStr ? JSON.parse(resultStr) : null;

    if (result) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">口语测试完成</h1>
              <div className={`inline-block px-6 py-3 rounded-full font-bold text-xl ${
                result.passed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {result.passed ? '🎉 测试通过!' : '💪 继续努力'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 text-center">
                <div className="text-sm opacity-90 mb-2">总分</div>
                <div className="text-5xl font-bold">{result.score}</div>
                <div className="text-lg mt-2 opacity-90">/ 100</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600">能力评估</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">发音</span>
                    <span className="font-bold">{result.feedback.pronunciation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">流利度</span>
                    <span className="font-bold">{result.feedback.fluency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">词汇</span>
                    <span className="font-bold">{result.feedback.vocabulary}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">语法</span>
                    <span className="font-bold">{result.feedback.grammar}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">测试总结</h3>
              <p className="text-gray-700">
                你的口语水平整体评价为<span className="font-bold text-indigo-600">{result.feedback.overall}</span>。
                {result.score >= 80 && '发音清晰流畅，语言表达自然。'}
                {result.score >= 60 && result.score < 80 && '基本能够用英语表达想法，可进一步提升流利度。'}
                {result.score < 60 && '建议加强基础练习，多听多说。'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/speaking/test"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium text-center"
              >
                再测一次
              </Link>
              <Link
                href="/speaking/practice"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-center"
              >
                口语练习
              </Link>
              <Link
                href="/speaking"
                className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium text-center"
              >
                返回主页
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // 测试选择页面
  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">口语能力测试</h1>
            <p className="text-gray-600">
              测试你的英语口语水平，获得详细的能力评估报告
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedDifficulty === level
                    ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    selectedDifficulty === level ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {difficultyInfo[level].name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {difficultyInfo[level].desc}
                  </div>
                  <div className="text-sm text-gray-500">
                    预计时间: {difficultyInfo[level].time}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-start">
              <span className="text-red-600 mr-3 text-xl">⚠️</span>
              <div>
                <h3 className="font-medium text-red-800">测试须知</h3>
                <ul className="text-sm text-red-700 mt-2 space-y-1">
                  <li>• 请在安静的环境中进行测试</li>
                  <li>• 确保麦克风正常工作</li>
                  <li>• 每道题有指定时间，请注意控制</li>
                  <li>• 达到60分即可通过测试</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              className="px-12 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
            >
              开始测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 测试进行中
  if (currentTest) {
    const currentQuestion = currentTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto">
        {/* 进度 */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900">
                问题 {currentQuestionIndex + 1} / {currentTest.questions.length}
              </span>
              <span className="ml-4 text-gray-500">
                {questionTypeText[currentQuestion.type]}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${
              questionTime >= currentQuestion.duration ? 'bg-red-100 text-red-600' :
              questionTime >= currentQuestion.duration * 0.8 ? 'bg-yellow-100 text-yellow-600' :
              'bg-blue-100 text-blue-600'
            }`}>
              {formatTime(questionTime)} / {formatTime(currentQuestion.duration)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* 问题 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isRecording
                ? 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse'
                : 'bg-gradient-to-br from-gray-200 to-gray-300'
            }`}>
              <span className="text-4xl">🎤</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.question}</h2>
            <p className="text-gray-600 mb-6">{currentQuestion.description}</p>
          </div>

          {/* 录音控制 */}
          <div className="text-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
              >
                🎙️ 开始答题
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:opacity-90 font-bold text-lg"
              >
                ⏹️ 停止录音
              </button>
            )}
          </div>
        </div>

        {/* 导航 */}
        <div className="flex justify-between">
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setTestStarted(false);
              setCurrentTest(null);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            退出测试
          </button>

          <div className="space-x-4">
            {answers[currentQuestion.id] && (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {currentQuestionIndex < currentTest.questions.length - 1 ? '下一题 →' : '完成测试'}
              </button>
            )}
          </div>
        </div>

        {/* 题目列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-4">题目列表</h3>
          <div className="grid grid-cols-5 gap-2">
            {currentTest.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  if (answers[q.id]) {
                    setCurrentQuestionIndex(idx);
                    setQuestionTime(0);
                    setIsRecording(false);
                  }
                }}
                className={`p-3 rounded-lg text-sm font-medium transition ${
                  idx === currentQuestionIndex
                    ? 'bg-indigo-600 text-white'
                    : answers[q.id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
                disabled={!answers[q.id]}
              >
                {idx + 1}. {questionTypeText[q.type]}
              </button>
            ))}
          </div>

          {currentQuestionIndex === currentTest.questions.length - 1 &&
           Object.keys(answers).length === currentTest.questions.length && (
            <div className="mt-4 text-center">
              <button
                onClick={submitTest}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-bold"
              >
                提交测试
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
