import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateContent(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const content = response.content[0];
  if (content.type === 'text') {
    return content.text;
  }
  return '';
}

export async function analyzeGrammar(text: string): Promise<string> {
  const prompt = `请分析以下文本的语法错误并提供修正建议：\n\n${text}`;
  return generateContent(prompt);
}

export async function gradeWriting(text: string, topic: string): Promise<string> {
  const prompt = `请根据以下题目和评分标准，对作文进行批改：\n\n题目：${topic}\n\n作文内容：\n${text}\n\n评分标准：\n1. 内容与结构（30分）：主题明确，内容充实，结构合理\n2. 语言表达（30分）：语法正确，词汇丰富，表达流畅\n3. 思想深度（20分）：观点独到，分析深入\n4. 创新性（20分）：创意新颖，见解独特\n\n请给出总分和具体的改进建议。`;
  return generateContent(prompt);
}

export async function practiceSpeaking(topic: string): Promise<string> {
  const prompt = `请围绕以下话题生成一段英语口语练习对话，包含至少5轮对话：\n\n话题：${topic}\n\n要求：\n1. 对话自然流畅，符合英语表达习惯\n2. 包含一些常见的口语表达和俚语\n3. 对话内容丰富，有深度\n4. 最后提供一些相关的词汇和表达方式建议`;
  return generateContent(prompt);
}
