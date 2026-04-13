'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ReadingArticle {
  id: string;
  title: string;
  content: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  genre: 'STORY' | 'NEWS' | 'SCIENCE' | 'HISTORY' | 'CULTURE' | 'OTHER';
  wordCount: number;
  estimatedTime: number;
  vocabulary: Array<{
    word: string;
    meaning: string;
  }>;
}

interface ReadingQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  points: number;
}

interface ReadingPractice {
  article: ReadingArticle;
  questions: ReadingQuestion[];
  currentQuestionIndex: number;
  userAnswers: (string | boolean | null)[];
  showResults: boolean;
  score: number;
  timeSpent: number;
  startTime: number;
}

// 文章数据映射
const articlesData: Record<string, { article: ReadingArticle; questions: ReadingQuestion[] }> = {
  'res-1': {
    article: {
      id: 'res-1',
      title: 'The Secret Garden',
      content: `The Secret Garden is a classic novel written by Frances Hodgson Burnett. The story tells of a young girl named Mary Lennox who was born in India to wealthy British parents. After her parents die in a cholera epidemic, she is sent to live with her uncle in England.

Mary is a lonely and disagreeable child who has never been loved by anyone. She arrives at Misselthwaite Manor, a large house on the Yorkshire moors. There, she discovers a hidden garden that has been locked away for ten years.

With the help of a local boy named Dickon and her sickly cousin Colin, Mary brings the garden back to life. As she tends to the garden, something magical happens - Mary herself begins to change. She becomes healthier, happier, and more kind.

The novel explores themes of nature, healing, and the transformative power of love. It shows how even the saddest hearts can be mended through friendship and connection with nature. The secret garden becomes a place of rebirth and renewal for all who tend it.`,
      level: 'BEGINNER',
      genre: 'STORY',
      wordCount: 200,
      estimatedTime: 5,
      vocabulary: [
        { word: 'cholera', meaning: '霍乱' },
        { word: 'discover', meaning: '发现' },
        { word: 'lonely', meaning: '孤独的' },
        { word: 'magic', meaning: '神奇的' },
        { word: 'rebirth', meaning: '重生' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Where was Mary Lennox born?',
        options: ['India', 'England', 'America', 'China'],
        correctAnswer: 'India',
        explanation: '文章明确提到："The story tells of a young girl named Mary Lennox who was born in India."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Mary discovered a secret garden at Misselthwaite Manor.',
        correctAnswer: true,
        explanation: '文章提到："There, she discovers a hidden garden that has been locked away for ten years."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Who helped Mary bring the garden back to life?',
        options: ['Her mother', 'Dickon and Colin', 'Her uncle', 'A gardener'],
        correctAnswer: 'Dickon and Colin',
        explanation: '文章说："With the help of a local boy named Dickon and her sickly cousin Colin..."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'What did Mary become as she tended to the garden?',
        correctAnswer: 'healthier, happier, and more kind',
        explanation: '文章提到："As she tends to the garden, something magical happens - Mary herself begins to change. She becomes healthier, happier, and more kind."',
        points: 10,
      },
    ],
  },
  'res-4': {
    article: {
      id: 'res-4',
      title: 'The Solar System',
      content: `Our solar system consists of the Sun and everything that orbits around it. This includes eight planets, their moons, dwarf planets, asteroids, comets, and other celestial objects.

The eight planets in order from the Sun are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Mercury is the closest planet to the Sun, while Neptune is the farthest.

The inner planets - Mercury, Venus, Earth, and Mars - are called terrestrial planets because they have solid, rocky surfaces. The outer planets - Jupiter, Saturn, Uranus, and Neptune - are gas giants with thick atmospheres and no solid surfaces.

Jupiter is the largest planet in our solar system. It is so big that all other planets could fit inside it. Saturn is famous for its beautiful rings made of ice and rock. Earth is the only planet known to have life, while Mars is often called the "Red Planet" because of its rusty red color.

Scientists continue to explore our solar system using telescopes and space probes. Many exciting discoveries await us in the future!`,
      level: 'BEGINNER',
      genre: 'SCIENCE',
      wordCount: 180,
      estimatedTime: 4,
      vocabulary: [
        { word: 'solar system', meaning: '太阳系' },
        { word: 'orbit', meaning: '环绕运行' },
        { word: 'planet', meaning: '行星' },
        { word: 'atmosphere', meaning: '大气层' },
        { word: 'celestial', meaning: '天体的' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'How many planets are in our solar system?',
        options: ['Six', 'Seven', 'Eight', 'Nine'],
        correctAnswer: 'Eight',
        explanation: '文章明确提到："The eight planets in order from the Sun are..."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Jupiter is the smallest planet in our solar system.',
        correctAnswer: false,
        explanation: '文章说："Jupiter is the largest planet in our solar system."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Why is Mars called the "Red Planet"?',
        options: ['It is hot', 'It has rusty red color', 'It has red plants', 'It reflects red light'],
        correctAnswer: 'It has rusty red color',
        explanation: '文章提到："Mars is often called the Red Planet because of its rusty red color."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Which planet is famous for its beautiful rings?',
        correctAnswer: 'Saturn',
        explanation: '文章说："Saturn is famous for its beautiful rings made of ice and rock."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Earth is the only planet known to have life.',
        correctAnswer: true,
        explanation: '文章明确说明："Earth is the only planet known to have life."',
        points: 10,
      },
    ],
  },
  'res-6': {
    article: {
      id: 'res-6',
      title: 'Traditional Chinese Festivals',
      content: `China has a rich tradition of colorful festivals that have been celebrated for thousands of years. These festivals reflect the history, culture, and beliefs of the Chinese people.

The Spring Festival, also known as Chinese New Year, is the most important traditional festival in China. It usually falls between late January and mid-February. During this time, families gather together to enjoy a big dinner, watch fireworks, and give red envelopes with lucky money to children.

The Dragon Boat Festival is celebrated on the fifth day of the fifth lunar month. People race dragon boats and eat zongzi, a traditional food made of sticky rice wrapped in bamboo leaves. This festival honors the ancient poet Qu Yuan.

The Mid-Autumn Festival is held on the 15th day of the 8th lunar month. Families gather to appreciate the full moon and eat mooncakes, a round pastry filled with sweet or savory fillings. It symbolizes family reunion and harmony.

These festivals show the importance of family, tradition, and respect for nature in Chinese culture. They continue to be celebrated by Chinese communities all around the world.`,
      level: 'BEGINNER',
      genre: 'CULTURE',
      wordCount: 190,
      estimatedTime: 5,
      vocabulary: [
        { word: 'festival', meaning: '节日' },
        { word: 'tradition', meaning: '传统' },
        { word: 'lunar', meaning: '农历的' },
        { word: 'symbolize', meaning: '象征' },
        { word: 'reunion', meaning: '团聚' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which is the most important traditional festival in China?',
        options: ['Dragon Boat Festival', 'Mid-Autumn Festival', 'Spring Festival', 'National Day'],
        correctAnswer: 'Spring Festival',
        explanation: '文章说："The Spring Festival, also known as Chinese New Year, is the most important traditional festival in China."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Red envelopes are given to children during the Spring Festival.',
        correctAnswer: true,
        explanation: '文章提到："give red envelopes with lucky money to children" during the Spring Festival.',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'What is zongzi made of?',
        options: ['Flour', 'Sticky rice', 'Rice noodles', 'Wheat'],
        correctAnswer: 'Sticky rice',
        explanation: '文章说："zongzi, a traditional food made of sticky rice wrapped in bamboo leaves."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'What food is eaten during the Mid-Autumn Festival?',
        correctAnswer: 'mooncakes',
        explanation: '文章提到 people eat mooncakes during the Mid-Autumn Festival.',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'The Dragon Boat Festival honors the ancient poet Qu Yuan.',
        correctAnswer: true,
        explanation: '文章说："This festival honors the ancient poet Qu Yuan."',
        points: 10,
      },
    ],
  },
  'res-2': {
    article: {
      id: 'res-2',
      title: 'Climate Change Report',
      content: `Climate change is one of the most pressing issues facing our planet today. Recent scientific reports show that global temperatures have been rising steadily over the past century, leading to significant changes in weather patterns and ecosystems around the world.

The primary cause of this warming is human activities, particularly the burning of fossil fuels like coal, oil, and natural gas. These activities release large amounts of greenhouse gases into the atmosphere, which trap heat and create a "greenhouse effect." As a result, our planet is warming at an unprecedented rate.

The effects of climate change are already being felt worldwide. We are seeing more frequent and severe weather events, including hurricanes, droughts, and floods. Polar ice caps are melting, causing sea levels to rise. Many animal and plant species are being forced to migrate or face extinction as their habitats change.

However, there is still hope. Governments, businesses, and individuals around the world are taking action to reduce greenhouse gas emissions and adapt to the changing climate. Renewable energy sources like solar and wind power are becoming more affordable and popular. By working together, we can still prevent the worst effects of climate change and create a more sustainable future for generations to come.`,
      level: 'INTERMEDIATE',
      genre: 'NEWS',
      wordCount: 250,
      estimatedTime: 8,
      vocabulary: [
        { word: 'climate change', meaning: '气候变化' },
        { word: 'greenhouse effect', meaning: '温室效应' },
        { word: 'ecosystem', meaning: '生态系统' },
        { word: 'renewable', meaning: '可再生的' },
        { word: 'sustainable', meaning: '可持续的' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the primary cause of global warming?',
        options: ['Human activities', 'Natural climate cycles', 'Volcanic eruptions', 'Ocean currents'],
        correctAnswer: 'Human activities',
        explanation: '文章明确指出："The primary cause of this warming is human activities, particularly the burning of fossil fuels."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Climate change is causing polar ice caps to melt.',
        correctAnswer: true,
        explanation: '文章提到："Polar ice caps are melting, causing sea levels to rise."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Which energy sources are becoming more popular according to the article?',
        options: ['Solar and wind power', 'Coal and oil', 'Nuclear energy', 'Natural gas'],
        correctAnswer: 'Solar and wind power',
        explanation: '文章说："Renewable energy sources like solar and wind power are becoming more affordable and popular."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one effect of climate change mentioned in the article.',
        correctAnswer: 'more frequent and severe weather events',
        explanation: '文章提到："We are seeing more frequent and severe weather events, including hurricanes, droughts, and floods."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'There is still hope to prevent the worst effects of climate change.',
        correctAnswer: true,
        explanation: '文章说："However, there is still hope...By working together, we can still prevent the worst effects of climate change."',
        points: 10,
      },
    ],
  },
  'res-3': {
    article: {
      id: 'res-3',
      title: 'Albert Einstein Biography',
      content: `Albert Einstein is one of the most famous scientists in history. He was born in Germany in 1879 and showed an early interest in mathematics and physics. However, his academic journey was not straightforward. He struggled in traditional school settings and was often considered a poor student by his teachers.

Despite these early challenges, Einstein went on to revolutionize our understanding of physics. In 1905, he published his theory of special relativity, which introduced the famous equation E=mc². This theory changed forever how we think about space, time, and energy. Later, in 1915, he published his theory of general relativity, which described gravity as a curvature of space-time.

Einstein's work earned him the Nobel Prize in Physics in 1921. However, he is perhaps even better known for his humanitarian efforts and his advocacy for peace. He was a strong supporter of civil rights and spoke out against discrimination.

When Hitler came to power in Germany, Einstein emigrated to the United States. He became a professor at Princeton University and later became an American citizen. He continued his scientific work until his death in 1955, leaving behind a legacy that continues to influence science today.`,
      level: 'INTERMEDIATE',
      genre: 'HISTORY',
      wordCount: 220,
      estimatedTime: 7,
      vocabulary: [
        { word: 'relativity', meaning: '相对论' },
        { word: 'equation', meaning: '方程式' },
        { word: 'Nobel Prize', meaning: '诺贝尔奖' },
        { word: 'emigrated', meaning: '移居' },
        { word: 'legacy', meaning: '遗产/遗赠' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'When was Einstein born?',
        options: ['1879', '1889', '1899', '1905'],
        correctAnswer: '1879',
        explanation: '文章说："He was born in Germany in 1879."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Einstein won the Nobel Prize in Physics.',
        correctAnswer: true,
        explanation: '文章提到："Einstein\'s work earned him the Nobel Prize in Physics in 1921."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'What year did Einstein publish his theory of special relativity?',
        options: ['1905', '1915', '1921', '1955'],
        correctAnswer: '1905',
        explanation: '文章说："In 1905, he published his theory of special relativity."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'What university did Einstein work at in the United States?',
        correctAnswer: 'Princeton University',
        explanation: '文章说："He became a professor at Princeton University."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Einstein was considered a good student in traditional school settings.',
        correctAnswer: false,
        explanation: '文章说："He struggled in traditional school settings and was often considered a poor student by his teachers."',
        points: 10,
      },
    ],
  },
  'res-5': {
    article: {
      id: 'res-5',
      title: 'Artificial Intelligence',
      content: `Artificial Intelligence, or AI, is rapidly changing our world. From voice assistants like Siri and Alexa to self-driving cars, AI is becoming increasingly integrated into our daily lives. But what exactly is AI, and how is it developed?

AI refers to computer systems that can perform tasks that typically require human intelligence. These tasks include visual perception, speech recognition, decision-making, and language translation. Machine learning is a key technique used to develop AI systems. Instead of being explicitly programmed, AI systems learn from large amounts of data.

The applications of AI are vast. In healthcare, AI is helping doctors diagnose diseases more accurately. In finance, it detects fraudulent transactions. In agriculture, it helps farmers optimize crop yields. However, AI also raises important ethical questions. Concerns about job displacement, privacy, and algorithmic bias need to be addressed as the technology continues to advance.

Despite these challenges, the future of AI looks promising. Researchers are working on making AI more explainable and trustworthy. With proper regulation and ethical guidelines, AI has the potential to solve some of humanity's biggest problems, from climate change to disease.`,
      level: 'ADVANCED',
      genre: 'SCIENCE',
      wordCount: 200,
      estimatedTime: 10,
      vocabulary: [
        { word: 'artificial intelligence', meaning: '人工智能' },
        { word: 'machine learning', meaning: '机器学习' },
        { word: 'algorithm', meaning: '算法' },
        { word: 'ethical', meaning: '伦理的' },
        { word: 'fraudulent', meaning: '欺诈的' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is machine learning?',
        options: ['A technique for AI to learn from data', 'A type of computer hardware', 'A programming language', 'A network protocol'],
        correctAnswer: 'A technique for AI to learn from data',
        explanation: '文章说："Machine learning is a key technique used to develop AI systems. Instead of being explicitly programmed, AI systems learn from large amounts of data."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'AI is only used in consumer products like voice assistants.',
        correctAnswer: false,
        explanation: '文章提到AI在医疗、金融、农业等多个领域都有应用。',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Which field is AI helping doctors with?',
        options: ['Diagnosing diseases', 'Performing surgery', 'Prescribing medication', 'Training nurses'],
        correctAnswer: 'Diagnosing diseases',
        explanation: '文章说："In healthcare, AI is helping doctors diagnose diseases more accurately."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one ethical concern about AI mentioned in the article.',
        correctAnswer: 'job displacement or privacy or algorithmic bias',
        explanation: '文章提到："Concerns about job displacement, privacy, and algorithmic bias need to be addressed."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'The article suggests AI has potential to help solve climate change.',
        correctAnswer: true,
        explanation: '文章说："AI has the potential to solve some of humanity\'s biggest problems, from climate change to disease."',
        points: 10,
      },
    ],
  },
  'res-7': {
    article: {
      id: 'res-7',
      title: 'Global Economic Trends',
      content: `The global economy is constantly evolving, shaped by technological advances, political decisions, and changing consumer behaviors. Understanding these trends is crucial for businesses and policymakers alike.

In recent years, we have witnessed a significant shift towards digital economies. E-commerce has grown exponentially, with online retail sales now accounting for a large percentage of total retail sales worldwide. Cryptocurrencies and blockchain technology are challenging traditional financial systems.

Another major trend is the growing importance of emerging markets. Countries like China, India, and Brazil are playing increasingly influential roles in the global economy. Their large populations and rapidly developing middle classes create vast new markets for goods and services.

Climate change is also reshaping economic priorities. There is growing investment in green technologies and sustainable business practices. Companies that fail to adapt to this new reality risk being left behind.

However, global economic growth faces significant challenges. Income inequality continues to widen in many countries. Trade tensions between major economies create uncertainty. The COVID-19 pandemic has also had lasting impacts on global supply chains and labor markets.`,
      level: 'ADVANCED',
      genre: 'NEWS',
      wordCount: 180,
      estimatedTime: 9,
      vocabulary: [
        { word: 'e-commerce', meaning: '电子商务' },
        { word: 'cryptocurrency', meaning: '加密货币' },
        { word: 'emerging markets', meaning: '新兴市场' },
        { word: 'inequality', meaning: '不平等' },
        { word: 'supply chains', meaning: '供应链' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is a major trend mentioned in the article?',
        options: ['Shift towards digital economies', 'Growth of traditional retail', 'Decline of mobile phones', 'Decrease in online sales'],
        correctAnswer: 'Shift towards digital economies',
        explanation: '文章说："In recent years, we have witnessed a significant shift towards digital economies."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Emerging markets are becoming more important in the global economy.',
        correctAnswer: true,
        explanation: '文章提到："Another major trend is the growing importance of emerging markets."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Which countries are mentioned as emerging markets?',
        options: ['China, India, and Brazil', 'USA, UK, and France', 'Japan, Korea, and Singapore', 'Germany, Italy, and Spain'],
        correctAnswer: 'China, India, and Brazil',
        explanation: '文章说："Countries like China, India, and Brazil are playing increasingly influential roles."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one challenge facing global economic growth.',
        correctAnswer: 'income inequality or trade tensions or pandemic impacts',
        explanation: '文章提到："income inequality continues to widen", "Trade tensions between major economies", and "COVID-19 pandemic impacts".',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Climate change is affecting economic priorities.',
        correctAnswer: true,
        explanation: '文章说："Climate change is also reshaping economic priorities."',
        points: 10,
      },
    ],
  },
  'res-8': {
    article: {
      id: 'res-8',
      title: 'The Great Wall of China',
      content: `The Great Wall of China is one of the most iconic structures in the world. Stretching over 21,000 kilometers, it is the longest wall ever built. The wall was constructed over many centuries by different Chinese dynasties, with the earliest sections dating back to the 7th century BC.

The primary purpose of the wall was defensive. It was built to protect Chinese states and empires from invasions by nomadic groups from the north. The wall includes watchtowers, garrison stations, and signaling capabilities using smoke and fire.

Beyond its military function, the wall also served as a means of controlling trade and migration along the Silk Road. It helped regulate the movement of people and goods through designated passes.

Today, the Great Wall is a major tourist attraction. Millions of visitors climb its towers each year to admire the breathtaking views and learn about Chinese history. Several sections have been restored and are well-preserved, while other parts remain in their original state, covered by vegetation.

The Great Wall is not just a physical structure but a symbol of Chinese civilization. It represents the ingenuity, determination, and labor of millions of workers who built it over centuries. In 1987, it was designated a UNESCO World Heritage Site.`,
      level: 'INTERMEDIATE',
      genre: 'HISTORY',
      wordCount: 180,
      estimatedTime: 8,
      vocabulary: [
        { word: 'iconic', meaning: '标志性的' },
        { word: 'dynasty', meaning: '朝代' },
        { word: 'defensive', meaning: '防御性的' },
        { word: 'garrison', meaning: '驻军' },
        { word: 'UNESCO', meaning: '联合国教科文组织' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'How long is the Great Wall?',
        options: ['Over 21,000 kilometers', 'About 10,000 kilometers', 'Around 5,000 kilometers', 'Less than 1,000 kilometers'],
        correctAnswer: 'Over 21,000 kilometers',
        explanation: '文章说："Stretching over 21,000 kilometers."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'The earliest sections of the wall date back to the 7th century BC.',
        correctAnswer: true,
        explanation: '文章提到："the earliest sections dating back to the 7th century BC."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'What was the primary purpose of the wall?',
        options: ['Defensive', 'Decorative', 'Religious', 'Commercial only'],
        correctAnswer: 'Defensive',
        explanation: '文章说："The primary purpose of the wall was defensive."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'When was the Great Wall designated a UNESCO World Heritage Site?',
        correctAnswer: '1987',
        explanation: '文章说："In 1987, it was designated a UNESCO World Heritage Site."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'The wall helped control trade along the Silk Road.',
        correctAnswer: true,
        explanation: '文章提到："the wall also served as a means of controlling trade and migration along the Silk Road."',
        points: 10,
      },
    ],
  },
  'res-9': {
    article: {
      id: 'res-9',
      title: 'Space Exploration',
      content: `Space exploration has always captured human imagination. From the first moon landing in 1969 to today's missions to Mars, we have made incredible progress in understanding our universe.

The space race of the 20th century led to many technological advances that we use today. Satellite technology enables global communications and weather forecasting. Materials developed for space missions have been adapted for everyday products.

In recent years, private companies have joined national space agencies in the exploration of space. Companies like SpaceX are developing reusable rockets, dramatically reducing the cost of reaching space. This has opened up new possibilities for space tourism and commercial activities in orbit.

Mars has become the focus of much current exploration efforts. NASA, SpaceX, and other organizations are working toward sending humans to the Red Planet. The challenges are immense - radiation, distance, and life support systems all pose significant difficulties.

However, space exploration also raises important questions about the future of humanity. Should we prioritize space travel or focus on solving problems on Earth? How do we ensure that space remains peaceful and accessible to all nations? These are debates that will shape the future of space exploration.`,
      level: 'ADVANCED',
      genre: 'SCIENCE',
      wordCount: 180,
      estimatedTime: 9,
      vocabulary: [
        { word: 'satellite', meaning: '卫星' },
        { word: 'orbit', meaning: '轨道' },
        { word: 'radiation', meaning: '辐射' },
        { word: 'spacecraft', meaning: '宇宙飞船' },
        { word: 'astronaut', meaning: '宇航员' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'When was the first moon landing?',
        options: ['1969', '1959', '1979', '1989'],
        correctAnswer: '1969',
        explanation: '文章说："the first moon landing in 1969."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Private companies are now involved in space exploration.',
        correctAnswer: true,
        explanation: '文章提到："private companies have joined national space agencies in the exploration of space."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Which planet is the focus of current exploration efforts?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctAnswer: 'Mars',
        explanation: '文章说："Mars has become the focus of much current exploration efforts."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one technological advance from space exploration mentioned in the article.',
        correctAnswer: 'satellite technology or satellite communications',
        explanation: '文章提到："Satellite technology enables global communications and weather forecasting."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'SpaceX is developing reusable rockets.',
        correctAnswer: true,
        explanation: '文章说："Companies like SpaceX are developing reusable rockets."',
        points: 10,
      },
    ],
  },
  'res-10': {
    article: {
      id: 'res-10',
      title: 'The Story of Tea',
      content: `Tea is one of the most popular beverages in the world, consumed by billions of people every day. Its history stretches back thousands of years to ancient China, where it was first discovered and cultivated.

According to legend, tea was discovered by Emperor Shennong around 2737 BC. While boiling water, leaves from a nearby tea tree fell into his pot, creating the first cup of tea. From China, tea spread to Japan, Korea, and eventually to the rest of the world through trade routes.

There are many different types of tea, including green, black, oolong, and white tea. All come from the same plant, Camellia sinensis, but are processed differently. Green tea is unoxidized, while black tea is fully oxidized. The processing method determines the flavor, color, and health properties of the tea.

Tea plays an important role in many cultures. In China, the tea ceremony is a traditional practice that emphasizes mindfulness and appreciation. In Britain, afternoon tea is a beloved custom. In Japan, matcha is an integral part of tea ceremony culture.

Today, tea continues to be studied for its potential health benefits. Research suggests that tea may help with heart health, digestion, and mental alertness. Whether enjoyed for its taste or its benefits, tea remains a beloved drink around the globe.`,
      level: 'BEGINNER',
      genre: 'CULTURE',
      wordCount: 180,
      estimatedTime: 6,
      vocabulary: [
        { word: 'beverage', meaning: '饮料' },
        { word: 'cultivated', meaning: '培育' },
        { word: 'legend', meaning: '传说' },
        { word: 'oxidation', meaning: '氧化' },
        { word: 'mindfulness', meaning: '正念' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'When was tea reportedly discovered?',
        options: ['Around 2737 BC', 'In the 15th century', 'In the 18th century', 'In the 20th century'],
        correctAnswer: 'Around 2737 BC',
        explanation: '文章说："tea was discovered by Emperor Shennong around 2737 BC."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Green tea and black tea come from different plants.',
        correctAnswer: false,
        explanation: '文章说："All come from the same plant, Camellia sinensis, but are processed differently."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Which country did tea spread to first after China?',
        options: ['Japan', 'Britain', 'America', 'India'],
        correctAnswer: 'Japan',
        explanation: '文章说："From China, tea spread to Japan, Korea, and eventually to the rest of the world."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one type of tea mentioned in the article.',
        correctAnswer: 'green, black, oolong, or white tea',
        explanation: '文章列出了："green, black, oolong, and white tea."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Tea may help with heart health according to research.',
        correctAnswer: true,
        explanation: '文章说："Research suggests that tea may help with heart health, digestion, and mental alertness."',
        points: 10,
      },
    ],
  },
  'res-11': {
    article: {
      id: 'res-11',
      title: 'Modern Architecture',
      content: `Modern architecture emerged in the early 20th century as architects sought to create new forms and uses of materials. It represents a break from traditional styles like Gothic, Renaissance, and Baroque architecture.

One of the key principles of modern architecture is "form follows function." This means that the design of a building should be based on its intended purpose, rather than decorative elements. Architects like Louis Sullivan and later Frank Lloyd Wright championed this idea.

Modern architecture also embraces new materials and construction techniques. Steel, reinforced concrete, and glass allowed for new possibilities in building design. These materials enabled architects to create buildings with large open spaces, floor-to-ceiling windows, and flat roofs.

Famous examples of modern architecture include the Villa Savoye by Le Corbusier, the Fallingwater house by Frank Lloyd Wright, and the Seagram Building in New York. These buildings are celebrated for their innovative designs and harmony with their environments.

However, modern architecture has also faced criticism. Some argue that modern buildings lack warmth and humanity. Others say they are too uniform and ignore local cultural traditions. Today, many architects combine modern techniques with traditional elements, creating a new style sometimes called contemporary or neo-modern architecture.`,
      level: 'INTERMEDIATE',
      genre: 'OTHER',
      wordCount: 180,
      estimatedTime: 8,
      vocabulary: [
        { word: 'reinforced concrete', meaning: '钢筋混凝土' },
        { word: 'floor-to-ceiling', meaning: '落地窗' },
        { word: 'harmony', meaning: '和谐' },
        { word: 'criticism', meaning: '批评' },
        { word: 'contemporary', meaning: '当代的' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What does "form follows function" mean?',
        options: ['Design should be based on purpose', 'Decoration is most important', 'Buildings should look traditional', 'Function is less important than form'],
        correctAnswer: 'Design should be based on purpose',
        explanation: '文章说："the design of a building should be based on its intended purpose, rather than decorative elements."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Steel and glass were new materials used in modern architecture.',
        correctAnswer: true,
        explanation: '文章提到："Steel, reinforced concrete, and glass allowed for new possibilities in building design."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Who designed the Villa Savoye?',
        options: ['Le Corbusier', 'Frank Lloyd Wright', 'Louis Sullivan', 'Norman Foster'],
        correctAnswer: 'Le Corbusier',
        explanation: '文章说："Famous examples...include the Villa Savoye by Le Corbusier."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one criticism of modern architecture mentioned in the article.',
        correctAnswer: 'lacks warmth and humanity or too uniform',
        explanation: '文章提到："modern buildings lack warmth and humanity" and "they are too uniform."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Some modern architects combine modern and traditional elements today.',
        correctAnswer: true,
        explanation: '文章说："today, many architects combine modern techniques with traditional elements."',
        points: 10,
      },
    ],
  },
  'res-12': {
    article: {
      id: 'res-12',
      title: 'Ocean Conservation',
      content: `The ocean covers more than 70% of our planet and is home to countless species of marine life. It provides us with food, oxygen, and regulates our climate. However, our oceans face unprecedented threats from human activities.

Overfishing is one of the biggest problems. Millions of tons of fish are caught every year, depleting fish populations and disrupting marine ecosystems. Many species are now endangered due to overfishing.

Plastic pollution is another major issue. Millions of tons of plastic waste end up in the ocean each year. This plastic breaks down into microplastics that are ingested by marine animals, causing harm throughout the food chain.

Climate change is also affecting our oceans. Rising water temperatures cause coral bleaching, while ocean acidification makes it difficult for shellfish and corals to build their shells. These changes threaten entire marine ecosystems.

Fortunately, there are efforts to protect our oceans. Marine protected areas are being established around the world. Scientists are developing sustainable fishing practices. Many countries are banning single-use plastics and promoting recycling.

Individual actions can also make a difference. Reducing plastic use, choosing sustainable seafood, and supporting ocean conservation organizations are all ways that people can help protect our oceans for future generations.`,
      level: 'ADVANCED',
      genre: 'SCIENCE',
      wordCount: 180,
      estimatedTime: 9,
      vocabulary: [
        { word: 'ecosystem', meaning: '生态系统' },
        { word: 'overfishing', meaning: '过度捕捞' },
        { word: 'microplastics', meaning: '微塑料' },
        { word: 'coral bleaching', meaning: '珊瑚白化' },
        { word: 'acidification', meaning: '酸化' },
      ],
    },
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What percentage of our planet is covered by ocean?',
        options: ['Over 70%', 'About 50%', 'About 30%', 'Less than 20%'],
        correctAnswer: 'Over 70%',
        explanation: '文章说："The ocean covers more than 70% of our planet."',
        points: 10,
      },
      {
        id: 2,
        type: 'true-false',
        question: 'Plastic pollution breaks down into microplastics that harm marine life.',
        correctAnswer: true,
        explanation: '文章说："This plastic breaks down into microplastics that are ingested by marine animals."',
        points: 10,
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'What causes coral bleaching?',
        options: ['Rising water temperatures', 'Overfishing', 'Plastic pollution', 'Ocean waves'],
        correctAnswer: 'Rising water temperatures',
        explanation: '文章提到："Rising water temperatures cause coral bleaching."',
        points: 10,
      },
      {
        id: 4,
        type: 'short-answer',
        question: 'Name one way to help protect oceans mentioned in the article.',
        correctAnswer: 'reducing plastic use or choosing sustainable seafood or supporting conservation',
        explanation: '文章建议："Reducing plastic use, choosing sustainable seafood, and supporting ocean conservation organizations."',
        points: 10,
      },
      {
        id: 5,
        type: 'true-false',
        question: 'Marine protected areas are being established around the world.',
        correctAnswer: true,
        explanation: '文章说："Marine protected areas are being established around the world."',
        points: 10,
      },
    ],
  },
};

export default function ReadingPracticeByIdPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id') || 'res-1';

  const [practice, setPractice] = useState<ReadingPractice | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [isArticleRead, setIsArticleRead] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // 查找文章数据
    const articleData = articlesData[articleId];

    if (articleData) {
      setPractice({
        article: articleData.article,
        questions: articleData.questions,
        currentQuestionIndex: 0,
        userAnswers: new Array(articleData.questions.length).fill(null),
        showResults: false,
        score: 0,
        timeSpent: 0,
        startTime: Date.now(),
      });
      setIsLoading(false);
    } else {
      // 如果找不到特定文章，加载默认文章
      const defaultData = {
        article: {
          id: articleId,
          title: 'Reading Practice',
          content: `Reading is one of the most important skills we can develop. It opens up new worlds, introduces us to different ideas, and helps us understand other cultures. Whether you're reading a novel, a news article, or a scientific paper, the act of reading strengthens your brain and improves your vocabulary.

For students, reading is especially important. It helps with academic success in all subjects. When you read regularly, you become better at understanding complex texts, which is useful for studying history, science, and literature. Reading also improves your writing skills because you learn how sentences are structured and how ideas are expressed clearly.

The best way to improve your reading skills is to read every day. Start with materials that interest you, and gradually challenge yourself with more difficult texts.`,
          level: 'INTERMEDIATE' as const,
          genre: 'OTHER' as const,
          wordCount: 180,
          estimatedTime: 4,
          vocabulary: [
            { word: 'develop', meaning: '发展，培养' },
            { word: 'vocabulary', meaning: '词汇' },
            { word: 'academic', meaning: '学术的' },
          ],
        },
        questions: [
          {
            id: 1,
            type: 'multiple-choice' as const,
            question: 'Why is reading important for students?',
            options: [
              'It helps with academic success',
              'It is only for literature class',
              'It is not important',
              'It wastes time',
            ],
            correctAnswer: 'It helps with academic success',
            explanation: '文章提到阅读对学业成功很重要。',
            points: 10,
          },
          {
            id: 2,
            type: 'true-false' as const,
            question: 'Reading can improve writing skills.',
            correctAnswer: true,
            explanation: '文章提到阅读也能提高写作技能。',
            points: 10,
          },
          {
            id: 3,
            type: 'short-answer' as const,
            question: 'What is the best way to improve reading skills?',
            correctAnswer: 'read every day',
            explanation: '文章建议每天阅读是提高阅读技能的最佳方式。',
            points: 10,
          },
        ],
      };

      setPractice({
        ...defaultData,
        currentQuestionIndex: 0,
        userAnswers: new Array(defaultData.questions.length).fill(null),
        showResults: false,
        score: 0,
        timeSpent: 0,
        startTime: Date.now(),
      });
      setIsLoading(false);
    }
  }, [articleId]);

  const currentQuestion = practice?.questions[practice.currentQuestionIndex];

  const handleAnswerSelect = (answer: string | boolean) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!practice || selectedAnswer === null) return;

    const newUserAnswers = [...practice.userAnswers];
    newUserAnswers[practice.currentQuestionIndex] = selectedAnswer;

    let newScore = practice.score;
    const currentQ = practice.questions[practice.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    if (isCorrect) {
      newScore += currentQ.points;
    }

    if (practice.currentQuestionIndex < practice.questions.length - 1) {
      setPractice({
        ...practice,
        currentQuestionIndex: practice.currentQuestionIndex + 1,
        userAnswers: newUserAnswers,
        score: newScore,
      });
      setSelectedAnswer(practice.userAnswers[practice.currentQuestionIndex + 1]);
    } else {
      const finalAnswers = [...newUserAnswers];
      const finalScore = newScore;
      const totalTime = Math.floor((Date.now() - practice.startTime) / 1000);

      setPractice({
        ...practice,
        userAnswers: finalAnswers,
        score: finalScore,
        timeSpent: totalTime,
        showResults: true,
      });

      const result = {
        articleId: practice.article.id,
        title: practice.article.title,
        score: Math.round((finalScore / (practice.questions.reduce((sum, q) => sum + q.points, 0))) * 100),
        correctCount: finalAnswers.filter((ans, idx) => ans === practice.questions[idx].correctAnswer).length,
        totalQuestions: practice.questions.length,
        completedAt: new Date().toISOString(),
        timeSpent: totalTime,
      };
      localStorage.setItem('latestReadingResult', JSON.stringify(result));
    }
  };

  const handlePrevQuestion = () => {
    if (!practice || practice.currentQuestionIndex === 0) return;

    setPractice({
      ...practice,
      currentQuestionIndex: practice.currentQuestionIndex - 1,
    });
    setSelectedAnswer(practice.userAnswers[practice.currentQuestionIndex - 1]);
  };

  const handleStartQuestions = () => {
    setIsArticleRead(true);
  };

  const handleFinishReading = () => {
    router.push('/reading/completed');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-blue-100 text-blue-800';
      case 'ADVANCED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER': return '初级';
      case 'INTERMEDIATE': return '中级';
      case 'ADVANCED': return '高级';
      default: return level;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载阅读练习中...</p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h2>
        <p className="text-gray-600 mb-8">抱歉，找不到这篇文章。</p>
        <Link
          href="/reading/resources"
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
        >
          浏览阅读资源
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 页面标题和进度 */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">阅读理解练习</h1>
            <p className="text-gray-600 mt-1">阅读文章并回答相关问题</p>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-600">难度</div>
              <div className={`font-medium ${getLevelColor(practice.article.level)} px-2 py-1 rounded`}>
                {getLevelText(practice.article.level)}
              </div>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <div className="text-sm text-gray-600">问题进度</div>
              <div className="text-xl font-bold text-gray-900">
                {isArticleRead ? `${practice.currentQuestionIndex + 1} / ${practice.questions.length}` : '阅读文章'}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: isArticleRead
                ? `${((practice.currentQuestionIndex + 1) / practice.questions.length) * 100}%`
                : '0%'
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 文章区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{practice.article.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-gray-600">{practice.article.wordCount}词</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-600">预计阅读时间: {practice.article.estimatedTime}分钟</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowVocabulary(!showVocabulary)}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 font-medium"
                >
                  {showVocabulary ? '隐藏词汇' : '显示词汇'}
                </button>
              </div>

              {showVocabulary && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-3">重点词汇</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {practice.article.vocabulary.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="font-medium text-gray-900">{item.word}</div>
                        <div className="text-sm text-gray-600">{item.meaning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {practice.article.content}
                </div>
              </div>

              {!isArticleRead && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">请仔细阅读以上文章，完成后点击按钮开始回答问题。</p>
                    <button
                      onClick={handleStartQuestions}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 font-medium text-lg"
                    >
                      我已阅读完成，开始答题
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 问题区域 */}
        <div className="lg:col-span-1">
          {isArticleRead ? (
            practice.showResults ? (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <div className="h-20 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl text-white">📊</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">练习完成！</h2>
                  <p className="text-gray-600">你的阅读理解练习结果如下</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {Math.round((practice.score / (practice.questions.reduce((sum, q) => sum + q.points, 0))) * 100)}
                      </div>
                      <div className="text-gray-600">得分 / 100</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow">
                      <div className="text-2xl font-bold text-gray-900">
                        {practice.userAnswers.filter((ans, idx) => ans === practice.questions[idx].correctAnswer).length}
                      </div>
                      <div className="text-gray-600 text-sm">正确题数</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow">
                      <div className="text-2xl font-bold text-gray-900">{practice.timeSpent}s</div>
                      <div className="text-gray-600 text-sm">用时</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleFinishReading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 font-medium"
                    >
                      查看详细分析
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">问题 {practice.currentQuestionIndex + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{currentQuestion?.points} 分</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{currentQuestion?.question}</h3>
                </div>

                {currentQuestion?.type === 'multiple-choice' && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition ${
                          selectedAnswer === option
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 ${
                            selectedAnswer === option
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion?.type === 'true-false' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswerSelect(true)}
                      className={`p-6 rounded-xl border-2 text-center transition ${
                        selectedAnswer === true
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">✓</div>
                      <div className="font-medium">正确</div>
                    </button>
                    <button
                      onClick={() => handleAnswerSelect(false)}
                      className={`p-6 rounded-xl border-2 text-center transition ${
                        selectedAnswer === false
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">✗</div>
                      <div className="font-medium">错误</div>
                    </button>
                  </div>
                )}

                {currentQuestion?.type === 'short-answer' && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={selectedAnswer as string || ''}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="输入你的答案..."
                    />
                    <div className="text-sm text-gray-600">
                      提示：答案可能是一个或多个关键词
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={practice.currentQuestionIndex === 0}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一题
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {practice.currentQuestionIndex < practice.questions.length - 1 ? '下一题' : '完成练习'}
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 阅读提示</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">仔细阅读文章，理解主要内容</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">注意文章的结构和逻辑关系</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">遇到生词可以查看右侧词汇表</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">阅读完成后将回答相关问题</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Link
          href="/reading"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回阅读主页
        </Link>
        <div className="text-sm text-gray-600">
          按空格键可以快速显示/隐藏词汇表
        </div>
      </div>
    </div>
  );
}
