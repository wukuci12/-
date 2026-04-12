'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// 题型定义
type QuestionType = 'single_choice' | 'multiple_choice' | 'fill_blank' | 'true_false' | 'matching' | 'short_answer';

interface Question {
  id: number;
  type: QuestionType;
  title: string;
  content: string;
  options?: string[];
  correctAnswer: any;
  explanation?: string;
  points: number;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  points: number;
  questions: Question[];
  timeLimit?: number; // 分钟
}

interface Answer {
  questionId: number;
  answer: any;
}

export default function GrammarExercisePage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

  // 初始化练习数据
  useEffect(() => {
    const fetchExercise = async () => {
      setIsLoading(true);
      try {
        // 根据不同exerciseId返回不同的练习
        const exercisesData: Record<string, Exercise> = {
          '1': {
            id: '1',
            title: '基础时态练习',
            description: '掌握英语基本时态的用法',
            level: 'BEGINNER',
            points: 10,
            timeLimit: 10,
            questions: [
              { id: 1, type: 'single_choice', title: '时态选择', content: 'I ______ (watch) TV every evening.', options: ['watch', 'watches', 'am watching', 'watched'], correctAnswer: 0, explanation: '一般现在时表示习惯性动作，主语是I，动词用原形。', points: 2 },
              { id: 2, type: 'single_choice', title: '时态选择', content: 'She ______ (go) to school yesterday.', options: ['go', 'goes', 'went', 'going'], correctAnswer: 2, explanation: 'yesterday表示过去时间，用一般过去时。', points: 2 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'They ______ (play) football now.', correctAnswer: ['are playing'], explanation: 'now表示正在进行的动作，用现在进行时。', points: 3 },
              { id: 4, type: 'true_false', title: '判断正误', content: '"I am eatting dinner" is correct.', correctAnswer: false, explanation: 'eating的拼写错误，应该是eating。', points: 1 },
              { id: 5, type: 'single_choice', title: '时态选择', content: 'He ______ (be) to Beijing twice.', options: ['is', 'was', 'has been', 'have been'], correctAnswer: 2, explanation: 'twice表示次数，与现在完成时连用。', points: 2 },
            ],
          },
          '2': {
            id: '2',
            title: '动词不定式',
            description: '学习动词不定式的各种用法',
            level: 'BEGINNER',
            points: 10,
            timeLimit: 8,
            questions: [
              { id: 1, type: 'single_choice', title: '不定式', content: 'I want ______ (go) home.', options: ['to go', 'going', 'goes', 'went'], correctAnswer: 0, explanation: 'want to do sth. 表示想要做某事。', points: 2 },
              { id: 2, type: 'single_choice', title: '不定式', content: 'It is easy ______ (learn) English.', options: ['learn', 'to learn', 'learning', 'learns'], correctAnswer: 1, explanation: 'It is easy to do sth. 表示做某事很容易。', points: 2 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'She decided ______ (study) French.', correctAnswer: ['to study'], explanation: 'decide to do sth. 表示决定做某事。', points: 3 },
              { id: 4, type: 'true_false', title: '判断正误', content: '"I enjoy to swim" is correct.', correctAnswer: false, explanation: 'enjoy doing sth.，应该用动名词形式。', points: 1 },
              { id: 5, type: 'single_choice', title: '不定式', content: 'He made me ______ (laugh).', options: ['laugh', 'to laugh', 'laughing', 'laughed'], correctAnswer: 0, explanation: 'make sb. do sth. 表示让某人做某事，用动词原形。', points: 2 },
            ],
          },
          '3': {
            id: '3',
            title: '动名词和现在分词',
            description: '区分动名词和现在分词的用法',
            level: 'INTERMEDIATE',
            points: 15,
            timeLimit: 12,
            questions: [
              { id: 1, type: 'single_choice', title: '动名词', content: 'I enjoy ______ (swim) in the summer.', options: ['swim', 'to swim', 'swimming', 'swims'], correctAnswer: 2, explanation: 'enjoy doing sth. 表示喜欢做某事。', points: 3 },
              { id: 2, type: 'single_choice', title: '现在分词', content: 'The ______ (running) boy is my brother.', options: ['run', 'runs', 'runned', 'running'], correctAnswer: 3, explanation: '现在分词作定语修饰boy。', points: 3 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'She is good at ______ (dance).', correctAnswer: ['dancing'], explanation: 'be good at doing sth. 表示擅长做某事。', points: 3 },
              { id: 4, type: 'multiple_choice', title: '选择', content: 'Which verbs are followed by gerund?', options: ['enjoy', 'finish', 'to go', 'suggest'], correctAnswer: [0, 1, 3], explanation: 'enjoy, finish, suggest后面接动名词。', points: 3 },
              { id: 5, type: 'true_false', title: '判断', content: '"I remember to meet her" means I met her.', correctAnswer: false, explanation: 'remember to do表示记得要做某事，remember doing表示记得做过某事。', points: 3 },
            ],
          },
          '4': {
            id: '4',
            title: '定语从句',
            description: '掌握定语从句的结构和使用',
            level: 'INTERMEDIATE',
            points: 15,
            timeLimit: 15,
            questions: [
              { id: 1, type: 'single_choice', title: '定语从句', content: 'The man ______ helped me is my teacher.', options: ['who', 'which', 'where', 'when'], correctAnswer: 0, explanation: 'who引导定语从句，指人。', points: 3 },
              { id: 2, type: 'single_choice', title: '定语从句', content: 'This is the book ______ I bought yesterday.', options: ['who', 'which', 'where', 'when'], correctAnswer: 1, explanation: 'which引导定语从句，指物。', points: 3 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'The girl ______ name is Lucy is my classmate.', correctAnswer: ['whose'], explanation: 'whose引导定语从句，表示所属关系。', points: 3 },
              { id: 4, type: 'single_choice', title: '定语从句', content: 'I still remember the day ______ we first met.', options: ['who', 'which', 'where', 'what'], correctAnswer: 2, explanation: 'where引导定语从句，在从句中作地点状语。', points: 3 },
              { id: 5, type: 'true_false', title: '判断', content: '"The book which I bought it is expensive" is correct.', correctAnswer: false, explanation: '定语从句中which是主语或宾语，后面不能再加it。', points: 3 },
            ],
          },
          '5': {
            id: '5',
            title: '状语从句',
            description: '学习各种状语从句的连接词',
            level: 'INTERMEDIATE',
            points: 15,
            timeLimit: 12,
            questions: [
              { id: 1, type: 'single_choice', title: '状语从句', content: '______ it rains, we will stay at home.', options: ['If', 'Unless', 'Because', 'Although'], correctAnswer: 0, explanation: 'if引导条件状语从句。', points: 3 },
              { id: 2, type: 'single_choice', title: '状语从句', content: '______ he was tired, he kept working.', options: ['Although', 'Because', 'If', 'When'], correctAnswer: 0, explanation: 'although引导让步状语从句。', points: 3 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'I will call you ______ I arrive.', correctAnswer: ['when'], explanation: 'when引导时间状语从句。', points: 3 },
              { id: 4, type: 'single_choice', title: '状语从句', content: '______ you work hard, you will succeed.', options: ['Because', 'If', 'Although', 'Before'], correctAnswer: 1, explanation: 'if引导条件状语从句。', points: 3 },
              { id: 5, type: 'true_false', title: '判断', content: '"Because it was raining, so we stayed home" is correct.', correctAnswer: false, explanation: 'because和so不能同时使用。', points: 3 },
            ],
          },
          '6': {
            id: '6',
            title: '名词性从句',
            description: '掌握主语从句、宾语从句等用法',
            level: 'ADVANCED',
            points: 20,
            timeLimit: 18,
            questions: [
              { id: 1, type: 'single_choice', title: '名词性从句', content: '______ he will come is uncertain.', options: ['What', 'That', 'Whether', 'Who'], correctAnswer: 1, explanation: 'that引导主语从句，that可以省略。', points: 4 },
              { id: 2, type: 'single_choice', title: '名词性从句', content: 'I don\'t know ______ he will come.', options: ['that', 'whether', 'what', 'which'], correctAnswer: 1, explanation: 'whether引导宾语从句，表示是否。', points: 4 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'The question is ______ we should go.', correctAnswer: ['where'], explanation: 'where引导表语从句。', points: 4 },
              { id: 4, type: 'single_choice', title: '名词性从句', content: '______ he said is true.', options: ['What', 'That', 'If', 'Because'], correctAnswer: 0, explanation: 'what引导主语从句，在从句中作said的宾语。', points: 4 },
              { id: 5, type: 'true_false', title: '判断', content: '"I matter what you think" is correct grammar.', correctAnswer: false, explanation: "应该是I don't matter what you think 或 What you think matters", points: 4 },
            ],
          },
          '7': {
            id: '7',
            title: '虚拟语气',
            description: '掌握虚拟语气的各种形式和用法',
            level: 'ADVANCED',
            points: 20,
            timeLimit: 15,
            questions: [
              { id: 1, type: 'single_choice', title: '虚拟语气', content: 'If I ______ rich, I would buy a car.', options: ['am', 'was', 'were', 'be'], correctAnswer: 2, explanation: '与现在事实相反的虚拟语气，if从句用were。', points: 4 },
              { id: 2, type: 'single_choice', title: '虚拟语气', content: 'If he ______ here, he would help us.', options: ['is', 'was', 'were', 'be'], correctAnswer: 2, explanation: '与现在事实相反，从句用were。', points: 4 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'If I had known that, I ______ (tell) you.', correctAnswer: ['would have told'], explanation: '与过去事实相反，主句用would have done。', points: 4 },
              { id: 4, type: 'single_choice', title: '虚拟语气', content: '______ I were you, I would go.', options: ['If', 'Unless', 'As if', 'Because'], correctAnswer: 0, explanation: 'if I were you是与现在事实相反的虚拟语气。', points: 4 },
              { id: 5, type: 'true_false', title: '判断', content: '"It is important that he comes on time" should use "come".', correctAnswer: false, explanation: 'It is important that后面的从句用虚拟语气(should come或come)。', points: 4 },
            ],
          },
          '8': {
            id: '8',
            title: '倒装句',
            description: '学习英语倒装句的构成和用法',
            level: 'ADVANCED',
            points: 20,
            timeLimit: 10,
            questions: [
              { id: 1, type: 'single_choice', title: '倒装句', content: '______ the meeting, he left the room.', options: ['After finishing', 'Having finished', 'Finished', 'To finish'], correctAnswer: 1, explanation: 'Having finished表示完成的动作，可以放在句首。', points: 4 },
              { id: 2, type: 'single_choice', title: '倒装句', content: 'Only then ______ the importance of study.', options: ['I realized', 'did I realize', 'realized I', 'I did realize'], correctAnswer: 1, explanation: 'only放在句首，后面的句子要部分倒装。', points: 4 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'Never ______ such a beautiful place.', correctAnswer: ['have I seen'], explanation: 'never放在句首，主句要部分倒装。', points: 4 },
              { id: 4, type: 'single_choice', title: '倒装句', content: '______, he is always late.', options: ['No matter how hard he tries', 'Try as he might', 'However hard does he try', 'He tries hard'], correctAnswer: 1, explanation: 'as引导的让步状语从句可以倒装。', points: 4 },
              { id: 5, type: 'true_false', title: '判断', content: '"Here comes the bus" is a complete inversion.', correctAnswer: true, explanation: 'here, there, out等副词放在句首，主语是名词时要完全倒装。', points: 4 },
            ],
          },
          '9': {
            id: '9',
            title: '强调句型',
            description: '掌握It is/was...that强调句型',
            level: 'INTERMEDIATE',
            points: 15,
            timeLimit: 10,
            questions: [
              { id: 1, type: 'single_choice', title: '强调句', content: 'It was yesterday ______ I met her.', options: ['that', 'when', 'where', 'what'], correctAnswer: 0, explanation: '强调句用that引导。', points: 3 },
              { id: 2, type: 'single_choice', title: '强调句', content: 'It is he ______ helped me.', options: ['that', 'who', 'whom', 'whose'], correctAnswer: 1, explanation: '强调人时可以用who。', points: 3 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'It was in the park ______ they met.', correctAnswer: ['that'], explanation: '强调地点用that。', points: 3 },
              { id: 4, type: 'single_choice', title: '强调句', content: '______ made him angry was the news.', options: ['What', 'That', 'Which', 'Who'], correctAnswer: 0, explanation: 'what引导主语从句。', points: 3 },
              { id: 5, type: 'true_false', title: '判断', content: '"It is me who is to blame" is grammatically correct.', correctAnswer: true, explanation: '强调句中who后面的动词与被强调的人称一致。', points: 3 },
            ],
          },
          '10': {
            id: '10',
            title: '主谓一致',
            description: '确保主语和谓语在人称和数上一致',
            level: 'BEGINNER',
            points: 10,
            timeLimit: 8,
            questions: [
              { id: 1, type: 'single_choice', title: '主谓一致', content: 'Each student ______ a book.', options: ['have', 'has', 'having', 'had'], correctAnswer: 1, explanation: 'each作主语，谓语用单数。', points: 2 },
              { id: 2, type: 'single_choice', title: '主谓一致', content: 'The news ______ very good.', options: ['is', 'are', 'were', 'be'], correctAnswer: 0, explanation: 'news是不可数名词，谓语用单数。', points: 2 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'The students ______ studying hard.', correctAnswer: ['are'], explanation: 'the students是复数，谓语用复数。', points: 2 },
              { id: 4, type: 'single_choice', title: '主谓一致', content: 'There ______ a book and some pens on the desk.', options: ['is', 'are', 'were', 'be'], correctAnswer: 0, explanation: 'there be句型，谓语与最近的主语一致。', points: 2 },
              { id: 5, type: 'true_false', title: '判断', content: '"Mathematics are difficult" is correct.', correctAnswer: false, explanation: 'mathematics表示学科，用单数谓语。', points: 2 },
            ],
          },
          '11': {
            id: '11',
            title: '比较级和最高级',
            description: '掌握形容词和副词的比较级用法',
            level: 'BEGINNER',
            points: 10,
            timeLimit: 10,
            questions: [
              { id: 1, type: 'single_choice', title: '比较级', content: 'This book is ______ than that one.', options: ['interesting', 'more interesting', 'most interesting', 'as interesting'], correctAnswer: 1, explanation: 'than前面用比较级。', points: 2 },
              { id: 2, type: 'single_choice', title: '最高级', content: 'He is the ______ student in our class.', options: ['tall', 'taller', 'tallest', 'most tall'], correctAnswer: 2, explanation: 'the+最高级表示最...。', points: 2 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'This problem is ______ (difficult) than that one.', correctAnswer: ['more difficult'], explanation: 'difficult是多音节词，用more构成比较级。', points: 3 },
              { id: 4, type: 'single_choice', title: '比较级', content: 'The more you practice, the ______ you become.', options: ['good', 'better', 'best', 'more good'], correctAnswer: 1, explanation: 'the more...the better表示越...越...。', points: 2 },
              { id: 5, type: 'true_false', title: '判断', content: '"She is more better than me" is correct.', correctAnswer: false, explanation: 'better本身就是比较级，不需要再加more。', points: 1 },
            ],
          },
          '12': {
            id: '12',
            title: '被动语态',
            description: '学习被动语态的构成和用法',
            level: 'INTERMEDIATE',
            points: 15,
            timeLimit: 12,
            questions: [
              { id: 1, type: 'single_choice', title: '被动语态', content: 'The work ______ by him yesterday.', options: ['does', 'did', 'is done', 'was done'], correctAnswer: 3, explanation: 'yesterday表示过去时间，用一般过去时的被动语态。', points: 3 },
              { id: 2, type: 'single_choice', title: '被动语态', content: 'The book ______ by many people.', options: ['reads', 'is read', 'was reading', 'has read'], correctAnswer: 1, explanation: 'by many people表示被许多人读，用被动语态。', points: 3 },
              { id: 3, type: 'fill_blank', title: '填空', content: 'The song ______ (sing) by her now.', correctAnswer: ['is being sung'], explanation: 'now表示正在进行的被动动作，用现在进行时的被动语态。', points: 4 },
              { id: 4, type: 'single_choice', title: '被动语态', content: 'It ______ that the work ______ tomorrow.', options: ['is said / will finish', 'is said / will be finished', 'said / will finish', 'says / will be finished'], correctAnswer: 1, explanation: 'It is said that...是固定结构，被动语态。', points: 3 },
              { id: 5, type: 'true_false', title: '判断', content: '"The letter was wrote by John" is grammatically correct.', correctAnswer: false, explanation: 'write的过去分词是written。', points: 2 },
            ],
          },
        };

        // 获取对应的练习或使用默认
        const mockExercise = exercisesData[exerciseId] || exercisesData['1'];

        setTimeout(() => {
          setExercise(mockExercise);
          setStartTime(Date.now());
          if (mockExercise.timeLimit) {
            setTimeLeft(mockExercise.timeLimit * 60);
          }
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取练习数据错误:', error);
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  // 计时器
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (prev === 1) {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted]);

  // 处理答案变化
  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingIndex] = { questionId, answer };
        return newAnswers;
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  // 获取当前问题的答案
  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === exercise?.questions[currentQuestion].id)?.answer;
  };

  // 处理题目导航
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (exercise?.questions.length || 0)) {
      setCurrentQuestion(index);
    }
  };

  // 处理提交
  const handleSubmit = async () => {
    if (!exercise || isSubmitting || isCompleted) return;

    setIsSubmitting(true);
    try {
      const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

      // TODO: 实际API调用
      // const response = await fetch('/api/grammar', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     exerciseId: exercise.id,
      //     answers: answers.reduce((acc, curr) => {
      //       acc[curr.questionId] = curr.answer;
      //       return acc;
      //     }, {} as Record<number, any>),
      //     timeSpent,
      //   }),
      // });
      // const result = await response.json();

      // 模拟结果 - 根据用户答案计算分数
      setTimeout(() => {
        let correctCount = 0;
        let totalPoints = 0;
        const details: Record<string, any> = {};

        exercise.questions.forEach((q, index) => {
          const userAnswer = answers.find(a => a.questionId === q.id)?.answer;
          let isCorrect = false;

          if (userAnswer !== undefined) {
            if (Array.isArray(q.correctAnswer)) {
              isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer);
            } else {
              isCorrect = userAnswer === q.correctAnswer;
            }
          }

          if (isCorrect) {
            correctCount++;
            totalPoints += q.points;
          }

          details[`question${index + 1}`] = {
            correct: isCorrect,
            userAnswer: userAnswer !== undefined ? userAnswer : '未作答',
            correctAnswer: q.correctAnswer,
          };
        });

        const score = Math.round((correctCount / exercise.questions.length) * 100);

        const mockResult = {
          success: true,
          data: {
            score,
            correctCount,
            totalQuestions: exercise.questions.length,
            details,
            correctAnswers: exercise.questions.reduce((acc, q) => {
              acc[q.id] = q.correctAnswer;
              return acc;
            }, {} as Record<number, any>),
          },
        };

        setResult(mockResult);
        setIsCompleted(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('提交答案错误:', error);
      setIsSubmitting(false);
    }
  };

  // 渲染不同题型
  const renderQuestion = (question: Question) => {
    const currentAnswer = answers.find(a => a.questionId === question.id)?.answer;

    switch (question.type) {
      case 'single_choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  currentAnswer === index ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={currentAnswer === index}
                  onChange={() => handleAnswerChange(question.id, index)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  Array.isArray(currentAnswer) && currentAnswer.includes(index) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={Array.isArray(currentAnswer) && currentAnswer.includes(index)}
                  onChange={(e) => {
                    const newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                    if (e.target.checked) {
                      newAnswer.push(index);
                    } else {
                      const idx = newAnswer.indexOf(index);
                      if (idx > -1) newAnswer.splice(idx, 1);
                    }
                    handleAnswerChange(question.id, newAnswer.sort());
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'fill_blank':
        const blanks = question.content.split(/(______)/g);
        return (
          <div className="space-y-4">
            <div className="text-gray-700">
              {blanks.map((part, index) => {
                if (part === '______') {
                  const blankIndex = Math.floor(index / 2);
                  return (
                    <input
                      key={index}
                      type="text"
                      value={Array.isArray(currentAnswer) ? currentAnswer[blankIndex] || '' : ''}
                      onChange={(e) => {
                        const newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
                        newAnswer[blankIndex] = e.target.value;
                        handleAnswerChange(question.id, newAnswer);
                      }}
                      className="inline-block mx-2 px-3 py-1 border-b-2 border-indigo-500 bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 min-w-[120px]"
                      placeholder="输入答案"
                    />
                  );
                }
                return <span key={index}>{part}</span>;
              })}
            </div>
          </div>
        );

      case 'true_false':
        return (
          <div className="flex space-x-6">
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1 ${
                currentAnswer === true ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={currentAnswer === true}
                onChange={() => handleAnswerChange(question.id, true)}
                className="h-4 w-4 text-green-600 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">正确</span>
            </label>
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 flex-1 ${
                currentAnswer === false ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={currentAnswer === false}
                onChange={() => handleAnswerChange(question.id, false)}
                className="h-4 w-4 text-red-600 focus:ring-red-500"
              />
              <span className="ml-3 text-gray-700">错误</span>
            </label>
          </div>
        );

      case 'short_answer':
        return (
          <div>
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="请输入你的答案..."
            />
          </div>
        );

      default:
        return <div className="text-gray-500">暂不支持的题型</div>;
    }
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载练习中...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">练习不存在</h2>
        <Link
          href="/grammar"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          返回语法学习
        </Link>
      </div>
    );
  }

  if (isCompleted && result) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* 结果标题 */}
        <div className="text-center mb-8">
          <div className="h-20 w-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">练习完成！</h1>
          <p className="text-xl text-gray-600">你获得了 {result.data.score} 分</p>
        </div>

        {/* 成绩总结 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">练习结果</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">{result.data.score}</div>
              <div className="text-gray-600">得分</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">
                {Object.values(result.data.details).filter((d: any) => d.correct).length}/{exercise.questions.length}
              </div>
              <div className="text-gray-600">正确题数</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="text-4xl font-bold text-gray-900">
                {Math.round((Object.values(result.data.details).filter((d: any) => d.correct).length / exercise.questions.length) * 100)}%
              </div>
              <div className="text-gray-600">正确率</div>
            </div>
          </div>

          {/* 详细结果 */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">题目解析</h3>
            {exercise.questions.map((question, index) => {
              const detail = result.data.details[`question${question.id}`];
              const isCorrect = detail?.correct;

              return (
                <div
                  key={question.id}
                  className={`p-6 border rounded-xl ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">第 {index + 1} 题</h4>
                    </div>
                    <span className="text-sm text-gray-500">{question.points} 分</span>
                  </div>

                  <div className="mb-4">
                    <div className="text-gray-700 mb-2">{question.content}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">你的答案</div>
                        <div className="font-medium">{JSON.stringify(detail?.userAnswer)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">正确答案</div>
                        <div className="font-medium text-green-700">{JSON.stringify(detail?.correctAnswer)}</div>
                      </div>
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="p-4 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">解析：</div>
                      <div className="text-gray-700">{question.explanation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/grammar`}
              className="py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
            >
              📚 继续学习
            </Link>
            <button
              onClick={() => {
                setAnswers([]);
                setCurrentQuestion(0);
                setIsCompleted(false);
                setResult(null);
                setStartTime(Date.now());
                if (exercise.timeLimit) {
                  setTimeLeft(exercise.timeLimit * 60);
                }
              }}
              className="py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium"
            >
              🔄 重新练习
            </button>
            <Link
              href="/"
              className="py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:opacity-90 font-medium text-center"
            >
              🏠 返回主页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 练习进行中的界面
  const question = exercise.questions[currentQuestion];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 顶部信息栏 */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
            <p className="text-gray-600 mt-1">{exercise.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            {timeLeft !== null && (
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                <span className="font-bold">{formatTime(timeLeft)}</span>
                <span className="text-sm ml-2">剩余时间</span>
              </div>
            )}
            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg">
              <span className="font-bold">{currentQuestion + 1}/{exercise.questions.length}</span>
              <span className="text-sm ml-2">题目</span>
            </div>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg">
              <span className="font-bold">{exercise.points}</span>
              <span className="text-sm ml-2">积分</span>
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>练习进度</span>
            <span>{Math.round(((currentQuestion + 1) / exercise.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              style={{ width: `${((currentQuestion + 1) / exercise.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：题目导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">题目导航</h3>
            <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {exercise.questions.map((q, index) => {
                const isAnswered = answers.some(a => a.questionId === q.id);
                const isCurrent = index === currentQuestion;
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(index)}
                    className={`h-12 w-12 rounded-lg flex items-center justify-center font-medium transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                        : isAnswered
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已答题目</span>
                <span className="font-medium">{answers.length}/{exercise.questions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">当前分值</span>
                <span className="font-medium">{question.points} 分</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">总积分</span>
                <span className="font-medium">{exercise.points} 分</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 space-y-3">
              {currentQuestion < exercise.questions.length - 1 ? (
                <button
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  下一题
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || answers.length < exercise.questions.length}
                  className={`w-full py-3 rounded-lg font-medium ${
                    isSubmitting || answers.length < exercise.questions.length
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? '提交中...' : '提交答案'}
                </button>
              )}

              <Link
                href="/grammar"
                className="block w-full py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                返回列表
              </Link>
            </div>

            {/* 提示 */}
            {answers.length < exercise.questions.length && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ 还有 {exercise.questions.length - answers.length} 题未回答
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧：题目内容 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* 题目头部 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-2">
                  第 {currentQuestion + 1} 题
                </div>
                <h2 className="text-xl font-bold text-gray-900">{question.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{question.points} 分</div>
                <div className="text-sm text-gray-500">本题分值</div>
              </div>
            </div>

            {/* 题目内容 */}
            <div className="mb-8">
              <div className="text-lg text-gray-700 mb-6 whitespace-pre-wrap">
                {question.content}
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-4">请选择答案：</div>
                {renderQuestion(question)}
              </div>
            </div>

            {/* 题目类型提示 */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">📝</span>
                <div className="text-sm text-gray-600">
                  {question.type === 'single_choice' && '单选题：选择一个正确答案'}
                  {question.type === 'multiple_choice' && '多选题：选择所有正确答案'}
                  {question.type === 'fill_blank' && '填空题：在空白处填写正确的单词或短语'}
                  {question.type === 'true_false' && '判断题：判断句子语法是否正确'}
                  {question.type === 'short_answer' && '简答题：简要回答题目问题'}
                </div>
              </div>
            </div>
          </div>

          {/* 底部导航 */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => goToQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              ← 上一题
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => handleAnswerChange(question.id, null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                清除答案
              </button>

              {currentQuestion < exercise.questions.length - 1 ? (
                <button
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
                >
                  下一题 →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90'
                  }`}
                >
                  {isSubmitting ? '提交中...' : '提交答案'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}