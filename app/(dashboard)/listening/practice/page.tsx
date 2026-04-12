'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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

interface ListeningQuestion {
  id: string;
  audioText: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number;
}

interface ListeningPractice {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  totalDuration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  accent: string;
  category: string;
  points: number;
}

export default function ListeningPracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [practice, setPractice] = useState<ListeningPractice | null>(null);
  const [questions, setQuestions] = useState<ListeningQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 根据资源ID获取对应的练习ID
  // 资源1-20直接映射到练习1-20
  const getPracticeIdFromResourceId = (resourceId: string): string => {
    const idNum = parseInt(resourceId);
    if (isNaN(idNum)) return '1';

    // 资源ID直接映射到练习ID
    // 如果是资源库的资源ID（1-20），直接返回对应的练习ID
    if (idNum >= 1 && idNum <= 20) {
      return idNum.toString();
    }

    // 如果是练习页面的直接访问（大于20），使用取模运算
    return ((idNum - 1) % 20 + 1).toString();
  };

  // 根据练习ID获取练习数据和问题
  const getPracticeData = (practiceId: string) => {
    // 将资源ID映射到练习ID（直接映射）
    const mappedPracticeId = getPracticeIdFromResourceId(practiceId);

    // 定义不同练习的模拟数据
    const practices: Record<string, ListeningPractice> = {
      '1': {
        id: '1',
        title: '机场对话听力练习',
        description: '旅客与机场工作人员的日常对话，练习日常英语听力',
        totalQuestions: 5,
        totalDuration: 180,
        difficulty: 'BEGINNER',
        accent: '美音',
        category: '对话',
        points: 15
      },
      '2': {
        id: '2',
        title: '科技新闻听力练习',
        description: '关于人工智能发展的新闻报道，练习学术和科技英语听力',
        totalQuestions: 5,
        totalDuration: 240,
        difficulty: 'INTERMEDIATE',
        accent: '英音',
        category: '新闻',
        points: 20
      },
      '3': {
        id: '3',
        title: '大学讲座听力练习',
        description: '环境科学课堂讲座片段，练习学术讲座听力',
        totalQuestions: 5,
        totalDuration: 300,
        difficulty: 'ADVANCED',
        accent: '美音',
        category: '讲座',
        points: 25
      },
      '4': {
        id: '4',
        title: '名人采访听力练习',
        description: '知名演员的访谈节目，练习采访和对话听力',
        totalQuestions: 5,
        totalDuration: 240,
        difficulty: 'INTERMEDIATE',
        accent: '澳音',
        category: '采访',
        points: 20
      },
      '5': {
        id: '5',
        title: '短篇故事听力练习',
        description: '经典英文短篇故事朗读，练习叙事和故事听力',
        totalQuestions: 5,
        totalDuration: 180,
        difficulty: 'BEGINNER',
        accent: '英音',
        category: '故事',
        points: 15
      },
      '6': {
        id: '6',
        title: '商务会议听力练习',
        description: '公司项目讨论会议记录，练习商务英语听力',
        totalQuestions: 5,
        totalDuration: 240,
        difficulty: 'INTERMEDIATE',
        accent: '美音',
        category: '对话',
        points: 20
      },
      '7': {
        id: '7',
        title: '天气预报听力练习',
        description: '多城市天气预报播报，练习天气预报听力',
        totalQuestions: 5,
        totalDuration: 150,
        difficulty: 'BEGINNER',
        accent: '英音',
        category: '新闻',
        points: 15
      },
      '8': {
        id: '8',
        title: '学术演讲听力练习',
        description: 'TED演讲片段，练习学术演讲听力',
        totalQuestions: 5,
        totalDuration: 240,
        difficulty: 'ADVANCED',
        accent: '美音',
        category: '讲座',
        points: 25
      },
      // 资源9-20的练习内容
      '9': {
        id: '9',
        title: '餐厅对话听力练习',
        description: '餐厅点餐和服务对话，练习餐厅英语听力',
        totalQuestions: 5,
        totalDuration: 180,
        difficulty: 'BEGINNER',
        accent: '美音',
        category: '对话',
        points: 15
      },
      '10': {
        id: '10',
        title: '学术研究听力练习',
        description: '学术研究报告演讲，练习学术英语听力',
        totalQuestions: 5,
        totalDuration: 300,
        difficulty: 'ADVANCED',
        accent: '美音',
        category: '讲座',
        points: 25
      },
      '11': {
        id: '11',
        title: '旅行对话听力练习',
        description: '旅行问路和旅游对话，练习旅行英语听力',
        totalQuestions: 5,
        totalDuration: 180,
        difficulty: 'BEGINNER',
        accent: '英音',
        category: '对话',
        points: 15
      },
      '12': {
        id: '12',
        title: '经济新闻听力练习',
        description: '经济新闻报道和分析，练习经济英语听力',
        totalQuestions: 5,
        totalDuration: 240,
        difficulty: 'INTERMEDIATE',
        accent: '英音',
        category: '新闻',
        points: 20
      },
      '13': {
        id: '13',
        title: '医疗对话听力练习',
        description: '医生与患者对话，练习医疗英语听力',
        totalQuestions: 5,
        totalDuration: 200,
        difficulty: 'INTERMEDIATE',
        accent: '美音',
        category: '对话',
        points: 20
      },
      '14': {
        id: '14',
        title: '历史纪录片听力练习',
        description: '历史纪录片旁白，练习历史英语听力',
        totalQuestions: 5,
        totalDuration: 280,
        difficulty: 'ADVANCED',
        accent: '英音',
        category: '讲座',
        points: 25
      },
      '15': {
        id: '15',
        title: '职场面试听力练习',
        description: '职场面试模拟对话，练习面试英语听力',
        totalQuestions: 5,
        totalDuration: 220,
        difficulty: 'INTERMEDIATE',
        accent: '美音',
        category: '采访',
        points: 20
      },
      '16': {
        id: '16',
        title: '儿童故事听力练习',
        description: '儿童英语故事朗读，练习基础英语听力',
        totalQuestions: 5,
        totalDuration: 150,
        difficulty: 'BEGINNER',
        accent: '英音',
        category: '故事',
        points: 15
      },
      '17': {
        id: '17',
        title: '体育新闻听力练习',
        description: '体育赛事新闻报道，练习体育英语听力',
        totalQuestions: 5,
        totalDuration: 200,
        difficulty: 'INTERMEDIATE',
        accent: '美音',
        category: '新闻',
        points: 20
      },
      '18': {
        id: '18',
        title: '学术讨论听力练习',
        description: '学术论文讨论会议，练习学术讨论听力',
        totalQuestions: 5,
        totalDuration: 300,
        difficulty: 'ADVANCED',
        accent: '美音',
        category: '讲座',
        points: 25
      },
      '19': {
        id: '19',
        title: '酒店服务听力练习',
        description: '酒店预订和服务对话，练习酒店英语听力',
        totalQuestions: 5,
        totalDuration: 180,
        difficulty: 'BEGINNER',
        accent: '英音',
        category: '对话',
        points: 15
      },
      '20': {
        id: '20',
        title: '科学播客听力练习',
        description: '科学播客节目片段，练习科普英语听力',
        totalQuestions: 5,
        totalDuration: 260,
        difficulty: 'ADVANCED',
        accent: '美音',
        category: '讲座',
        points: 25
      }
    };

    const questionsByPractice: Record<string, ListeningQuestion[]> = {
      '1': [
        {
          id: '1',
          audioText: "Good morning! How can I help you today?",
          question: "What does the staff member say?",
          options: [
            "Good morning! How can I help you today?",
            "Good morning! Where are you going?",
            "Good morning! What time is it?",
            "Good morning! Do you need a ticket?"
          ],
          correctAnswer: 0,
          explanation: "工作人员说的是'Good morning! How can I help you today?'，这是标准的问候和提供服务的方式。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "I'd like to check in for my flight to New York.",
          question: "What does the passenger want to do?",
          options: [
            "Check in for his flight",
            "Buy a ticket to New York",
            "Ask for directions",
            "Change his flight"
          ],
          correctAnswer: 0,
          explanation: "旅客说'I'd like to check in for my flight to New York.'，意思是想要办理前往纽约航班的登机手续。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "May I see your passport and boarding pass, please?",
          question: "What does the staff member ask for?",
          options: [
            "Passport and boarding pass",
            "Ticket and luggage",
            "Name and address",
            "Phone number and email"
          ],
          correctAnswer: 0,
          explanation: "工作人员要求查看护照和登机牌，这是办理登机手续的标准流程。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "Your flight departs from gate 15 at 2:30 PM.",
          question: "What information is given about the flight?",
          options: [
            "Gate number and departure time",
            "Flight number and destination",
            "Aircraft type and seat number",
            "Baggage allowance and check-in time"
          ],
          correctAnswer: 0,
          explanation: "工作人员提供了登机口号码(15)和起飞时间(下午2:30)。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "Please proceed to the security checkpoint after checking in.",
          question: "What should the passenger do next?",
          options: [
            "Go to security checkpoint",
            "Wait at the gate",
            "Collect boarding pass",
            "Check luggage"
          ],
          correctAnswer: 0,
          explanation: "工作人员建议旅客在办理完登机手续后前往安检处。",
          difficulty: 'HARD',
          timeLimit: 20
        }
      ],
      '2': [
        {
          id: '1',
          audioText: "Artificial intelligence is transforming various industries.",
          question: "What is transforming various industries?",
          options: [
            "Artificial intelligence",
            "Renewable energy",
            "Blockchain technology",
            "Quantum computing"
          ],
          correctAnswer: 0,
          explanation: "音频中说的是'Artificial intelligence is transforming various industries.'，意思是人工智能正在改变各个行业。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "The new AI model can process natural language with high accuracy.",
          question: "What can the new AI model do?",
          options: [
            "Process natural language",
            "Recognize images",
            "Predict weather",
            "Analyze stocks"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'new AI model can process natural language with high accuracy'，意思是新AI模型能以高准确率处理自然语言。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "Researchers believe this technology could revolutionize healthcare.",
          question: "Which field could be revolutionized by this technology?",
          options: [
            "Healthcare",
            "Education",
            "Transportation",
            "Agriculture"
          ],
          correctAnswer: 0,
          explanation: "音频中说'this technology could revolutionize healthcare'，意思是这项技术可能彻底改变医疗保健领域。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "The company plans to launch the product by the end of this quarter.",
          question: "When does the company plan to launch the product?",
          options: [
            "By the end of this quarter",
            "Next month",
            "Early next year",
            "In two years"
          ],
          correctAnswer: 0,
          explanation: "音频中明确提到'plans to launch the product by the end of this quarter'，意思是计划在本季度末推出产品。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '5',
          audioText: "Ethical considerations are crucial when developing AI systems.",
          question: "What is crucial when developing AI systems?",
          options: [
            "Ethical considerations",
            "Cost efficiency",
            "Speed of development",
            "Market demand"
          ],
          correctAnswer: 0,
          explanation: "音频中强调'Ethical considerations are crucial'，意思是伦理考虑在开发AI系统时至关重要。",
          difficulty: 'HARD',
          timeLimit: 20
        }
      ],
      '3': [
        {
          id: '1',
          audioText: "Today we'll discuss the impact of climate change on marine ecosystems.",
          question: "What is the topic of today's lecture?",
          options: [
            "Climate change impact on marine ecosystems",
            "Renewable energy sources",
            "Deforestation effects",
            "Air pollution solutions"
          ],
          correctAnswer: 0,
          explanation: "讲座开始就说明'Today we'll discuss the impact of climate change on marine ecosystems.'，意思是今天要讨论气候变化对海洋生态系统的影响。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "Coral bleaching is caused by rising ocean temperatures.",
          question: "What causes coral bleaching?",
          options: [
            "Rising ocean temperatures",
            "Ocean acidification",
            "Pollution from plastic",
            "Overfishing"
          ],
          correctAnswer: 0,
          explanation: "音频中明确指出'Coral bleaching is caused by rising ocean temperatures.'，意思是珊瑚白化是由海洋温度上升引起的。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "The Great Barrier Reef has lost over half of its coral cover since 1995.",
          question: "How much coral cover has the Great Barrier Reef lost since 1995?",
          options: [
            "Over half",
            "About one third",
            "Nearly all",
            "Less than a quarter"
          ],
          correctAnswer: 0,
          explanation: "音频中提供具体数据'has lost over half of its coral cover since 1995'，意思是大堡礁自1995年以来已失去超过一半的珊瑚覆盖。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "Marine protected areas can help restore damaged ecosystems.",
          question: "What can help restore damaged marine ecosystems?",
          options: [
            "Marine protected areas",
            "Artificial reefs",
            "Fishing regulations",
            "Cleanup campaigns"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'Marine protected areas can help restore damaged ecosystems.'，意思是海洋保护区有助于恢复受损的生态系统。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "Individual actions, like reducing carbon footprint, can make a difference.",
          question: "What individual action is mentioned as helpful?",
          options: [
            "Reducing carbon footprint",
            "Using less plastic",
            "Conserving water",
            "Planting trees"
          ],
          correctAnswer: 0,
          explanation: "音频中举例'individual actions, like reducing carbon footprint, can make a difference.'，意思是减少碳足迹等个人行动可以产生影响。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ],
      '4': [
        {
          id: '1',
          audioText: "I started acting when I was just 15 years old.",
          question: "When did the actor start acting?",
          options: [
            "When he was 15 years old",
            "When he was 18 years old",
            "When he finished university",
            "When he moved to Hollywood"
          ],
          correctAnswer: 0,
          explanation: "演员说'I started acting when I was just 15 years old.'，意思是他15岁就开始演戏了。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "My first big role was in an independent film that won several awards.",
          question: "What was special about the actor's first big role?",
          options: [
            "It was in an award-winning independent film",
            "It was a Hollywood blockbuster",
            "It was a television series",
            "It was directed by a famous director"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'first big role was in an independent film that won several awards'，意思是第一个重要角色是在一部获奖的独立电影中。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "The most challenging part is staying authentic to the character's emotions.",
          question: "What does the actor find most challenging?",
          options: [
            "Staying authentic to the character's emotions",
            "Memorizing long scripts",
            "Working with different directors",
            "Dealing with media attention"
          ],
          correctAnswer: 0,
          explanation: "演员说'The most challenging part is staying authentic to the character's emotions.'，意思是保持角色情感的真实性最具挑战性。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "I always prepare by researching the character's background and motivations.",
          question: "How does the actor prepare for roles?",
          options: [
            "By researching the character's background and motivations",
            "By practicing with a coach",
            "By watching similar films",
            "By discussing with the director"
          ],
          correctAnswer: 0,
          explanation: "演员说'I always prepare by researching the character's background and motivations.'，意思是他总是通过研究角色的背景和动机来准备。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "What I love most about acting is the opportunity to tell meaningful stories.",
          question: "What does the actor love most about acting?",
          options: [
            "The opportunity to tell meaningful stories",
            "The fame and recognition",
            "The creative freedom",
            "The chance to work with talented people"
          ],
          correctAnswer: 0,
          explanation: "演员说'What I love most about acting is the opportunity to tell meaningful stories.'，意思是他最喜欢表演的是讲述有意义故事的机会。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ],
      '5': [
        {
          id: '1',
          audioText: "Once upon a time, there was a small village in the mountains.",
          question: "Where was the village located?",
          options: [
            "In the mountains",
            "By the sea",
            "In a forest",
            "In a desert"
          ],
          correctAnswer: 0,
          explanation: "故事开始说'there was a small village in the mountains.'，意思是山上有一个小村庄。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "The villagers believed the old oak tree at the edge of the forest had magical powers.",
          question: "What did the villagers believe about the old oak tree?",
          options: [
            "It had magical powers",
            "It was haunted",
            "It was the oldest tree in the region",
            "It could predict the weather"
          ],
          correctAnswer: 0,
          explanation: "音频中说'The villagers believed the old oak tree... had magical powers.'，意思是村民们相信老橡树有魔力。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "Every full moon, they would gather around the tree and tell stories of their ancestors.",
          question: "When would the villagers gather around the tree?",
          options: [
            "Every full moon",
            "Every Sunday",
            "On special holidays",
            "During harvest season"
          ],
          correctAnswer: 0,
          explanation: "音频中明确提到'Every full moon, they would gather around the tree...'，意思是每个满月他们都会聚集在树周围。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "One day, a stranger arrived with news that would change everything.",
          question: "What did the stranger bring?",
          options: [
            "News that would change everything",
            "A mysterious package",
            "A warning about danger",
            "A map to hidden treasure"
          ],
          correctAnswer: 0,
          explanation: "音频中说'a stranger arrived with news that would change everything.'，意思是一个陌生人带来了会改变一切的消息。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "The old wise woman said, 'Sometimes the greatest adventures begin with the smallest steps.'",
          question: "What did the old wise woman say?",
          options: [
            "'Sometimes the greatest adventures begin with the smallest steps.'",
            "'Life is full of surprises.'",
            "'Courage is doing what you fear.'",
            "'The journey is more important than the destination.'"
          ],
          correctAnswer: 0,
          explanation: "音频中直接引用了老智妇的话'Sometimes the greatest adventures begin with the smallest steps.'，意思是最伟大的冒险有时始于最小的步伐。",
          difficulty: 'HARD',
          timeLimit: 20
        }
      ],
      '6': [
        {
          id: '1',
          audioText: "Let's review the progress on the new product launch.",
          question: "What is the purpose of the meeting?",
          options: [
            "Review progress on new product launch",
            "Discuss budget concerns",
            "Plan team building activities",
            "Evaluate employee performance"
          ],
          correctAnswer: 0,
          explanation: "会议开始说'Let's review the progress on the new product launch.'，意思是让我们回顾新产品发布的进展。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "Marketing reports show a 15% increase in customer engagement.",
          question: "What do the marketing reports show?",
          options: [
            "15% increase in customer engagement",
            "Decrease in sales",
            "Higher production costs",
            "Positive customer feedback"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'Marketing reports show a 15% increase in customer engagement.'，意思是营销报告显示客户参与度增加了15%。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "We need to address the supply chain delays before moving forward.",
          question: "What issue needs to be addressed?",
          options: [
            "Supply chain delays",
            "Marketing strategy",
            "Team communication",
            "Product design"
          ],
          correctAnswer: 0,
          explanation: "音频中说'We need to address the supply chain delays before moving forward.'，意思是在继续前进之前需要解决供应链延误问题。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "The engineering team suggests extending the testing phase by two weeks.",
          question: "What does the engineering team suggest?",
          options: [
            "Extending testing phase by two weeks",
            "Hiring more testers",
            "Changing the product specifications",
            "Launching early"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'The engineering team suggests extending the testing phase by two weeks.'，意思是工程团队建议将测试阶段延长两周。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "Let's schedule another meeting next week to review the updated timeline.",
          question: "What is proposed for next week?",
          options: [
            "Another meeting to review updated timeline",
            "Product demonstration",
            "Client presentation",
            "Team training session"
          ],
          correctAnswer: 0,
          explanation: "音频结束说'Let's schedule another meeting next week to review the updated timeline.'，意思是让我们安排下周再开一次会议来审查更新的时间表。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ],
      '7': [
        {
          id: '1',
          audioText: "Good morning, here is your weather forecast for today.",
          question: "What is this?",
          options: [
            "Weather forecast",
            "News report",
            "Traffic update",
            "Sports news"
          ],
          correctAnswer: 0,
          explanation: "音频开始说'here is your weather forecast for today.'，意思是这是今天的天气预报。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "London will see cloudy skies with a high of 15 degrees Celsius.",
          question: "What is the weather forecast for London?",
          options: [
            "Cloudy with 15°C high",
            "Sunny with 20°C high",
            "Rainy with 12°C high",
            "Windy with 18°C high"
          ],
          correctAnswer: 0,
          explanation: "音频中说'London will see cloudy skies with a high of 15 degrees Celsius.'，意思是伦敦将有多云天气，最高气温15摄氏度。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "There's a 60% chance of showers in Manchester this afternoon.",
          question: "What is the chance of showers in Manchester?",
          options: [
            "60% chance",
            "30% chance",
            "80% chance",
            "50% chance"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'60% chance of showers in Manchester this afternoon.'，意思是曼彻斯特今天下午有60%的降雨概率。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "Brighton will enjoy sunny weather throughout the day.",
          question: "What weather is expected in Brighton?",
          options: [
            "Sunny weather",
            "Cloudy weather",
            "Rainy weather",
            "Foggy weather"
          ],
          correctAnswer: 0,
          explanation: "音频中说'Brighton will enjoy sunny weather throughout the day.'，意思是布莱顿将全天享受晴朗天气。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '5',
          audioText: "Temperatures will drop to around 8 degrees overnight.",
          question: "What will temperatures drop to overnight?",
          options: [
            "Around 8 degrees",
            "Around 5 degrees",
            "Around 10 degrees",
            "Around 12 degrees"
          ],
          correctAnswer: 0,
          explanation: "音频结束说'Temperatures will drop to around 8 degrees overnight.'，意思是夜间气温将降至8度左右。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '8': [
        {
          id: '1',
          audioText: "Today I want to talk about the power of vulnerability in leadership.",
          question: "What is the topic of the talk?",
          options: [
            "Power of vulnerability in leadership",
            "Importance of communication",
            "Strategies for innovation",
            "Building successful teams"
          ],
          correctAnswer: 0,
          explanation: "演讲开始说'Today I want to talk about the power of vulnerability in leadership.'，意思是今天我想谈谈领导力中脆弱性的力量。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "Research shows that leaders who show vulnerability build stronger trust with their teams.",
          question: "What does research show about leaders who show vulnerability?",
          options: [
            "They build stronger trust with their teams",
            "They are less respected",
            "They make better decisions",
            "They are more productive"
          ],
          correctAnswer: 0,
          explanation: "音频中提到'Research shows that leaders who show vulnerability build stronger trust with their teams.'，意思是研究表明表现出脆弱性的领导者能与团队建立更强的信任。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '3',
          audioText: "Vulnerability doesn't mean weakness; it means having the courage to be imperfect.",
          question: "What does vulnerability mean according to the speaker?",
          options: [
            "Courage to be imperfect",
            "Admitting mistakes",
            "Asking for help",
            "Showing emotions"
          ],
          correctAnswer: 0,
          explanation: "音频中定义'Vulnerability doesn't mean weakness; it means having the courage to be imperfect.'，意思是脆弱性不意味着弱点，而是有勇气不完美。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "When leaders share their struggles, it creates a culture where others feel safe to do the same.",
          question: "What happens when leaders share their struggles?",
          options: [
            "It creates a culture where others feel safe",
            "It decreases team morale",
            "It increases productivity",
            "It improves problem-solving"
          ],
          correctAnswer: 0,
          explanation: "音频中说'When leaders share their struggles, it creates a culture where others feel safe to do the same.'，意思是当领导者分享他们的挣扎时，会创造一种其他人也感到安全的文化。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "The most innovative ideas often come from environments where people feel psychologically safe.",
          question: "Where do the most innovative ideas often come from?",
          options: [
            "Environments where people feel psychologically safe",
            "Competitive environments",
            "Structured organizations",
            "Experienced teams"
          ],
          correctAnswer: 0,
          explanation: "音频结束说'The most innovative ideas often come from environments where people feel psychologically safe.'，意思是最创新的想法通常来自人们感到心理安全的环境。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      // 资源9-20的问题数据
      '9': [ // 餐厅对话
        {
          id: '1',
          audioText: "Good evening, welcome to our restaurant. Do you have a reservation?",
          question: "What does the waiter ask first?",
          options: [
            "If they have a reservation",
            "What they would like to drink",
            "If they need a menu",
            "How many people are in their party"
          ],
          correctAnswer: 0,
          explanation: "服务员首先问'Do you have a reservation?'，意思是您有预订吗？",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "I'd like to start with a glass of red wine, please.",
          question: "What does the customer want to order first?",
          options: [
            "A glass of red wine",
            "A bottle of water",
            "A beer",
            "Some appetizers"
          ],
          correctAnswer: 0,
          explanation: "顾客说'I'd like to start with a glass of red wine'，意思是我想先点一杯红酒。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "For the main course, I'll have the grilled salmon with vegetables.",
          question: "What did the customer order for main course?",
          options: [
            "Grilled salmon with vegetables",
            "Beef steak",
            "Chicken dish",
            "Pasta"
          ],
          correctAnswer: 0,
          explanation: "顾客点的主菜是'grilled salmon with vegetables'，意思是烤三文鱼配蔬菜。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "Could we have the bill, please? We're in a hurry.",
          question: "What are the customers asking for?",
          options: [
            "The bill",
            "More water",
            "The dessert menu",
            "The checkroom"
          ],
          correctAnswer: 0,
          explanation: "顾客说'Could we have the bill'，意思是我们可以结账吗。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '5',
          audioText: "The total comes to $65.50. Would you like to pay by card or cash?",
          question: "How much is the total bill?",
          options: [
            "$65.50",
            "$55.50",
            "$75.50",
            "$60.50"
          ],
          correctAnswer: 0,
          explanation: "账单总额是'$65.50'，意思是65.50美元。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '10': [ // 学术研究
        {
          id: '1',
          audioText: "Our research methodology combines quantitative and qualitative approaches.",
          question: "What research methodology is used in this study?",
          options: [
            "Quantitative and qualitative approaches",
            "Only quantitative methods",
            "Only qualitative methods",
            "Experimental methods"
          ],
          correctAnswer: 0,
          explanation: "研究方法结合了定量和定性方法。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "The data was collected through surveys administered over a six-month period.",
          question: "How was the data collected?",
          options: [
            "Through surveys over six months",
            "Through interviews",
            "Through experiments",
            "Through observations"
          ],
          correctAnswer: 0,
          explanation: "数据是通过在六个月期间进行的调查收集的。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "The findings suggest a strong correlation between income and education level.",
          question: "What do the findings indicate?",
          options: [
            "Correlation between income and education",
            "Causation between income and education",
            "No relationship between variables",
            "Weak correlation"
          ],
          correctAnswer: 0,
          explanation: "研究结果表明收入和教育水平之间存在强相关性。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "This study contributes to the literature by filling a significant gap in the field.",
          question: "What does this study contribute?",
          options: [
            "Fills a significant gap in the field",
            "Confirms previous findings",
            "Challenges existing theories",
            "Introduces new methodology"
          ],
          correctAnswer: 0,
          explanation: "这项研究通过填补该领域的一个重要空白来贡献文献。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '5',
          audioText: "Future research should explore this phenomenon in different cultural contexts.",
          question: "What do the researchers suggest for future studies?",
          options: [
            "Explore in different cultural contexts",
            "Use different methodologies",
            "Increase sample size",
            "Focus on different variables"
          ],
          correctAnswer: 0,
          explanation: "建议未来研究在不同文化背景下探索这一现象。",
          difficulty: 'HARD',
          timeLimit: 20
        }
      ],
      '11': [ // 旅行对话
        {
          id: '1',
          audioText: "Excuse me, could you tell me how to get to the train station?",
          question: "What is the tourist asking about?",
          options: [
            "Directions to the train station",
            "The time of the train",
            "Where to buy tickets",
            "The nearest hotel"
          ],
          correctAnswer: 0,
          explanation: "游客在问去火车站怎么走。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "Go straight for two blocks, then turn left at the traffic light.",
          question: "What should the tourist do first?",
          options: [
            "Go straight for two blocks",
            "Turn right immediately",
            "Take a bus",
            "Walk backwards"
          ],
          correctAnswer: 0,
          explanation: "先直走两个街区，然后在红绿灯处左转。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "Is there a museum nearby that's worth visiting?",
          question: "What is the tourist asking about?",
          options: [
            "A nearby museum",
            "A restaurant",
            "A shopping mall",
            "A park"
          ],
          correctAnswer: 0,
          explanation: "游客在问附近是否有值得参观的博物馆。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "The museum is open from 9 AM to 6 PM, and admission is free on Sundays.",
          question: "When is the museum open?",
          options: [
            "9 AM to 6 PM",
            "10 AM to 5 PM",
            "8 AM to 7 PM",
            "9 AM to 9 PM"
          ],
          correctAnswer: 0,
          explanation: "博物馆开放时间是早上9点到下午6点。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "You can take the bus number 15 from here. It takes about 20 minutes.",
          question: "How can the tourist get to the museum?",
          options: [
            "Take bus number 15",
            "Take the subway",
            "Walk for 20 minutes",
            "Take a taxi"
          ],
          correctAnswer: 0,
          explanation: "可以乘坐15路公交车，大约20分钟。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '12': [ // 经济新闻
        {
          id: '1',
          audioText: "The stock market closed at a record high today amid positive economic data.",
          question: "How did the stock market perform today?",
          options: [
            "Closed at a record high",
            "Closed at a low",
            "Remained unchanged",
            "Temporarily closed"
          ],
          correctAnswer: 0,
          explanation: "股市在积极的经济数据背景下收于历史新高。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "The central bank announced a 0.25% interest rate cut to stimulate economic growth.",
          question: "What did the central bank do?",
          options: [
            "Cut interest rate by 0.25%",
            "Increased interest rate",
            "Kept interest rate unchanged",
            "Announced new monetary policy"
          ],
          correctAnswer: 0,
          explanation: "央行宣布降息0.25%以刺激经济增长。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "Unemployment rate dropped to 3.5%, the lowest level in the past decade.",
          question: "What is the current unemployment rate?",
          options: [
            "3.5%",
            "4.5%",
            "5.5%",
            "2.5%"
          ],
          correctAnswer: 0,
          explanation: "失业率降至3.5%，是过去十年最低水平。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "The inflation rate has stabilized at around 2% annually.",
          question: "What is the current inflation rate?",
          options: [
            "Around 2% annually",
            "Around 5% annually",
            "Around 1% annually",
            "Around 3% annually"
          ],
          correctAnswer: 0,
          explanation: "通胀率稳定在每年约2%。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '5',
          audioText: "Experts predict the economy will grow by 2.8% next year.",
          question: "What is the predicted economic growth rate for next year?",
          options: [
            "2.8%",
            "2.0%",
            "3.5%",
            "1.5%"
          ],
          correctAnswer: 0,
          explanation: "专家预测明年经济增长率为2.8%。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '13': [ // 医疗对话
        {
          id: '1',
          audioText: "What brings you in today?",
          question: "What is the doctor asking?",
          options: [
            "Why the patient is visiting",
            "The patient's name",
            "The patient's age",
            "The patient's address"
          ],
          correctAnswer: 0,
          explanation: "医生问患者今天为什么来。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "I've been experiencing headaches for the past week.",
          question: "What symptom does the patient have?",
          options: [
            "Headaches",
            "Fever",
            "Cough",
            "Fatigue"
          ],
          correctAnswer: 0,
          explanation: "患者说过去一周一直头痛。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "Let me check your blood pressure and temperature.",
          question: "What will the doctor do next?",
          options: [
            "Check blood pressure and temperature",
            "Prescribe medication",
            "Order X-rays",
            "Give injection"
          ],
          correctAnswer: 0,
          explanation: "医生要检查血压和体温。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "I recommend you get plenty of rest and drink more water.",
          question: "What does the doctor recommend?",
          options: [
            "Plenty of rest and water",
            "More exercise",
            "Take vitamins",
            "Stay indoors"
          ],
          correctAnswer: 0,
          explanation: "医生建议多休息，多喝水。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "If the symptoms persist for more than three days, please come back for a follow-up.",
          question: "When should the patient return?",
          options: [
            "If symptoms persist over three days",
            "Tomorrow",
            "Next week",
            "In a month"
          ],
          correctAnswer: 0,
          explanation: "如果症状持续超过三天，请回来复诊。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '14': [ // 历史纪录片
        {
          id: '1',
          audioText: "In 1969, humanity achieved what was once thought impossible - landing on the moon.",
          question: "When did humans land on the moon?",
          options: [
            "In 1969",
            "In 1959",
            "In 1979",
            "In 1989"
          ],
          correctAnswer: 0,
          explanation: "1969年，人类实现了曾经被认为不可能的事情——登上月球。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "The ancient civilization flourished along the Nile River over 5,000 years ago.",
          question: "Where did this ancient civilization flourish?",
          options: [
            "Along the Nile River",
            "Along the Amazon River",
            "Along the Yangtze River",
            "Along the Mississippi River"
          ],
          correctAnswer: 0,
          explanation: "这个古代文明在尼罗河沿岸繁荣发展。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "The fall of the Berlin Wall in 1989 marked the end of the Cold War era.",
          question: "What event marked the end of the Cold War?",
          options: [
            "Fall of the Berlin Wall",
            "End of World War II",
            "Formation of NATO",
            "Soviet invasion of Afghanistan"
          ],
          correctAnswer: 0,
          explanation: "1989年柏林墙的倒塌标志着冷战时代的结束。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "Leonardo da Vinci, the Renaissance polymath, created some of the most famous artworks in history.",
          question: "Who was Leonardo da Vinci?",
          options: [
            "A Renaissance polymath",
            "A Greek philosopher",
            "A medieval king",
            "A scientific inventor"
          ],
          correctAnswer: 0,
          explanation: "达芬奇是文艺复兴时期的博学家。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '5',
          audioText: "The Industrial Revolution transformed society from agricultural to industrial in the 18th century.",
          question: "When did the Industrial Revolution occur?",
          options: [
            "In the 18th century",
            "In the 17th century",
            "In the 19th century",
            "In the 16th century"
          ],
          correctAnswer: 0,
          explanation: "工业革命发生在18世纪。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '15': [ // 职场面试
        {
          id: '1',
          audioText: "Can you tell me a little about yourself?",
          question: "What is the interviewer asking?",
          options: [
            "About the candidate",
            "About the company",
            "About the salary",
            "About the location"
          ],
          correctAnswer: 0,
          explanation: "面试官让候选人介绍一下自己。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "What are your greatest strengths and weaknesses?",
          question: "What does the interviewer want to know?",
          options: [
            "Strengths and weaknesses",
            "Salary expectations",
            "Work experience",
            "Education background"
          ],
          correctAnswer: 0,
          explanation: "面试官问候选人的优点和缺点。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "Where do you see yourself in five years?",
          question: "What is the interviewer asking about?",
          options: [
            "Career goals in five years",
            "Current salary",
            "Family plans",
            "Hobbies"
          ],
          correctAnswer: 0,
          explanation: "面试官问候选人五年后的职业目标。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "Why do you want to work for our company?",
          question: "What does the interviewer want to know?",
          options: [
            "Why the candidate wants to work there",
            "The candidate's salary",
            "The candidate's age",
            "The candidate's address"
          ],
          correctAnswer: 0,
          explanation: "面试官想知道候选人为什么想在这家公司工作。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "Do you have any questions for me?",
          question: "What is the interviewer asking at the end?",
          options: [
            "If the candidate has questions",
            "If the candidate accepts the job",
            "When the candidate can start",
            "What the salary is"
          ],
          correctAnswer: 0,
          explanation: "面试官问候选人是否有问题要问。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ],
      '16': [ // 儿童故事
        {
          id: '1',
          audioText: "Once upon a time, there was a little rabbit who loved to jump.",
          question: "What did the little rabbit love to do?",
          options: [
            "Jump",
            "Sleep",
            "Eat",
            "Run"
          ],
          correctAnswer: 0,
          explanation: "有一只小兔子喜欢跳。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "The rabbit met a friendly squirrel in the forest.",
          question: "Who did the rabbit meet?",
          options: [
            "A friendly squirrel",
            "A big wolf",
            "A clever fox",
            "A sad bear"
          ],
          correctAnswer: 0,
          explanation: "兔子和一只友好的松鼠见面了。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "They decided to go on an adventure together to find the golden carrot.",
          question: "What did they want to find?",
          options: [
            "The golden carrot",
            "A hidden treasure",
            "A magic wand",
            "A new home"
          ],
          correctAnswer: 0,
          explanation: "他们决定一起踏上寻找金胡萝卜的冒险之旅。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "After a long journey, they finally found the golden carrot hidden behind a big rock.",
          question: "Where was the golden carrot hidden?",
          options: [
            "Behind a big rock",
            "In a tree",
            "Under the ground",
            "In a cave"
          ],
          correctAnswer: 0,
          explanation: "金胡萝卜藏在一块大石头后面。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "The rabbit and squirrel shared the golden carrot and became best friends forever.",
          question: "What happened at the end of the story?",
          options: [
            "They became best friends",
            "They got lost",
            "They went home alone",
            "They found more treasure"
          ],
          correctAnswer: 0,
          explanation: "兔子和松鼠分享了金胡萝卜，永远成为了最好的朋友。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ],
      '17': [ // 体育新闻
        {
          id: '1',
          audioText: "The national team won the championship with a 2-1 victory in the final match.",
          question: "What was the final score?",
          options: [
            "2-1",
            "3-0",
            "1-0",
            "2-2"
          ],
          correctAnswer: 0,
          explanation: "国家队在决赛中以2-1获胜。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "The star player scored 30 points, breaking the tournament record.",
          question: "How many points did the star player score?",
          options: [
            "30 points",
            "20 points",
            "25 points",
            "35 points"
          ],
          correctAnswer: 0,
          explanation: "明星球员得了30分，打破了比赛纪录。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "The coach said it was the best performance the team has shown all season.",
          question: "What did the coach say about the team's performance?",
          options: [
            "It was the best performance",
            "It was a poor performance",
            "It was an average performance",
            "It was a disappointing performance"
          ],
          correctAnswer: 0,
          explanation: "教练说这是球队本赛季表现最好的一次。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "The match attracted over 50,000 spectators at the stadium.",
          question: "How many spectators were at the match?",
          options: [
            "Over 50,000",
            "About 10,000",
            "Around 30,000",
            "Less than 5,000"
          ],
          correctAnswer: 0,
          explanation: "比赛吸引了超过50,000名观众。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "The victory marks the team's third consecutive championship title.",
          question: "How many consecutive championships has the team won?",
          options: [
            "Three consecutive",
            "Two consecutive",
            "Four consecutive",
            "Five consecutive"
          ],
          correctAnswer: 0,
          explanation: "这场胜利标志着球队连续第三次获得冠军。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '18': [ // 学术讨论
        {
          id: '1',
          audioText: "I'd like to challenge the assumption presented in the previous paper.",
          question: "What does the speaker want to do?",
          options: [
            "Challenge an assumption",
            "Agree with the paper",
            "Present new data",
            "Summarize findings"
          ],
          correctAnswer: 0,
          explanation: "演讲者想挑战之前论文中提出的假设。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '2',
          audioText: "The methodology used in this study has several limitations.",
          question: "What is being criticized in this study?",
          options: [
            "The methodology",
            "The conclusion",
            "The introduction",
            "The references"
          ],
          correctAnswer: 0,
          explanation: "本研究使用的方法论有几个局限性。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '3',
          audioText: "In my opinion, we need to consider alternative perspectives on this issue.",
          question: "What is the speaker suggesting?",
          options: [
            "Consider alternative perspectives",
            "Accept the current view",
            "Ignore the problem",
            "End the discussion"
          ],
          correctAnswer: 0,
          explanation: "演讲者认为需要考虑这个问题的其他观点。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '4',
          audioText: "Could you elaborate on how you arrived at that conclusion?",
          question: "What is the speaker asking for?",
          options: [
            "More explanation of the conclusion",
            "A different topic",
            "More participants",
            "A new study"
          ],
          correctAnswer: 0,
          explanation: "演讲者在询问如何得出这个结论的。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '5',
          audioText: "Based on the evidence, I think we can agree that further research is needed.",
          question: "What does the speaker conclude?",
          options: [
            "Further research is needed",
            "The study is complete",
            "The hypothesis is proven",
            "No more discussion is needed"
          ],
          correctAnswer: 0,
          explanation: "基于证据，演讲者认为需要进一步研究。",
          difficulty: 'HARD',
          timeLimit: 20
        }
      ],
      '19': [ // 酒店服务
        {
          id: '1',
          audioText: "Good afternoon, welcome to Grand Hotel. Do you have a reservation?",
          question: "What does the hotel staff ask first?",
          options: [
            "About the reservation",
            "About payment",
            "About luggage",
            "About breakfast"
          ],
          correctAnswer: 0,
          explanation: "酒店员工首先问是否有预订。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "I'd like to book a double room for two nights, please.",
          question: "What kind of room does the guest want?",
          options: [
            "A double room for two nights",
            "A single room for one night",
            "A suite for three nights",
            "A standard room for one night"
          ],
          correctAnswer: 0,
          explanation: "客人想要预订一个双人间，住两晚。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '3',
          audioText: "Could I have your credit card for the deposit?",
          question: "What does the hotel need?",
          options: [
            "Credit card for deposit",
            "Passport information",
            "Phone number",
            "ID card"
          ],
          correctAnswer: 0,
          explanation: "酒店需要信用卡作为押金。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '4',
          audioText: "Your room is on the 5th floor. Here's your key card.",
          question: "Where is the guest's room?",
          options: [
            "On the 5th floor",
            "On the 3rd floor",
            "On the 10th floor",
            "On the ground floor"
          ],
          correctAnswer: 0,
          explanation: "房间在5楼。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '5',
          audioText: "Breakfast is served from 7 AM to 10 AM in the dining room on the 2nd floor.",
          question: "When and where is breakfast served?",
          options: [
            "7 AM to 10 AM on 2nd floor",
            "6 AM to 9 AM on 1st floor",
            "8 AM to 11 AM on 3rd floor",
            "7 AM to 10 AM on 1st floor"
          ],
          correctAnswer: 0,
          explanation: "早餐在二楼餐厅，从早上7点供应到10点。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        }
      ],
      '20': [ // 科学播客
        {
          id: '1',
          audioText: "Welcome to today's episode where we explore the mysteries of quantum physics.",
          question: "What is the topic of today's episode?",
          options: [
            "Quantum physics",
            "Biology",
            "Chemistry",
            "Astronomy"
          ],
          correctAnswer: 0,
          explanation: "今天节目探索量子物理的奥秘。",
          difficulty: 'EASY',
          timeLimit: 30
        },
        {
          id: '2',
          audioText: "Quantum entanglement allows particles to be connected across vast distances.",
          question: "What does quantum entanglement allow?",
          options: [
            "Particles to be connected across distances",
            "Particles to be separated",
            "Particles to disappear",
            "Particles to change form"
          ],
          correctAnswer: 0,
          explanation: "量子纠缠允许粒子在远距离下相互连接。",
          difficulty: 'MEDIUM',
          timeLimit: 25
        },
        {
          id: '3',
          audioText: "Scientists are still debating whether cats can be truly in two states at once.",
          question: "What are scientists debating?",
          options: [
            "Whether cats can be in two states",
            "How cats behave",
            "What cats eat",
            "Where cats live"
          ],
          correctAnswer: 0,
          explanation: "科学家们仍在争论猫是否可能真正处于两种状态。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '4',
          audioText: "This phenomenon was first described by Erwin Schrödinger in 1935.",
          question: "Who first described this phenomenon?",
          options: [
            "Erwin Schrödinger",
            "Albert Einstein",
            "Isaac Newton",
            "Niels Bohr"
          ],
          correctAnswer: 0,
          explanation: "这种现象最早由薛定谔在1935年描述。",
          difficulty: 'HARD',
          timeLimit: 20
        },
        {
          id: '5',
          audioText: "Join us next week when we'll discuss the future of quantum computing.",
          question: "What will be discussed next week?",
          options: [
            "Quantum computing",
            "Artificial intelligence",
            "Climate change",
            "Space exploration"
          ],
          correctAnswer: 0,
          explanation: "下周将讨论量子计算的未来。",
          difficulty: 'EASY',
          timeLimit: 30
        }
      ]
    };

    // 使用映射后的练习ID
    const defaultPracticeId = '1';
    const finalPracticeId = practices[mappedPracticeId] ? mappedPracticeId : defaultPracticeId;

    const selectedPractice = practices[finalPracticeId] || practices[defaultPracticeId];
    const selectedQuestions = questionsByPractice[finalPracticeId] || questionsByPractice[defaultPracticeId];

    return { practice: selectedPractice, questions: selectedQuestions };
  };

  useEffect(() => {
    // 检查TTS支持
    if (typeof window === 'undefined') return;

    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      setTtsSupported(false);
      return;
    }

    // 预加载语音列表
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error('speechSynthesis is not available');
      setTtsSupported(false);
      return;
    }

    // 强制获取语音列表，触发voiceschanged事件
    const voices = synth.getVoices();
    console.log('Initial voices loaded:', voices.length);

    // 如果语音列表为空，监听voiceschanged事件
    if (voices.length === 0) {
      synth.onvoiceschanged = () => {
        const loadedVoices = synth.getVoices();
        console.log('Voices loaded after onvoiceschanged:', loadedVoices.length);
        if (loadedVoices.length === 0) {
          console.warn('No voices available after voiceschanged event');
          setTtsSupported(false);
        }
        synth.onvoiceschanged = null;
      };
    }
  }, []);

  useEffect(() => {
    // 模拟加载听力练习数据
    setTimeout(() => {
      // 从查询参数获取练习ID
      const nextParam = searchParams?.get('next');
      const practiceId = nextParam || '1'; // 默认使用第一个练习

      const { practice: practiceData, questions: questionData } = getPracticeData(practiceId);

      setPractice(practiceData);
      setQuestions(questionData);
      setSelectedAnswers(new Array(questionData.length).fill(null));
      setIsAnswered(new Array(questionData.length).fill(false));
      setTimeRemaining(questionData[0]?.timeLimit || 30);
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isAnswered[currentQuestion] && timeRemaining > 0 && !practiceCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentQuestion, isAnswered, timeRemaining, practiceCompleted]);

  const playAudio = () => {
    if (questions[currentQuestion]) {
      const text = questions[currentQuestion].audioText;
      console.log('playAudio called with text:', text, 'playbackRate:', playbackRate);
      speakText(text, () => {
        console.log('Audio playback finished');
        setIsPlaying(false);
      }, playbackRate);
      setIsPlaying(true);
    } else {
      console.log('playAudio: no question found for currentQuestion:', currentQuestion);
    }
  };

  const pauseAudio = () => {
    console.log('pauseAudio called');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      console.log('Speech synthesis cancelled');
    }
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
      setAudioProgress(progress);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered[currentQuestion] || practiceCompleted) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    const newIsAnswered = [...isAnswered];
    newIsAnswered[currentQuestion] = true;
    setIsAnswered(newIsAnswered);

    setShowExplanation(true);
    pauseAudio();

    // 自动跳转到下一题或完成练习
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        goToQuestion(currentQuestion + 1);
      } else {
        completePractice();
      }
    }, 2000);
  };

  const handleTimeout = () => {
    if (isAnswered[currentQuestion] || practiceCompleted) return;

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = null;
    setSelectedAnswers(newSelectedAnswers);

    const newIsAnswered = [...isAnswered];
    newIsAnswered[currentQuestion] = true;
    setIsAnswered(newIsAnswered);

    setShowExplanation(true);
    pauseAudio();

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        goToQuestion(currentQuestion + 1);
      } else {
        completePractice();
      }
    }, 2000);
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= questions.length) return;

    setCurrentQuestion(index);
    setTimeRemaining(questions[index].timeLimit);
    setShowExplanation(false);
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const completePractice = () => {
    setPracticeCompleted(true);

    // 计算分数
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // 保存结果
    const result = {
      practiceId: practice?.id,
      title: practice?.title,
      score,
      correctCount,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('latestListeningResult', JSON.stringify(result));
  };

  const handleFinishPractice = () => {
    router.push('/listening/completed');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载听力练习中...</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到练习</h2>
        <Link
          href="/listening"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回听力训练
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 练习标题和信息 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{practice.title}</h1>
            <p className="text-gray-600">{practice.description}</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentQuestion + 1}/{questions.length}</div>
              <div className="text-sm text-gray-600">当前题目</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {selectedAnswers.filter(ans => ans !== null).length}
              </div>
              <div className="text-sm text-gray-600">已回答</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">难度</div>
            <div className="font-bold text-gray-900">{practice.difficulty}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">口音</div>
            <div className="font-bold text-gray-900">{practice.accent}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">积分</div>
            <div className="font-bold text-gray-900">{practice.points}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">总时长</div>
            <div className="font-bold text-gray-900">{Math.floor(practice.totalDuration / 60)}:{practice.totalDuration % 60}</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">练习进度</span>
            <span className="font-medium">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 主要练习区域 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {/* 音频播放器 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
          {!ttsSupported && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">音频播放限制</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>您的浏览器不支持文本转语音功能，或语音引擎未加载。</p>
                    <p className="mt-1">请尝试使用Chrome、Edge或Safari浏览器，或检查浏览器设置中是否启用了语音合成功能。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                    <div className="text-sm text-gray-600">点击播放按钮听录音</div>
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

            {/* 音频文本（练习时可隐藏） */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">📝 音频文本参考</h4>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 text-lg italic">
                  {questions[currentQuestion].audioText}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                提示：先尝试听录音理解内容，再查看文本确认
              </p>
            </div>
          </div>

          {/* 隐藏的audio元素用于播放控制 */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            className="hidden"
          />
        </div>

        {/* 当前题目 */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl font-bold text-gray-900">
                  题目 {currentQuestion + 1}
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
              <div className="text-sm text-gray-600 mb-2">剩余时间</div>
              <div className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                {timeRemaining}
              </div>
            </div>
          </div>

          {/* 选项 */}
          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                disabled={isAnswered[currentQuestion] || practiceCompleted}
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

        {/* 答案解析 */}
        {showExplanation && isAnswered[currentQuestion] && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">📚 答案解析</h4>
            <div className="text-gray-700 mb-4">
              {questions[currentQuestion].explanation}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                本题用时: {questions[currentQuestion].timeLimit - timeRemaining}秒
              </div>
              <div className="text-sm font-medium">
                {selectedAnswers[currentQuestion] === questions[currentQuestion].correctAnswer
                  ? '✅ 回答正确'
                  : '❌ 回答错误'}
              </div>
            </div>
          </div>
        )}

        {/* 题目导航 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="font-bold text-gray-900 mb-4">题目导航</h4>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`h-12 w-12 rounded-lg flex items-center justify-center text-lg font-medium ${
                  idx === currentQuestion
                    ? 'bg-indigo-600 text-white'
                    : isAnswered[idx]
                    ? selectedAnswers[idx] === questions[idx].correctAnswer
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <button
            onClick={() => goToQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            上一题
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => goToQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
            >
              下一题 →
            </button>
          ) : practiceCompleted ? (
            <button
              onClick={handleFinishPractice}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
            >
              完成练习 →
            </button>
          ) : (
            <button
              onClick={completePractice}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:opacity-90 font-medium"
            >
              结束练习
            </button>
          )}
        </div>
      </div>

      {/* 练习完成状态 */}
      {practiceCompleted && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <div className="h-20 w-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-white">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">练习完成！</h3>
            <p className="text-gray-600 mb-6">
              你已经完成了所有听力练习题目，点击下方按钮查看详细结果。
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setPracticeCompleted(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                返回检查
              </button>
              <button
                onClick={handleFinishPractice}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:opacity-90 font-medium"
              >
                查看结果 →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 返回导航 */}
      <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
        <Link
          href="/listening"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回听力训练
        </Link>
        <div className="text-sm text-gray-600">
          坚持听力练习，英语听力每天进步！
        </div>
      </div>
    </div>
  );
}