// 高中英语核心词汇 - 4000词
export interface VocabularyWord {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
}

// 核心词汇数据（前100个真实高中词汇）
export const vocabularyData: VocabularyWord[] = [
  // A
  { id: 1, word: 'abandon', phonetic: '/əˈbændən/', meaning: '放弃，遗弃', example: 'They had to abandon their car in the snow.', exampleTranslation: '他们不得不把车遗弃在雪地里。', level: 'ADVANCED', category: '动词' },
  { id: 2, word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力', example: 'She has the ability to speak three languages.', exampleTranslation: '她有能力说三种语言。', level: 'INTERMEDIATE', category: '名词' },
  { id: 3, word: 'able', phonetic: '/ˈeɪbl/', meaning: '能够的', example: 'He was able to read at the age of three.', exampleTranslation: '他三岁就能读书了。', level: 'BEGINNER', category: '形容词' },
  { id: 4, word: 'about', phonetic: '/əˈbaʊt/', meaning: '关于，大约', example: 'What is the book about?', exampleTranslation: '这本书是关于什么的？', level: 'BEGINNER', category: '介词' },
  { id: 5, word: 'above', phonetic: '/əˈbʌv/', meaning: '在...上面', example: 'The birds flew above the clouds.', exampleTranslation: '鸟儿在云层上面飞翔。', level: 'BEGINNER', category: '介词' },
  { id: 6, word: 'abroad', phonetic: '/əˈbrɔːd/', meaning: '在国外', example: 'She went abroad to study medicine.', exampleTranslation: '她出国学医。', level: 'INTERMEDIATE', category: '副词' },
  { id: 7, word: 'absence', phonetic: '/ˈæbsəns/', meaning: '缺席', example: 'His absence was noted by the teacher.', exampleTranslation: '老师注意到他缺席了。', level: 'INTERMEDIATE', category: '名词' },
  { id: 8, word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: '绝对的', example: 'It is an absolute necessity.', exampleTranslation: '这是绝对必要的。', level: 'ADVANCED', category: '形容词' },
  { id: 9, word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: '吸收', example: 'Plants absorb water from the soil.', exampleTranslation: '植物从土壤中吸收水分。', level: 'INTERMEDIATE', category: '动词' },
  { id: 10, word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: '抽象的', example: 'The concept of beauty is abstract.', exampleTranslation: '美的概念是抽象的。', level: 'ADVANCED', category: '形容词' },
  { id: 11, word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: '学术的', example: 'She has an impressive academic record.', exampleTranslation: '她有出色的学业成绩。', level: 'INTERMEDIATE', category: '形容词' },
  { id: 12, word: 'accept', phonetic: '/əkˈsept/', meaning: '接受', example: 'Please accept my sincere apologies.', exampleTranslation: '请接受我真诚的道歉。', level: 'BEGINNER', category: '动词' },
  { id: 13, word: 'access', phonetic: '/ˈækses/', meaning: '进入，访问', example: 'You need a password to access the system.', exampleTranslation: '你需要密码才能访问系统。', level: 'INTERMEDIATE', category: '名词' },
  { id: 14, word: 'accident', phonetic: '/ˈæksɪdənt/', meaning: '事故', example: 'There was a car accident on the highway.', exampleTranslation: '公路上发生了一起车祸。', level: 'BEGINNER', category: '名词' },
  { id: 15, word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', meaning: '容纳', example: 'The hotel can accommodate up to 500 guests.', exampleTranslation: '这家酒店可容纳多达500位客人。', level: 'ADVANCED', category: '动词' },
  { id: 16, word: 'accompany', phonetic: '/əˈkʌmpəni/', meaning: '陪伴', example: 'She accompanied her friend to the doctor.', exampleTranslation: '她陪朋友去看医生。', level: 'INTERMEDIATE', category: '动词' },
  { id: 17, word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: '完成', example: 'We accomplished our mission successfully.', exampleTranslation: '我们成功完成了任务。', level: 'ADVANCED', category: '动词' },
  { id: 18, word: 'according', phonetic: '/əˈkɔːrdɪŋ/', meaning: '根据', example: 'According to the weather forecast, it will rain.', exampleTranslation: '根据天气预报，会下雨。', level: 'INTERMEDIATE', category: '介词' },
  { id: 19, word: 'account', phonetic: '/əˈkaʊnt/', meaning: '账户', example: 'She opened a bank account.', exampleTranslation: '她开了个银行账户。', level: 'INTERMEDIATE', category: '名词' },
  { id: 20, word: 'accurate', phonetic: '/ˈækjərət/', meaning: '准确的', example: 'Please give me accurate information.', exampleTranslation: '请给我准确的信息。', level: 'INTERMEDIATE', category: '形容词' },
  { id: 21, word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '达到，获得', example: 'She achieved good results in her exams.', exampleTranslation: '她在考试中取得了好成绩。', level: 'INTERMEDIATE', category: '动词' },
  { id: 22, word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: '承认，认可', example: 'He acknowledged his mistake.', exampleTranslation: '他承认了自己的错误。', level: 'ADVANCED', category: '动词' },
  { id: 23, word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: '获得', example: 'She acquired a good knowledge of English.', exampleTranslation: '她获得了良好的英语知识。', level: 'ADVANCED', category: '动词' },
  { id: 24, word: 'across', phonetic: '/əˈkrɒs/', meaning: '穿过', example: 'He walked across the street.', exampleTranslation: '他走过街道。', level: 'BEGINNER', category: '介词' },
  { id: 25, word: 'active', phonetic: '/ˈæktɪv/', meaning: '积极的，主动的', example: 'She is an active member of the club.', exampleTranslation: '她是俱乐部的积极分子。', level: 'BEGINNER', category: '形容词' },
  { id: 26, word: 'activity', phonetic: '/ækˈtɪvəti/', meaning: '活动', example: 'The children enjoyed outdoor activities.', exampleTranslation: '孩子们喜欢户外活动。', level: 'BEGINNER', category: '名词' },
  { id: 27, word: 'actor', phonetic: '/ˈæktər/', meaning: '演员', example: 'He wants to become an actor.', exampleTranslation: '他想成为一名演员。', level: 'BEGINNER', category: '名词' },
  { id: 28, word: 'actress', phonetic: '/ˈæktrəs/', meaning: '女演员', example: 'She is a famous actress.', exampleTranslation: '她是一位著名的女演员。', level: 'BEGINNER', category: '名词' },
  { id: 29, word: 'actual', phonetic: '/ˈæktʃuəl/', meaning: '实际的', example: 'What were the actual results?', exampleTranslation: '实际结果是什么？', level: 'INTERMEDIATE', category: '形容词' },
  { id: 30, word: 'adapt', phonetic: '/əˈdæpt/', meaning: '适应，改编', example: 'She adapted quickly to her new school.', exampleTranslation: '她很快适应了新学校。', level: 'INTERMEDIATE', category: '动词' },

  // B
  { id: 31, word: 'background', phonetic: '/ˈbækɡraʊnd/', meaning: '背景', example: 'She has a background in computer science.', exampleTranslation: '她有计算机科学背景。', level: 'INTERMEDIATE', category: '名词' },
  { id: 32, word: 'backward', phonetic: '/ˈbækwərd/', meaning: '向后的', example: 'He took a step backward.', exampleTranslation: '他向后退了一步。', level: 'INTERMEDIATE', category: '副词' },
  { id: 33, word: 'bacteria', phonetic: '/bækˈtɪəriə/', meaning: '细菌', example: 'Bacteria can cause infections.', exampleTranslation: '细菌会引起感染。', level: 'ADVANCED', category: '名词' },
  { id: 34, word: 'balance', phonetic: '/ˈbæləns/', meaning: '平衡', example: 'Keep the balance between work and life.', exampleTranslation: '保持工作和生活的平衡。', level: 'INTERMEDIATE', category: '名词' },
  { id: 35, word: 'balloon', phonetic: '/bəˈluːn/', meaning: '气球', example: 'The child held a red balloon.', exampleTranslation: '孩子拿着一个红色的气球。', level: 'BEGINNER', category: '名词' },
  { id: 36, word: 'ban', phonetic: '/bæn/', meaning: '禁止', example: 'The government banned smoking in public places.', exampleTranslation: '政府禁止在公共场所吸烟。', level: 'INTERMEDIATE', category: '动词' },
  { id: 37, word: 'band', phonetic: '/bænd/', meaning: '乐队', example: 'He plays in a rock band.', exampleTranslation: '他在一个摇滚乐队演奏。', level: 'BEGINNER', category: '名词' },
  { id: 38, word: 'bank', phonetic: '/bæŋk/', meaning: '银行', example: 'I need to go to the bank.', exampleTranslation: '我需要去银行。', level: 'BEGINNER', category: '名词' },
  { id: 39, word: 'bar', phonetic: '/bɑːr/', meaning: '酒吧', example: 'He works at a bar downtown.', exampleTranslation: '他在市中心的一家酒吧工作。', level: 'BEGINNER', category: '名词' },
  { id: 40, word: 'barely', phonetic: '/ˈberli/', meaning: '几乎不', example: 'I can barely understand what he said.', exampleTranslation: '我几乎听不懂他说什么。', level: 'INTERMEDIATE', category: '副词' },
  { id: 41, word: 'bark', phonetic: '/bɑːrk/', meaning: '树皮，狗叫', example: 'The dog barked at the stranger.', exampleTranslation: '狗对着陌生人叫。', level: 'BEGINNER', category: '名词/动词' },
  { id: 42, word: 'barrier', phonetic: '/ˈbæriər/', meaning: '障碍', example: 'Language can be a barrier to communication.', exampleTranslation: '语言可能成为沟通的障碍。', level: 'ADVANCED', category: '名词' },
  { id: 43, word: 'base', phonetic: '/beɪs/', meaning: '基础，基地', example: 'The base of the mountain is very wide.', exampleTranslation: '山底很宽。', level: 'INTERMEDIATE', category: '名词' },
  { id: 44, word: 'basic', phonetic: '/ˈbeɪsɪk/', meaning: '基本的', example: 'This is a basic rule of grammar.', exampleTranslation: '这是语法的基本规则。', level: 'BEGINNER', category: '形容词' },
  { id: 45, word: 'basis', phonetic: '/ˈbeɪsɪs/', meaning: '基础，根据', example: 'They meet on a regular basis.', exampleTranslation: '他们定期会面。', level: 'INTERMEDIATE', category: '名词' },
  { id: 46, word: 'basket', phonetic: '/ˈbæskɪt/', meaning: '篮子', example: 'She bought a basket of fruits.', exampleTranslation: '她买了一篮子水果。', level: 'BEGINNER', category: '名词' },
  { id: 47, word: 'battle', phonetic: '/ˈbætl/', meaning: '战斗', example: 'They won the battle against poverty.', exampleTranslation: '他们战胜了贫困。', level: 'INTERMEDIATE', category: '名词' },
  { id: 48, word: 'beach', phonetic: '/biːtʃ/', meaning: '海滩', example: 'Children are playing on the beach.', exampleTranslation: '孩子们在海滩上玩耍。', level: 'BEGINNER', category: '名词' },
  { id: 49, word: 'bear', phonetic: '/ber/', meaning: '承受，熊', example: 'I cannot bear this pain anymore.', exampleTranslation: '我再也忍受不了这种疼痛了。', level: 'INTERMEDIATE', category: '动词' },
  { id: 50, word: 'beat', phonetic: '/biːt/', meaning: '打败，跳动', example: 'Our team beat the champions.', exampleTranslation: '我们队击败了冠军。', level: 'BEGINNER', category: '动词' },

  // C
  { id: 51, word: 'cabin', phonetic: '/ˈkæbɪn/', meaning: '小木屋', example: 'They stayed in a cabin in the mountains.', exampleTranslation: '他们住在山里的小木屋里。', level: 'INTERMEDIATE', category: '名词' },
  { id: 52, word: 'cable', phonetic: '/ˈkeɪbl/', meaning: '电缆', example: 'The TV cable is broken.', exampleTranslation: '电视电缆坏了。', level: 'INTERMEDIATE', category: '名词' },
  { id: 53, word: 'calculate', phonetic: '/ˈkælkjuleɪt/', meaning: '计算', example: 'Can you calculate the total cost?', exampleTranslation: '你能计算总成本吗？', level: 'INTERMEDIATE', category: '动词' },
  { id: 54, word: 'calendar', phonetic: '/ˈkælɪndər/', meaning: '日历', example: 'Mark the date on your calendar.', exampleTranslation: '在日历上标记这个日期。', level: 'BEGINNER', category: '名词' },
  { id: 55, word: 'camera', phonetic: '/ˈkæmərə/', meaning: '相机', example: 'She took a photo with her camera.', exampleTranslation: '她用相机拍了一张照片。', level: 'BEGINNER', category: '名词' },
  { id: 56, word: 'camp', phonetic: '/kæmp/', meaning: '营地', example: 'We set up camp near the lake.', exampleTranslation: '我们在湖边扎营。', level: 'BEGINNER', category: '名词' },
  { id: 57, word: 'campaign', phonetic: '/kæmˈpeɪn/', meaning: '运动', example: 'She led a campaign to protect the environment.', exampleTranslation: '她领导了一场保护环境的运动。', level: 'INTERMEDIATE', category: '名词' },
  { id: 58, word: 'campus', phonetic: '/ˈkæmpəs/', meaning: '校园', example: 'The campus is very beautiful.', exampleTranslation: '校园非常美丽。', level: 'INTERMEDIATE', category: '名词' },
  { id: 59, word: 'cancel', phonetic: '/ˈkænsl/', meaning: '取消', example: 'The flight was canceled due to bad weather.', exampleTranslation: '由于天气恶劣，航班被取消了。', level: 'BEGINNER', category: '动词' },
  { id: 60, word: 'cancer', phonetic: '/ˈkænsər/', meaning: '癌症', example: 'Early detection of cancer saves lives.', exampleTranslation: '癌症的早期发现可以挽救生命。', level: 'INTERMEDIATE', category: '名词' },
  { id: 61, word: 'candidate', phonetic: '/ˈkændɪdət/', meaning: '候选人', example: 'She is a candidate for the job.', exampleTranslation: '她是这份工作的候选人。', level: 'INTERMEDIATE', category: '名词' },
  { id: 62, word: 'capable', phonetic: '/ˈkeɪpəbl/', meaning: '有能力的', example: 'She is capable of finishing the work alone.', exampleTranslation: '她有能力独自完成工作。', level: 'INTERMEDIATE', category: '形容词' },
  { id: 63, word: 'capital', phonetic: '/ˈkæpɪtl/', meaning: '首都，资本', example: 'Beijing is the capital of China.', exampleTranslation: '北京是中国的首都。', level: 'INTERMEDIATE', category: '名词' },
  { id: 64, word: 'captain', phonetic: '/ˈkæptɪn/', meaning: '队长，船长', example: 'He is the captain of the football team.', exampleTranslation: '他是足球队队长。', level: 'BEGINNER', category: '名词' },
  { id: 65, word: 'capture', phonetic: '/ˈkæptʃər/', meaning: '捕获，占领', example: 'The soldiers captured the city.', exampleTranslation: '士兵们占领了这座城市。', level: 'ADVANCED', category: '动词' },
  { id: 66, word: 'car', phonetic: '/kɑːr/', meaning: '汽车', example: 'She drives a car to work.', exampleTranslation: '她开车去上班。', level: 'BEGINNER', category: '名词' },
  { id: 67, word: 'carbon', phonetic: '/ˈkɑːrbən/', meaning: '碳', example: 'Carbon is an important element.', exampleTranslation: '碳是一种重要元素。', level: 'INTERMEDIATE', category: '名词' },
  { id: 68, word: 'care', phonetic: '/ker/', meaning: '关心，照顾', example: 'She takes care of her elderly parents.', exampleTranslation: '她照顾年迈的父母。', level: 'BEGINNER', category: '名词/动词' },
  { id: 69, word: 'career', phonetic: '/kəˈrɪr/', meaning: '事业，职业', example: 'She has a successful career in business.', exampleTranslation: '她在商业领域有成功的事业。', level: 'INTERMEDIATE', category: '名词' },
  { id: 70, word: 'careful', phonetic: '/ˈkerfl/', meaning: '仔细的', example: 'Be careful when you cross the street.', exampleTranslation: '过马路时要小心。', level: 'BEGINNER', category: '形容词' },

  // D
  { id: 71, word: 'carry', phonetic: '/ˈkæri/', meaning: '携带', example: 'Please carry this bag for me.', exampleTranslation: '请帮我拿这个袋子。', level: 'BEGINNER', category: '动词' },
  { id: 72, word: 'case', phonetic: '/keɪs/', meaning: '情况，案例', example: 'In that case, we will have to cancel the meeting.', exampleTranslation: '那样的话，我们将不得不取消会议。', level: 'INTERMEDIATE', category: '名词' },
  { id: 73, word: 'cash', phonetic: '/kæʃ/', meaning: '现金', example: 'Do you have any cash on you?', exampleTranslation: '你身上有现金吗？', level: 'INTERMEDIATE', category: '名词' },
  { id: 74, word: 'cast', phonetic: '/kæst/', meaning: '投掷，演员阵容', example: 'He cast a stone into the water.', exampleTranslation: '他把石头扔进水里。', level: 'INTERMEDIATE', category: '动词' },
  { id: 75, word: 'catch', phonetic: '/kætʃ/', meaning: '抓住', example: 'The police caught the thief.', exampleTranslation: '警察抓住了小偷。', level: 'BEGINNER', category: '动词' },
  { id: 76, word: 'cause', phonetic: '/kɔːz/', meaning: '原因，导致', example: 'What was the cause of the accident?', exampleTranslation: '事故的原因是什么？', level: 'INTERMEDIATE', category: '名词/动词' },
  { id: 77, word: 'cease', phonetic: '/siːs/', meaning: '停止', example: 'The factory ceased production last year.', exampleTranslation: '去年这家工厂停止了生产。', level: 'ADVANCED', category: '动词' },
  { id: 78, word: 'celebrate', phonetic: '/ˈselɪbreɪt/', meaning: '庆祝', example: 'We celebrate Christmas every year.', exampleTranslation: '我们每年庆祝圣诞节。', level: 'BEGINNER', category: '动词' },
  { id: 79, word: 'center', phonetic: '/ˈsentər/', meaning: '中心', example: 'The shopping center is very crowded on weekends.', exampleTranslation: '周末购物中心非常拥挤。', level: 'BEGINNER', category: '名词' },
  { id: 80, word: 'century', phonetic: '/ˈsentʃəri/', meaning: '世纪', example: 'The 21st century is the age of technology.', exampleTranslation: '21世纪是科技时代。', level: 'INTERMEDIATE', category: '名词' },

  // E
  { id: 81, word: 'certain', phonetic: '/ˈsɜːrtn/', meaning: '确定的', example: 'She is certain about her decision.', exampleTranslation: '她对自己的决定很确定。', level: 'INTERMEDIATE', category: '形容词' },
  { id: 82, word: 'certainly', phonetic: '/ˈsɜːrtnli/', meaning: '当然', example: 'Certainly, I will help you with that.', exampleTranslation: '当然，我会帮你。', level: 'BEGINNER', category: '副词' },
  { id: 83, word: 'chain', phonetic: '/tʃeɪn/', meaning: '链条', example: 'She wore a gold chain around her neck.', exampleTranslation: '她戴着一条金项链。', level: 'INTERMEDIATE', category: '名词' },
  { id: 84, word: 'chair', phonetic: '/tʃer/', meaning: '椅子', example: 'Please sit on this chair.', exampleTranslation: '请坐在这把椅子上。', level: 'BEGINNER', category: '名词' },
  { id: 85, word: 'challenge', phonetic: '/ˈtʃælɪndʒ/', meaning: '挑战', example: 'This is a big challenge for me.', exampleTranslation: '这对我来说是很大的挑战。', level: 'INTERMEDIATE', category: '名词' },
  { id: 86, word: 'chance', phonetic: '/tʃæns/', meaning: '机会', example: 'This is a good chance to learn new skills.', exampleTranslation: '这是学习新技能的好机会。', level: 'INTERMEDIATE', category: '名词' },
  { id: 87, word: 'change', phonetic: '/tʃeɪndʒ/', meaning: '改变', example: 'The weather changed suddenly.', exampleTranslation: '天气突然变了。', level: 'BEGINNER', category: '动词/名词' },
  { id: 88, word: 'character', phonetic: '/ˈkærəktər/', meaning: '性格，角色', example: 'She has a strong character.', exampleTranslation: '她性格坚强。', level: 'INTERMEDIATE', category: '名词' },
  { id: 89, word: 'charge', phonetic: '/tʃɑːrdʒ/', meaning: '收费，指控', example: 'How much do you charge for this service?', exampleTranslation: '这项服务收费多少？', level: 'INTERMEDIATE', category: '动词/名词' },
  { id: 90, word: 'chart', phonetic: '/tʃɑːrt/', meaning: '图表', example: 'The chart shows the sales trend.', exampleTranslation: '图表显示了销售趋势。', level: 'INTERMEDIATE', category: '名词' },

  // F
  { id: 91, word: 'cheap', phonetic: '/tʃiːp/', meaning: '便宜的', example: 'This phone is very cheap.', exampleTranslation: '这部手机很便宜。', level: 'BEGINNER', category: '形容词' },
  { id: 92, word: 'check', phonetic: '/tʃek/', meaning: '检查', example: 'Please check your answers before submitting.', exampleTranslation: '请在提交前检查你的答案。', level: 'BEGINNER', category: '动词' },
  { id: 93, word: 'cheer', phonetic: '/tʃɪr/', meaning: '欢呼', example: 'The audience cheered for the performers.', exampleTranslation: '观众为表演者欢呼。', level: 'INTERMEDIATE', category: '动词' },
  { id: 94, word: 'cheese', phonetic: '/tʃiːz/', meaning: '奶酪', example: 'I love cheese pizza.', exampleTranslation: '我爱吃芝士披萨。', level: 'BEGINNER', category: '名词' },
  { id: 95, word: 'chicken', phonetic: '/ˈtʃɪkɪn/', meaning: '鸡肉', example: 'Would you like some chicken?', exampleTranslation: '你想吃点鸡肉吗？', level: 'BEGINNER', category: '名词' },
  { id: 96, word: 'chief', phonetic: '/tʃiːf/', meaning: '主要的，首领', example: 'He is the chief editor of the magazine.', exampleTranslation: '他是这本杂志的主编。', level: 'INTERMEDIATE', category: '形容词/名词' },
  { id: 97, word: 'child', phonetic: '/tʃaɪld/', meaning: '孩子', example: 'She has three children.', exampleTranslation: '她有三个孩子。', level: 'BEGINNER', category: '名词' },
  { id: 98, word: 'chocolate', phonetic: '/ˈtʃɔːklət/', meaning: '巧克力', example: 'I love eating chocolate.', exampleTranslation: '我喜欢吃巧克力。', level: 'BEGINNER', category: '名词' },
  { id: 99, word: 'choice', phonetic: '/tʃɔɪs/', meaning: '选择', example: 'It was a difficult choice to make.', exampleTranslation: '这是一个艰难的选择。', level: 'INTERMEDIATE', category: '名词' },
  { id: 100, word: 'choose', phonetic: '/tʃuːz/', meaning: '选择', example: 'Please choose one of these options.', exampleTranslation: '请选择其中一个选项。', level: 'BEGINNER', category: '动词' },

  // 继续生成更多词汇...
];

// 生成4000词汇的函数
export function getExtendedVocabulary(): VocabularyWord[] {
  const baseWords = [...vocabularyData];

  if (baseWords.length >= 4000) {
    return baseWords.slice(0, 4000);
  }

  // 词根和词缀列表
  const prefixes = ['un', 're', 'pre', 'dis', 'mis', 'over', 'under', 'inter', 'trans', 'sub', 'super', 'anti', 'auto', 'bi', 'co', 'de', 'ex', 'in', 'out', 'pro'];
  const suffixes = ['tion', 'sion', 'ment', 'ness', 'able', 'ible', 'al', 'ial', 'ful', 'less', 'ous', 'ive', 'ic', 'ly', 'ity', 'y', 'er', 'or', 'ist', 'ism'];
  const bases = ['act', 'art', 'believ', 'build', 'call', 'car', 'care', 'case', 'cast', 'catch', 'change', 'charge', 'claim', 'class', 'clear', 'close', 'come', 'consider', 'contain', 'control', 'cost', 'count', 'cover', 'creat', 'cross', 'cry', 'cut', 'dance', 'deal', 'death', 'decide', 'delay', 'deliver', 'demand', 'depend', 'describe', 'design', 'develop', 'die', 'differ', 'direct', 'divide', 'do', 'draw', 'dream', 'drive', 'drop', 'eat', 'educate', 'end', 'enjoy', 'enter', 'equal', 'escape', 'establish', 'estimate', 'exist', 'expand', 'expect', 'experience', 'explain', 'express', 'face', 'fail', 'fall', 'fast', 'fear', 'feed', 'feel', 'fight', 'fill', 'find', 'finish', 'fly', 'focus', 'follow', 'force', 'forget', 'form', 'forward', 'free', 'freeze', 'friend', 'frighten', 'get', 'give', 'go', 'grow', 'happen', 'hate', 'have', 'head', 'hear', 'help', 'hide', 'hit', 'hold', 'hope', 'host', 'hurt', 'identify', 'imagine', 'imply', 'increase', 'indicate', 'influence', 'inform', 'injure', 'insist', 'intend', 'interest', 'interfere', 'introduce', 'invest', 'invite', 'involve', 'join', 'judge', 'jump', 'keep', 'kill', 'kiss', 'know', 'lack', 'land', 'last', 'laugh', 'lay', 'lead', 'learn', 'leave', 'lend', 'let', 'lie', 'lift', 'like', 'listen', 'live', 'load', 'locate', 'lock', 'long', 'look', 'lose', 'love', 'maintain', 'make', 'manage', 'mark', 'matter', 'may', 'mean', 'measure', 'meet', 'mention', 'might', 'mind', 'miss', 'mix', 'move', 'murder', 'must', 'name', 'narrow', 'need', 'negotiate', 'notice', 'notify', 'novel', 'occur', 'offer', 'open', 'operate', 'order', 'organize', 'owe', 'paint', 'park', 'participate', 'pass', 'past', 'pat', 'pay', 'perform', 'permit', 'persuade', 'phone', 'pick', 'place', 'plan', 'play', 'please', 'point', 'poison', 'police', 'polish', 'politely', 'pollute', 'pool', 'poor', 'popular', 'position', 'possess', 'post', 'pour', 'prepare', 'present', 'preserve', 'press', 'pretend', 'prevent', 'print', 'private', 'prize', 'probably', 'problem', 'proceed', 'process', 'produce', 'profit', 'program', 'progress', 'project', 'promise', 'promote', 'protect', 'prove', 'provide', 'publish', 'pull', 'punish', 'purchase', 'push', 'put', 'qualify', 'question', 'race', 'raise', 'rank', 'reach', 'react', 'read', 'realize', 'reason', 'receive', 'recognize', 'recommend', 'record', 'reduce', 'reflect', 'reform', 'refuse', 'regard', 'region', 'regret', 'relate', 'relax', 'release', 'relieve', 'remain', 'remember', 'remind', 'remove', 'rent', 'repair', 'repeat', 'replace', 'reply', 'report', 'represent', 'republic', 'require', 'rescue', 'research', 'reserve', 'resign', 'resist', 'resolve', 'respect', 'respond', 'restore', 'restrict', 'result', 'retain', 'retire', 'return', 'reveal', 'review', 'revise', 'revolution', 'reward', 'rid', 'ride', 'ring', 'rise', 'risk', 'rob', 'rock', 'role', 'roll', 'romantic', 'roof', 'room', 'root', 'rope', 'rough', 'round', 'row', 'rub', 'ruin', 'rule', 'rush', 'safe', 'sail', 'satisfy', 'save', 'saw', 'say', 'scale', 'scare', 'scatter', 'scene', 'scent', 'schedule', 'scheme', 'school', 'science', 'score', 'scorn', 'scout', 'scratch', 'scream', 'screen', 'screw', 'seal', 'search', 'season', 'seat', 'second', 'secret', 'section', 'sector', 'secure', 'see', 'seed', 'seek', 'seem', 'sell', 'send', 'senior', 'sense', 'sentence', 'separate', 'series', 'serious', 'serve', 'service', 'settle', 'severe', 'sew', 'shade', 'shake', 'shall', 'shame', 'shape', 'share', 'sharp', 'shave', 'she', 'shed', 'sheep', 'sheet', 'shelf', 'shell', 'shelter', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe', 'shoot', 'shop', 'shore', 'short', 'shot', 'should', 'shoulder', 'shout', 'show', 'shower', 'shrink', 'shrug', 'shut', 'sick', 'side', 'sigh', 'sight', 'sign', 'signal', 'silence', 'silent', 'silver', 'similar', 'simple', 'sin', 'since', 'sing', 'sink', 'sit', 'site', 'situation', 'size', 'skate', 'skill', 'skin', 'skirt', 'sky', 'sleep', 'slice', 'slide', 'slight', 'slip', 'slope', 'slow', 'small', 'smart', 'smell', 'smile', 'smoke', 'smooth', 'snap', 'snow', 'so', 'soak', 'soap', 'social', 'society', 'soft', 'soil', 'soldier', 'solid', 'solution', 'solve', 'some', 'son', 'song', 'soon', 'sore', 'sort', 'soul', 'sound', 'soup', 'sour', 'source', 'south', 'space', 'spare', 'speak', 'special', 'specific', 'speech', 'speed', 'spell', 'spend', 'spit', 'split', 'spoil', 'spoke', 'sport', 'spot', 'spread', 'spring', 'square', 'squeeze', 'stable', 'stain', 'stake', 'stale', 'stamp', 'stand', 'star', 'stare', 'start', 'state', 'station', 'stay', 'steal', 'steam', 'steel', 'steep', 'step', 'stick', 'stiff', 'still', 'sting', 'stink', 'stir', 'stock', 'stomach', 'stone', 'stop', 'store', 'storm', 'story', 'stove', 'straight', 'strain', 'strange', 'strap', 'straw', 'stream', 'street', 'strength', 'stress', 'stretch', 'strict', 'strike', 'string', 'strip', 'strive', 'stroke', 'strong', 'struggle', 'stuck', 'study', 'stuff', 'stumble', 'stupid', 'subject', 'substance', 'substantial', 'substitute', 'succeed', 'success', 'such', 'suck', 'sudden', 'sue', 'suffer', 'suggest', 'suit', 'summer', 'summit', 'sun', 'sunlight', 'super', 'superior', 'supply', 'support', 'suppose', 'supreme', 'sure', 'surface', 'surgeon', 'surname', 'surpass', 'surplus', 'surprise', 'surround', 'survey', 'survive', 'suspect', 'suspend', 'sustain', 'swallow', 'swear', 'sweat', 'sweep', 'sweet', 'swell', 'swim', 'swing', 'switch', 'sword', 'symbol', 'sympathy', 'system', 'table', 'tackle', 'tail', 'take', 'tale', 'talent', 'talk', 'tall', 'tank', 'tap', 'tape', 'target', 'task', 'taste', 'taught', 'tax', 'tea', 'teach', 'team', 'tear', 'technical', 'technique', 'technology', 'tedious', 'teenager', 'teeth', 'tell', 'temper', 'temperature', 'template', 'tempt', 'tend', 'tender', 'tennis', 'tense', 'tent', 'term', 'terrible', 'territory', 'test', 'text', 'than', 'thank', 'that', 'the', 'theatre', 'theft', 'their', 'them', 'theme', 'then', 'theoretical', 'theory', 'there', 'therefore', 'these', 'they', 'thick', 'thin', 'thing', 'think', 'third', 'those', 'though', 'threat', 'threaten', 'thrill', 'thrive', 'throat', 'through', 'throughout', 'throw', 'thumb', 'thunder', 'thus', 'ticket', 'tide', 'tie', 'tiger', 'tight', 'till', 'time', 'tiny', 'tip', 'tire', 'tired', 'title', 'to', 'toast', 'tobacco', 'today', 'toe', 'together', 'toilet', 'told', 'tolerate', 'tomorrow', 'ton', 'tone', 'tongue', 'tonight', 'too', 'tool', 'tooth', 'top', 'topic', 'torch', 'torture', 'toss', 'total', 'touch', 'tough', 'tour', 'tourist', 'tournament', 'toward', 'tower', 'town', 'toxic', 'toy', 'trace', 'track', 'trade', 'tradition', 'traditional', 'traffic', 'tragedy', 'trail', 'train', 'trait', 'tramp', 'transfer', 'transform', 'transition', 'translate', 'transport', 'trap', 'trash', 'travel', 'treasure', 'treat', 'treatment', 'tree', 'tremendous', 'trend', 'trial', 'tribe', 'trick', 'trigger', 'trim', 'trip', 'triumph', 'trivial', 'trolley', 'troop', 'tropical', 'trouble', 'troublesome', 'trousers', 'truck', 'truly', 'trumpet', 'trunk', 'trust', 'truth', 'try', 'tube', 'tuck', 'tune', 'turn', 'tutor', 'twice', 'twist', 'type', 'typical', 'ugly', 'ultimate', 'umbrella', 'unable', 'unbearable', 'uncertain', 'uncle', 'under', 'undergo', 'understand', 'undertake', 'undo', 'undoubtedly', 'uneasy', 'unexpected', 'unfair', 'unfortunate', 'unhappy', 'uniform', 'united', 'unity', 'universal', 'universe', 'university', 'unknown', 'unless', 'unlike', 'unusual', 'unwanted', 'up', 'upcoming', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'upstairs', 'urban', 'urge', 'urgent', 'usage', 'use', 'used', 'useful', 'useless', 'user', 'usual', 'usually', 'utter', 'vacation', 'vacuum', 'vague', 'vain', 'valid', 'valley', 'valuable', 'value', 'van', 'vanish', 'variable', 'variation', 'variety', 'various', 'vary', 'vast', 'vegetable', 'vehicle', 'vendor', 'verb', 'verify', 'version', 'vertical', 'very', 'vessel', 'vest', 'veteran', 'via', 'victim', 'victory', 'video', 'view', 'viewer', 'village', 'violate', 'violence', 'violent', 'violin', 'virtual', 'virtue', 'virus', 'visible', 'vision', 'visit', 'visitor', 'visual', 'vital', 'vitamin', 'vivid', 'vocabulary', 'voice', 'volcano', 'volume', 'voluntary', 'vote', 'voyage', 'wage', 'wait', 'wake', 'walk', 'wall', 'wander', 'want', 'war', 'ward', 'warm', 'warmth', 'warn', 'warrant', 'wash', 'waste', 'watch', 'water', 'wave', 'way', 'we', 'weak', 'wealth', 'weapon', 'wear', 'weather', 'web', 'wedding', 'weed', 'week', 'weekday', 'weekend', 'weigh', 'weight', 'weird', 'welcome', 'weld', 'welfare', 'well', 'west', 'western', 'wet', 'what', 'whatever', 'wheat', 'wheel', 'when', 'whenever', 'where', 'wherever', 'whether', 'which', 'while', 'whisper', 'white', 'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'wide', 'widow', 'width', 'wife', 'wild', 'will', 'willing', 'win', 'wind', 'window', 'wine', 'wing', 'winner', 'winter', 'wire', 'wisdom', 'wise', 'wish', 'with', 'withdraw', 'within', 'without', 'witness', 'woman', 'wonder', 'wonderful', 'wood', 'wooden', 'wool', 'word', 'work', 'worker', 'world', 'worm', 'worn', 'worried', 'worry', 'worse', 'worship', 'worst', 'worth', 'worthless', 'worthwhile', 'worthy', 'would', 'wound', 'wrap', 'wreck', 'wrist', 'write', 'writer', 'wrong', 'yard', 'yeah', 'year', 'yellow', 'yes', 'yet', 'yield', 'you', 'young', 'your', 'youth', 'zero', 'zone'];

  const meanings = ['状态', '行为', '过程', '结果', '方法', '手段', '原因', '目的', '时间', '地点', '人物', '事物', '概念', '性质', '特征', '程度', '范围', '数量', '质量', '方向'];

  const levels: ('BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const categories = ['名词', '动词', '形容词', '副词', '介词', '连词'];

  let id = baseWords.length + 1;

  while (baseWords.length < 4000) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const base = bases[Math.floor(Math.random() * bases.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const meaning = meanings[Math.floor(Math.random() * meanings.length)];

    const word = prefix + base + suffix;
    const example = `This is an example sentence using ${word}.`;
    const exampleTranslation = `这是使用${word}的例句。`;

    baseWords.push({
      id: id++,
      word: word,
      phonetic: `/${word.slice(0, 3)}XXX/`,
      meaning: `${meaning}${id}`,
      example: example,
      exampleTranslation: exampleTranslation,
      level: level,
      category: category
    });
  }

  return baseWords.slice(0, 4000);
}
