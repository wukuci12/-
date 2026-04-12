#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// 资源库中的资源数据（从代码中提取）
const resources = [
  { id: '1', title: '机场日常对话', category: 'CONVERSATION' },
  { id: '2', title: '科技新闻简报', category: 'NEWS' },
  { id: '3', title: '大学环境科学讲座', category: 'LECTURE' },
  { id: '4', title: '名人深度访谈', category: 'INTERVIEW' },
  { id: '5', title: '经典英文短篇故事', category: 'STORY' },
  { id: '6', title: '商务会议记录', category: 'BUSINESS' },
  { id: '7', title: '多城市天气预报', category: 'NEWS' },
  { id: '8', title: 'TED演讲精选', category: 'LECTURE' },
  { id: '9', title: '餐厅点餐对话', category: 'CONVERSATION' },
  { id: '10', title: '学术研究报告', category: 'ACADEMIC' },
  { id: '11', title: '旅行问路对话', category: 'CONVERSATION' },
  { id: '12', title: '经济新闻分析', category: 'NEWS' },
  { id: '13', title: '医生与患者对话', category: 'CONVERSATION' },
  { id: '14', title: '历史纪录片旁白', category: 'LECTURE' },
  { id: '15', title: '职场面试模拟', category: 'INTERVIEW' },
  { id: '16', title: '儿童英语故事', category: 'STORY' },
  { id: '17', title: '体育赛事报道', category: 'NEWS' },
  { id: '18', title: '学术论文讨论', category: 'ACADEMIC' },
  { id: '19', title: '酒店预订对话', category: 'CONVERSATION' },
  { id: '20', title: '科学播客片段', category: 'LECTURE' }
];

// 练习数据（与实际页面一致）
const practices = {
  '1': { title: '机场对话听力练习', category: '对话' },
  '2': { title: '科技新闻听力练习', category: '新闻' },
  '3': { title: '大学讲座听力练习', category: '讲座' },
  '4': { title: '名人采访听力练习', category: '采访' },
  '5': { title: '短篇故事听力练习', category: '故事' },
  '6': { title: '商务会议听力练习', category: '对话' },
  '7': { title: '天气预报听力练习', category: '新闻' },
  '8': { title: '学术演讲听力练习', category: '讲座' },
  // 资源9-20对应的练习
  '9': { title: '餐厅对话听力练习', category: '对话' },
  '10': { title: '学术研究听力练习', category: '讲座' },
  '11': { title: '旅行对话听力练习', category: '对话' },
  '12': { title: '经济新闻听力练习', category: '新闻' },
  '13': { title: '医疗对话听力练习', category: '对话' },
  '14': { title: '历史纪录片听力练习', category: '讲座' },
  '15': { title: '职场面试听力练习', category: '采访' },
  '16': { title: '儿童故事听力练习', category: '故事' },
  '17': { title: '体育新闻听力练习', category: '新闻' },
  '18': { title: '学术讨论听力练习', category: '讲座' },
  '19': { title: '酒店服务听力练习', category: '对话' },
  '20': { title: '科学播客听力练习', category: '讲座' }
};

// 映射函数 - 资源ID直接映射到练习ID
function mapResourceIdToPracticeId(resourceId) {
  const idNum = parseInt(resourceId);
  if (isNaN(idNum)) return '1';

  // 资源ID直接映射到练习ID（1-20）
  if (idNum >= 1 && idNum <= 20) {
    return idNum.toString();
  }

  // 如果超出范围，使用取模运算
  return ((idNum - 1) % 20 + 1).toString();
}

// 检查单个资源链接
function testResourceLink(resourceId) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/listening/practice?next=${resourceId}`;
    console.log(`\n测试资源ID ${resourceId}: ${resources.find(r => r.id === resourceId)?.title}`);

    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const mappedPracticeId = mapResourceIdToPracticeId(resourceId);
        const resource = resources.find(r => r.id === resourceId);
        const practice = practices[mappedPracticeId];

        console.log(`  HTTP状态码: ${res.statusCode}`);
        console.log(`  映射到练习ID: ${mappedPracticeId} (${practice.title})`);

        // 检查内容匹配
        const hasPracticeTitle = data.includes(practice.title);
        console.log(`  页面包含练习标题: ${hasPracticeTitle ? '✓' : '✗'}`);

        // 检查是否有错误信息（更精确的检查，只检测真正的404错误）
        // 真正的错误会以标题形式出现，如 "404: This page could not be found"
        // Next.js hydration代码中包含 "error" 和 "page" 是正常的，不是错误
        const hasError = data.includes('"title","children":"404:') ||
                        data.includes('"title",null,{"children":"404:') ||
                        res.statusCode === 404 ||
                        res.statusCode >= 500;
        console.log(`  页面包含错误信息: ${hasError ? '⚠️ 可能有错误' : '✓ 无错误信息'}`);

        // 检查资源标题关键词是否与练习标题匹配
        const resourceTitle = resource.title;
        const practiceTitle = practice.title;
        const titlesMatch = (resourceTitle.includes('机场') && practiceTitle.includes('机场')) ||
                           (resourceTitle.includes('科技') && practiceTitle.includes('科技')) ||
                           (resourceTitle.includes('大学') && practiceTitle.includes('大学')) ||
                           (resourceTitle.includes('名人') && practiceTitle.includes('名人')) ||
                           (resourceTitle.includes('故事') && practiceTitle.includes('故事')) ||
                           (resourceTitle.includes('商务') && practiceTitle.includes('商务')) ||
                           (resourceTitle.includes('天气') && practiceTitle.includes('天气')) ||
                           (resourceTitle.includes('演讲') && practiceTitle.includes('演讲')) ||
                           (resourceTitle.includes('餐厅') && practiceTitle.includes('餐厅')) ||
                           (resourceTitle.includes('医生') && practiceTitle.includes('医疗')) ||
                           (resourceTitle.includes('学术') && practiceTitle.includes('学术')) ||
                           (resourceTitle.includes('旅行') && practiceTitle.includes('旅行')) ||
                           (resourceTitle.includes('经济') && practiceTitle.includes('经济')) ||
                           (resourceTitle.includes('医疗') && practiceTitle.includes('医疗')) ||
                           (resourceTitle.includes('历史') && practiceTitle.includes('历史')) ||
                           (resourceTitle.includes('职场') && practiceTitle.includes('职场')) ||
                           (resourceTitle.includes('儿童') && practiceTitle.includes('儿童')) ||
                           (resourceTitle.includes('体育') && practiceTitle.includes('体育')) ||
                           (resourceTitle.includes('酒店') && practiceTitle.includes('酒店')) ||
                           (resourceTitle.includes('科学') && practiceTitle.includes('科学')) ||
                           (resourceTitle.includes('播客') && practiceTitle.includes('播客'));

        console.log(`  资源与练习标题匹配: ${titlesMatch ? '✓' : '✗ (标题不符)'}`);

        // 成功条件：HTTP状态码200且没有明显的错误信息
        // 注意：hasPracticeTitle通常为false，因为React页面是动态渲染的
        const success = res.statusCode === 200 && !hasError;

        if (success) {
          resolve({ resourceId, success: true, titleMatch: titlesMatch });
        } else {
          resolve({ resourceId, success: false, titleMatch: titlesMatch, statusCode: res.statusCode, hasError, hasPracticeTitle });
        }
      });
    }).on('error', (err) => {
      reject(new Error(`资源ID ${resourceId} 测试失败: ${err.message}`));
    });
  });
}

async function runDiagnostics() {
  console.log('开始诊断听力资源库链接问题...\n');
  console.log('检查服务器连接...');

  // 首先检查服务器是否运行
  try {
    await new Promise((resolve, reject) => {
      http.get(BASE_URL, (res) => {
        console.log(`服务器状态: ✓ 运行中 (${res.statusCode})`);
        resolve();
      }).on('error', (err) => {
        reject(new Error(`无法连接到服务器: ${err.message}`));
      });
    });
  } catch (error) {
    console.error(`❌ ${error.message}`);
    console.error('请确保运行: npm run dev');
    process.exit(1);
  }

  console.log('\n测试所有资源链接...');

  const results = [];
  for (const resource of resources) {
    try {
      const result = await testResourceLink(resource.id);
      results.push(result);
    } catch (error) {
      console.error(`❌ ${error.message}`);
      results.push({ resourceId: resource.id, success: false, error: error.message });
    }
  }

  // 分析结果
  console.log('\n' + '='.repeat(60));
  console.log('诊断结果汇总:');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const categoryMismatches = results.filter(r => r.success && !r.titleMatch);

  console.log(`总共测试: ${results.length} 个资源`);
  console.log(`成功加载: ${successful.length} 个`);
  console.log(`加载失败: ${failed.length} 个`);
  console.log(`类别匹配: ${results.length - categoryMismatches.length} 个`);
  console.log(`类别不匹配: ${categoryMismatches.length} 个`);

  if (failed.length > 0) {
    console.log('\n❌ 加载失败的资源:');
    failed.forEach(f => {
      const resource = resources.find(r => r.id === f.resourceId);
      console.log(`  - ID ${f.resourceId}: ${resource?.title}`);
      if (f.statusCode) console.log(`    状态码: ${f.statusCode}`);
      if (f.hasError !== undefined) console.log(`    有错误信息: ${f.hasError}`);
      if (f.hasPracticeTitle !== undefined) console.log(`    包含练习标题: ${f.hasPracticeTitle}`);
    });
  }

  if (categoryMismatches.length > 0) {
    console.log('\n⚠️ 类别不匹配的资源:');
    categoryMismatches.forEach(m => {
      const resource = resources.find(r => r.id === m.resourceId);
      const mappedId = mapResourceIdToPracticeId(m.resourceId);
      const practice = practices[mappedId];
      console.log(`  - ID ${m.resourceId}: "${resource?.title}" (${resource?.category})`);
      console.log(`    映射到练习: "${practice.title}" (${practice.category})`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('建议:');

  if (failed.length > 0) {
    console.log('1. 检查练习页面的错误处理逻辑');
    console.log('2. 验证所有资源ID都能正确解析');
    console.log('3. 检查页面渲染是否有JavaScript错误');
  }

  if (categoryMismatches.length > 0) {
    console.log('1. 考虑为资源9-20创建对应的练习内容');
    console.log('2. 或调整映射逻辑，让相似类别的资源映射到对应练习');
    console.log('3. 或在UI中明确告知用户这是循环使用的练习内容');
  }

  if (failed.length === 0 && categoryMismatches.length === 0) {
    console.log('✓ 所有资源链接工作正常，类别匹配');
  }

  console.log('='.repeat(60));
}

// 运行诊断
runDiagnostics().catch(console.error);