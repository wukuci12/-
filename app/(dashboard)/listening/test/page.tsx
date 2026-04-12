'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 发音函数
const speakText = (text: string, onEnd?: () => void, rate: number = 0.9) => {
  if (typeof window === 'undefined') {
    console.log('window is undefined');
    return;
  }

  const synth = window.speechSynthesis;
  if (!synth) {
    console.log('speechSynthesis not available');
    return;
  }

  try {
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // 添加错误处理
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance error:', event);
      if (onEnd) onEnd();
    };

    utterance.onend = () => {
      console.log('SpeechSynthesisUtterance ended');
      if (onEnd) onEnd();
    };

    // 获取语音列表
    const voices = synth.getVoices();
    console.log('Available voices:', voices.length);

    if (voices.length === 0) {
      console.log('No voices available, trying to load voices');
      // 如果语音列表为空，尝试等待voiceschanged事件
      synth.onvoiceschanged = () => {
        console.log('voiceschanged event fired');
        const loadedVoices = synth.getVoices();
        if (loadedVoices.length > 0) {
          const enVoice = loadedVoices.find(v => v.lang.startsWith('en')) || loadedVoices[0];
          if (enVoice) utterance.voice = enVoice;
          console.log('Using voice:', enVoice?.name);
          synth.speak(utterance);
        } else {
          console.error('No voices available after voiceschanged event');
        }
        synth.onvoiceschanged = null;
      };
      return;
    }

    const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (enVoice) {
      utterance.voice = enVoice;
      console.log('Using voice:', enVoice.name);
    }

    console.log('Speaking text:', text, 'with rate:', rate);
    synth.speak(utterance);
  } catch (error) {
    console.error('Error in speakText:', error);
    if (onEnd) onEnd();
  }
};

interface TestQuestion {
  id: string;
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number;
  section: 'CONVERSATION' | 'NEWS' | 'LECTURE';
}

interface ListeningTest {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalDuration: number; // 分钟
  sections: {
    type: 'CONVERSATION' | 'NEWS' | 'LECTURE';
    title: string;
    description: string;
    questionCount: number;
    timeLimit: number; // 分钟
  }[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  points: number;
  passingScore: number;
}

export default function ListeningTestPage() {
  const router = useRouter();
  const [test, setTest] = useState<ListeningTest | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('CONVERSATION');
  const [sectionStartTime, setSectionStartTime] = useState<number>(0);
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState<number>(0);
  const [overallTimeRemaining, setOverallTimeRemaining] = useState<number>(0);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, []);

  // 模拟测试数据
  useEffect(() => {
    setTimeout(() => {
      const mockTest: ListeningTest = {
        id: 'test-001',
        title: '高中英语听力综合测试',
        description: '包含对话、新闻、讲座三种听力类型，全面测试英语听力能力',
        totalQuestions: 15,
        totalDuration: 45, // 45分钟
        sections: [
          {
            type: 'CONVERSATION',
            title: '对话理解',
            description: '听短对话，回答相关问题',
            questionCount: 5,
            timeLimit: 15
          },
          {
            type: 'NEWS',
            title: '新闻听力',
            description: '听新闻片段，回答相关问题',
            questionCount: 5,
            timeLimit: 15
          },
          {
            type: 'LECTURE',
            title: '讲座理解',
            description: '听学术讲座片段，回答相关问题',
            questionCount: 5,
            timeLimit: 15
          }
        ],
        difficulty: 'INTERMEDIATE',
        points: 50,
        passingScore: 70
      };

      const mockQuestions: TestQuestion[] = [
        // 对话部分 (1-5)
        {
          id: 'c1',
          audioText: "I'm thinking about taking a photography class next semester.",
          question: "What does the woman want to do?",
          options: [
            "Take a photography class",
            "Buy a new camera",
            "Visit a photography exhibition",
            "Learn painting instead"
          ],
          correctAnswer: 0,
          explanation: "女士说'I'm thinking about taking a photography class'，意思是考虑参加摄影课程。",
          difficulty: 'EASY',
          timeLimit: 30,
          section: 'CONVERSATION'
        },
        {
          id: 'c2',
          audioText: "The meeting has been rescheduled to 3 PM tomorrow.",
          question: "What time is the meeting now?",
          options: [
            "3 PM tomorrow",
            "2 PM today",
            "4 PM tomorrow",
            "10 AM tomorrow"
          ],
          correctAnswer: 0,
          explanation: "会议重新安排到明天下午3点。",
          difficulty: 'EASY',
          timeLimit: 25,
          section: 'CONVERSATION'
        },
        {
          id: 'c3',
          audioText: "I'd like to return this shirt. It doesn't fit properly.",
          question: "Why does the customer want to return the shirt?",
          options: [
            "It doesn't fit",
            "It's the wrong color",
            "It's damaged",
            "It's too expensive"
          ],
          correctAnswer: 0,
          explanation: "顾客说'It doesn't fit properly'，意思是衣服不合身。",
          difficulty: 'MEDIUM',
          timeLimit: 30,
          section: 'CONVERSATION'
        },
        {
          id: 'c4',
          audioText: "The library will be closed for renovation from Monday to Wednesday.",
          question: "How many days will the library be closed?",
          options: [
            "Three days",
            "Two days",
            "Four days",
            "One week"
          ],
          correctAnswer: 0,
          explanation: "图书馆从周一到周三关闭，共三天。",
          difficulty: 'MEDIUM',
          timeLimit: 25,
          section: 'CONVERSATION'
        },
        {
          id: 'c5',
          audioText: "If we leave now, we should arrive just in time for the show.",
          question: "What does the speaker suggest?",
          options: [
            "Leave now to arrive on time",
            "Cancel the show",
            "Take a different route",
            "Postpone the departure"
          ],
          correctAnswer: 0,
          explanation: "说话者建议现在出发，以便准时到达观看演出。",
          difficulty: 'HARD',
          timeLimit: 20,
          section: 'CONVERSATION'
        },
        // 新闻部分 (6-10)
        {
          id: 'n1',
          audioText: "The government has announced new measures to combat climate change, including increased investment in renewable energy.",
          question: "What is the main topic of this news?",
          options: [
            "Climate change measures",
            "Economic development",
            "Education reform",
            "Healthcare policies"
          ],
          correctAnswer: 0,
          explanation: "新闻主要讨论政府宣布应对气候变化的新措施。",
          difficulty: 'MEDIUM',
          timeLimit: 35,
          section: 'NEWS'
        },
        {
          id: 'n2',
          audioText: "Stock markets around the world showed significant gains following positive economic reports from major economies.",
          question: "How did stock markets perform?",
          options: [
            "They gained significantly",
            "They remained stable",
            "They dropped sharply",
            "They fluctuated wildly"
          ],
          correctAnswer: 0,
          explanation: "由于主要经济体发布积极经济报告，全球股市大幅上涨。",
          difficulty: 'MEDIUM',
          timeLimit: 30,
          section: 'NEWS'
        },
        {
          id: 'n3',
          audioText: "Researchers have discovered a new species of deep-sea fish that can survive in extreme pressure conditions.",
          question: "What did researchers discover?",
          options: [
            "A new species of deep-sea fish",
            "A new type of coral reef",
            "Ancient marine fossils",
            "Underwater volcanoes"
          ],
          correctAnswer: 0,
          explanation: "研究人员发现了一种能在极端压力下生存的新深海鱼类。",
          difficulty: 'HARD',
          timeLimit: 35,
          section: 'NEWS'
        },
        {
          id: 'n4',
          audioText: "The new high-speed railway connecting the two major cities is expected to reduce travel time by over 50%.",
          question: "What is the benefit of the new high-speed railway?",
          options: [
            "Reduced travel time",
            "Lower ticket prices",
            "More comfortable seats",
            "Better scenery"
          ],
          correctAnswer: 0,
          explanation: "新的高铁线路预计将旅行时间减少50%以上。",
          difficulty: 'MEDIUM',
          timeLimit: 30,
          section: 'NEWS'
        },
        {
          id: 'n5',
          audioText: "International cooperation has led to the successful rescue of endangered wildlife in the region.",
          question: "What was the result of international cooperation?",
          options: [
            "Rescue of endangered wildlife",
            "Construction of a new park",
            "Scientific research funding",
            "Tourism development"
          ],
          correctAnswer: 0,
          explanation: "国际合作成功解救了该地区的濒危野生动物。",
          difficulty: 'HARD',
          timeLimit: 35,
          section: 'NEWS'
        },
        // 讲座部分 (11-15)
        {
          id: 'l1',
          audioText: "The theory of relativity fundamentally changed our understanding of space, time, and gravity.",
          question: "What did the theory of relativity change?",
          options: [
            "Understanding of space, time, and gravity",
            "Mathematical principles",
            "Chemical theories",
            "Biological classifications"
          ],
          correctAnswer: 0,
          explanation: "相对论从根本上改变了我们对空间、时间和引力的理解。",
          difficulty: 'HARD',
          timeLimit: 40,
          section: 'LECTURE'
        },
        {
          id: 'l2',
          audioText: "Photosynthesis is the process by which plants convert light energy into chemical energy.",
          question: "What is photosynthesis?",
          options: [
            "Converting light energy to chemical energy",
            "Absorbing water from soil",
            "Producing oxygen at night",
            "Growing towards sunlight"
          ],
          correctAnswer: 0,
          explanation: "光合作用是植物将光能转化为化学能的过程。",
          difficulty: 'MEDIUM',
          timeLimit: 35,
          section: 'LECTURE'
        },
        {
          id: 'l3',
          audioText: "The Industrial Revolution marked a major turning point in human history, leading to urbanization and technological advancement.",
          question: "What was a result of the Industrial Revolution?",
          options: [
            "Urbanization and technological advancement",
            "Agricultural development",
            "Population decrease",
            "Cultural isolation"
          ],
          correctAnswer: 0,
          explanation: "工业革命是人类历史上的重要转折点，导致了城市化和技术进步。",
          difficulty: 'HARD',
          timeLimit: 40,
          section: 'LECTURE'
        },
        {
          id: 'l4',
          audioText: "Shakespeare's works have had a profound influence on English literature and language.",
          question: "What influence did Shakespeare's works have?",
          options: [
            "On English literature and language",
            "On scientific discovery",
            "On political systems",
            "On musical composition"
          ],
          correctAnswer: 0,
          explanation: "莎士比亚的作品对英国文学和语言产生了深远影响。",
          difficulty: 'MEDIUM',
          timeLimit: 35,
          section: 'LECTURE'
        },
        {
          id: 'l5',
          audioText: "Sustainable development aims to meet the needs of the present without compromising the ability of future generations to meet their own needs.",
          question: "What is the goal of sustainable development?",
          options: [
            "Balance present and future needs",
            "Maximize economic growth",
            "Reduce population growth",
            "Increase industrial output"
          ],
          correctAnswer: 0,
          explanation: "可持续发展的目标是满足当代需求，同时不损害后代满足自身需求的能力。",
          difficulty: 'HARD',
          timeLimit: 40,
          section: 'LECTURE'
        }
      ];

      setTest(mockTest);
      setQuestions(mockQuestions);
      setSelectedAnswers(new Array(mockQuestions.length).fill(null));
      setIsAnswered(new Array(mockQuestions.length).fill(false));
      setIsLoading(false);
    }, 1000);
  }, []);

  // 计时器逻辑
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestStarted && !isTestCompleted && overallTimeRemaining > 0) {
      timer = setInterval(() => {
        setOverallTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestStarted, isTestCompleted, overallTimeRemaining]);

  // 部分计时器
  useEffect(() => {
    let sectionTimer: NodeJS.Timeout;
    if (isTestStarted && !isTestCompleted && sectionTimeRemaining > 0) {
      sectionTimer = setInterval(() => {
        setSectionTimeRemaining(prev => {
          if (prev <= 1) {
            handleSectionTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sectionTimer);
  }, [isTestStarted, isTestCompleted, sectionTimeRemaining]);

  const startTest = () => {
    if (!test) return;

    setIsTestStarted(true);
    setShowInstructions(false);
    setTestStartTime(Date.now());
    setOverallTimeRemaining(test.totalDuration * 60); // 转换为秒

    // 开始第一部分
    const firstSection = test.sections[0];
    setCurrentSection(firstSection.type);
    setSectionStartTime(Date.now());
    setSectionTimeRemaining(firstSection.timeLimit * 60);

    // 找到第一部分的第一个问题
    const firstQuestionIndex = questions.findIndex(q => q.section === firstSection.type);
    if (firstQuestionIndex >= 0) {
      setCurrentQuestion(firstQuestionIndex);
    }
  };

  const handleSectionTimeout = () => {
    // 自动移动到下一部分
    if (!test) return;

    const currentSectionIndex = test.sections.findIndex(s => s.type === currentSection);
    if (currentSectionIndex < test.sections.length - 1) {
      // 移动到下一部分
      const nextSection = test.sections[currentSectionIndex + 1];
      setCurrentSection(nextSection.type);
      setSectionStartTime(Date.now());
      setSectionTimeRemaining(nextSection.timeLimit * 60);

      // 找到下一部分的第一个问题
      const nextQuestionIndex = questions.findIndex(q => q.section === nextSection.type);
      if (nextQuestionIndex >= 0) {
        setCurrentQuestion(nextQuestionIndex);
      }
    } else {
      // 所有部分完成，自动提交
      handleTestTimeout();
    }
  };

  const handleTestTimeout = () => {
    setIsTestCompleted(true);
    setIsTestStarted(false);
    calculateScore();
  };

  const playAudio = () => {
    if (questions[currentQuestion]) {
      // 清除现有定时器
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      // 重置进度
      setAudioProgress(0);

      // 开始播放
      speakText(questions[currentQuestion].audioText, () => {
        // 音频播放结束
        setIsPlaying(false);
        setAudioProgress(100);
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
      }, playbackRate);

      setIsPlaying(true);

      // 估算音频持续时间（按单词数估算，每个单词约0.5秒）
      const wordCount = questions[currentQuestion].audioText.split(' ').length;
      const estimatedDuration = (wordCount * 0.5) / playbackRate; // 秒
      const progressInterval = estimatedDuration * 10; // 将进度分为100步

      if (estimatedDuration > 0) {
        // 启动进度定时器
        progressTimerRef.current = setInterval(() => {
          setAudioProgress(prev => {
            if (prev >= 100) {
              if (progressTimerRef.current) {
                clearInterval(progressTimerRef.current);
                progressTimerRef.current = null;
              }
              return 100;
            }
            return prev + (100 / progressInterval);
          });
        }, 100); // 每100毫秒更新一次
      }
    }
  };

  const pauseAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);

      // 清除进度定时器
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }

      // 重置进度
      setAudioProgress(0);
    }
  };


  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered[currentQuestion] || isTestCompleted) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    const newIsAnswered = [...isAnswered];
    newIsAnswered[currentQuestion] = true;
    setIsAnswered(newIsAnswered);

    // 自动跳转到下一题
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        goToQuestion(currentQuestion + 1);
      }
    }, 500);
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;

    // 停止当前播放
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // 清理进度定时器
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }

    setCurrentQuestion(index);
    setCurrentSection(questions[index].section);
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const calculateScore = () => {
    if (!test) return null;

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= test.passingScore;

    return { score, correctCount, totalQuestions: questions.length, passed };
  };

  const submitTest = () => {
    const result = calculateScore();
    if (!result || !test) return;

    // 保存结果到本地存储
    const testResult = {
      testId: test.id,
      title: test.title,
      score: result.score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      passed: result.passed,
      timeSpent: test.totalDuration * 60 - overallTimeRemaining,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('latestListeningTestResult', JSON.stringify(testResult));
    setIsTestCompleted(true);

    // 导航到结果页面
    setTimeout(() => {
      router.push('/listening/completed');
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '简单';
      case 'MEDIUM': return '中等';
      case 'HARD': return '困难';
      default: return difficulty;
    }
  };

  const getSectionInfo = (sectionType: string) => {
    if (!test) return null;
    return test.sections.find(s => s.type === sectionType);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载听力测试中...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到测试</h2>
        <Link
          href="/listening"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回听力训练
        </Link>
      </div>
    );
  }

  const currentSectionInfo = getSectionInfo(currentSection);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 测试标题和信息 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.title}</h1>
            <p className="text-gray-600">{test.description}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
              <div className="text-2xl font-bold">{test.difficulty}</div>
              <div className="text-sm opacity-90">难度</div>
            </div>
          </div>
        </div>

        {/* 测试概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">总题数</div>
            <div className="text-2xl font-bold text-gray-900">{test.totalQuestions}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">总分</div>
            <div className="text-2xl font-bold text-gray-900">{test.points}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">及格分数</div>
            <div className="text-2xl font-bold text-gray-900">{test.passingScore}%</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">总时长</div>
            <div className="text-2xl font-bold text-gray-900">{test.totalDuration}分钟</div>
          </div>
        </div>

        {/* 测试部分 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">测试结构</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {test.sections.map((section, idx) => (
              <div
                key={section.type}
                className={`p-4 rounded-lg border-2 ${currentSection === section.type ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{section.title}</span>
                  <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    第{idx + 1}部分
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{section.questionCount}题</span>
                  <span className="text-gray-700">{section.timeLimit}分钟</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 测试说明（测试开始前显示） */}
      {showInstructions && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">测试说明</h2>
          <div className="space-y-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">📋 测试规则</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>测试共{test.totalQuestions}题，分为{test.sections.length}个部分</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>总时长{test.totalDuration}分钟，每部分有独立计时</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>每题只能回答一次，提交后不能修改</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>及格分数为{test.passingScore}%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>测试中途不能暂停，请确保有充足时间</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">🎯 建议</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>仔细听音频，注意关键信息</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>合理分配时间，不要在某题上花费太久</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>不确定的题目可以先标记，最后再检查</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>保持冷静，集中注意力</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startTest}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-xl hover:opacity-90 shadow-lg"
            >
              开始听力测试
            </button>
            <p className="text-gray-600 mt-4">
              点击开始后，计时器将立即启动，请做好准备。
            </p>
          </div>
        </div>
      )}

      {/* 测试进行中 */}
      {isTestStarted && !isTestCompleted && (
        <>
          {/* 计时器面板 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">总剩余时间</div>
                  <div className={`text-3xl font-bold ${overallTimeRemaining <= 300 ? 'text-red-300' : ''}`}>
                    {formatTime(overallTimeRemaining)}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">当前部分</div>
                  <div className="text-2xl font-bold">{currentSectionInfo?.title}</div>
                  <div className="text-sm mt-2">剩余时间: {formatTime(sectionTimeRemaining)}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">答题进度</div>
                  <div className="text-3xl font-bold">{selectedAnswers.filter(ans => ans !== null).length}/{test.totalQuestions}</div>
                  <div className="text-sm mt-2">
                    已答 {Math.round((selectedAnswers.filter(ans => ans !== null).length / test.totalQuestions) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 主要测试区域 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {/* 音频播放器 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">🎧 听力音频</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">播放速度:</span>
                  <div className="flex space-x-2">
                    {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          playbackRate === rate
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 模拟音频播放器 */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={isPlaying ? pauseAudio : playAudio}
                        className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700"
                      >
                        <span className="text-white text-xl">
                          {isPlaying ? '⏸️' : '▶️'}
                        </span>
                      </button>
                      <div>
                        <div className="font-bold text-gray-900">播放音频</div>
                        <div className="text-sm text-gray-600">点击播放按钮听录音（每段音频最多播放2次）</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">当前速度</div>
                      <div className="font-bold text-gray-900">{playbackRate}x</div>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>播放进度</span>
                      <span>{Math.round(audioProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${audioProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 播放控制 */}
                  <div className="flex justify-center space-x-6 mt-4">
                    <button
                      onClick={() => setPlaybackRate(Math.max(0.5, playbackRate - 0.25))}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      减慢
                    </button>
                    <button
                      onClick={playAudio}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      重播
                    </button>
                    <button
                      onClick={() => setPlaybackRate(Math.min(1.5, playbackRate + 0.25))}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      加速
                    </button>
                  </div>
                </div>

                {/* 音频文本（测试中不显示，测试后显示） */}
              </div>

            </div>

            {/* 当前题目 */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl font-bold text-gray-900">
                      第{currentQuestion + 1}题
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(questions[currentQuestion].difficulty)}`}>
                      {getDifficultyLabel(questions[currentQuestion].difficulty)}
                    </span>
                    <span className="text-gray-600">
                      限时 {questions[currentQuestion].timeLimit} 秒
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {questions[currentQuestion].question}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-2">部分剩余时间</div>
                  <div className={`text-3xl font-bold ${sectionTimeRemaining <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatTime(sectionTimeRemaining)}
                  </div>
                </div>
              </div>

              {/* 选项 */}
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswered[currentQuestion] || isTestCompleted}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full p-6 text-left rounded-xl border-2 transition-all ${
                      isAnswered[currentQuestion]
                        ? idx === questions[currentQuestion].correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : idx === selectedAnswers[currentQuestion]
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                        isAnswered[currentQuestion]
                          ? idx === questions[currentQuestion].correctAnswer
                            ? 'bg-green-100 text-green-800'
                            : idx === selectedAnswers[currentQuestion]
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="text-gray-800 text-lg">{option}</div>
                      {isAnswered[currentQuestion] && idx === questions[currentQuestion].correctAnswer && (
                        <div className="ml-auto text-green-600 font-bold">
                          ✓ 正确答案
                        </div>
                      )}
                      {isAnswered[currentQuestion] &&
                       idx === selectedAnswers[currentQuestion] &&
                       idx !== questions[currentQuestion].correctAnswer && (
                        <div className="ml-auto text-red-600 font-bold">
                          ✗ 你的选择
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 题目导航 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-900">题目导航</h4>
                <div className="text-sm text-gray-600">
                  {currentSectionInfo?.title} ({questions.filter(q => q.section === currentSection).length}题)
                </div>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                      idx === currentQuestion
                        ? 'bg-indigo-600 text-white'
                        : isAnswered[idx]
                        ? selectedAnswers[idx] === q.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : selectedAnswers[idx] !== null
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="text-center pt-8 border-t border-gray-200">
              <button
                onClick={submitTest}
                disabled={selectedAnswers.filter(ans => ans !== null).length < test.totalQuestions}
                className="px-12 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                提交测试
              </button>
              <p className="text-gray-600 mt-4">
                {selectedAnswers.filter(ans => ans !== null).length >= test.totalQuestions
                  ? '所有题目已回答，可以提交测试'
                  : `还有${test.totalQuestions - selectedAnswers.filter(ans => ans !== null).length}题未回答`}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 测试完成状态 */}
      {isTestCompleted && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="h-24 w-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white">🏆</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">测试完成！</h3>

            {calculateScore() && (
              <div className="bg-white rounded-xl p-8 mb-6 max-w-md mx-auto shadow-lg">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">得分</div>
                    <div className={`text-4xl font-bold ${calculateScore()!.score >= test.passingScore ? 'text-green-600' : 'text-red-600'}`}>
                      {calculateScore()!.score}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">正确题数</div>
                    <div className="text-4xl font-bold text-gray-900">{calculateScore()!.correctCount}/{test.totalQuestions}</div>
                  </div>
                </div>

                <div className={`px-6 py-3 rounded-lg font-bold ${calculateScore()!.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {calculateScore()!.passed ? '✅ 恭喜！您已通过测试' : '❌ 很遗憾，未达到及格分数'}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Link
                href="/listening"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                返回听力训练
              </Link>
              <button
                onClick={() => router.push('/listening/completed')}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                查看详细结果 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 返回导航 */}
      {!isTestStarted && !showInstructions && (
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
          <Link
            href="/listening"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← 返回听力训练
          </Link>
          <div className="text-sm text-gray-600">
            听力测试是检验听力水平的重要方式
          </div>
        </div>
      )}
    </div>
  );
}