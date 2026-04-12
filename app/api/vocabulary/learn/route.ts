import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken, getUserFromToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// 间隔重复算法 (SM-2简化版)
interface SRSAlgorithm {
  easeFactor: number; // 易度因子 (1.3-2.5)
  interval: number;   // 下次复习间隔 (天)
  reviewCount: number; // 已复习次数
}

const calculateNextReview = (
  quality: number, // 回答质量 0-5
  currentEaseFactor: number,
  currentInterval: number,
  reviewCount: number
): SRSAlgorithm => {
  let newEaseFactor = currentEaseFactor;
  let newInterval = currentInterval;
  let newReviewCount = reviewCount + 1;

  // 根据回答质量调整易度因子
  if (quality >= 3) {
    // 回答正确，增加易度因子
    newEaseFactor = Math.max(1.3, currentEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  } else {
    // 回答错误，降低易度因子
    newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
  }

  // 根据易度因子和复习次数计算间隔
  if (reviewCount === 0) {
    // 第一次复习
    newInterval = 1; // 1天后
  } else if (reviewCount === 1) {
    // 第二次复习
    newInterval = 6; // 6天后
  } else {
    // 第三次及以后
    newInterval = Math.round(currentInterval * newEaseFactor);
  }

  // 如果回答质量差，重置间隔
  if (quality < 3) {
    newInterval = 1;
    newReviewCount = Math.max(0, reviewCount - 1); // 减少复习次数
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    reviewCount: newReviewCount,
  };
};

// 从请求中获取用户ID
async function getUserIdFromRequest(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const user = await getUserFromToken(token);
    return user?.id || null;
  } catch (error) {
    console.error('获取用户ID错误:', error);
    return null;
  }
}

// 获取新词 (用户未学习过的词汇)
export async function GET(request: NextRequest) {
  try {
    // 验证用户
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // 获取用户已学习的词汇ID
    const learnedVocab = await prisma.userVocabulary.findMany({
      where: { userId },
      select: { vocabularyId: true },
    });

    const learnedVocabIds = learnedVocab.map(item => item.vocabularyId);

    // 获取新词 (不在用户已学习列表中)
    const newWords = await prisma.vocabulary.findMany({
      where: {
        id: { notIn: learnedVocabIds },
        level: 'INTERMEDIATE', // 可以根据用户等级调整
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    // 如果新词不足，可以返回已学习但需要复习的词汇
    if (newWords.length === 0) {
      // 获取需要复习的词汇 (nextReview <= 当前时间)
      const dueReviewWords = await prisma.userVocabulary.findMany({
        where: {
          userId,
          nextReview: { lte: new Date() },
          status: { in: ['LEARNING', 'REVIEWING'] },
        },
        include: {
          vocabulary: true,
        },
        take: limit,
        orderBy: { nextReview: 'asc' },
      });

      return NextResponse.json({
        words: dueReviewWords.map(item => ({
          ...item.vocabulary,
          userVocabId: item.id,
          status: item.status,
          reviewCount: item.reviewCount,
          easeFactor: item.easeFactor,
          nextReview: item.nextReview,
        })),
        type: 'review', // 标识这是复习词汇
      });
    }

    return NextResponse.json({
      words: newWords,
      type: 'new', // 标识这是新词
    });

  } catch (error) {
    console.error('获取词汇错误:', error);
    return NextResponse.json(
      { error: '获取词汇失败' },
      { status: 500 }
    );
  }
}

// 更新学习状态
export async function POST(request: NextRequest) {
  try {
    // 验证用户
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }
    const { vocabularyId, quality, userAnswer } = await request.json();

    if (!vocabularyId || quality === undefined) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取词汇信息
    const vocabulary = await prisma.vocabulary.findUnique({
      where: { id: vocabularyId },
    });

    if (!vocabulary) {
      return NextResponse.json(
        { error: '词汇不存在' },
        { status: 404 }
      );
    }

    // 查找用户词汇记录
    let userVocab = await prisma.userVocabulary.findUnique({
      where: {
        userId_vocabularyId: {
          userId,
          vocabularyId,
        },
      },
    });

    const now = new Date();
    let easeFactor = 2.5; // 默认易度因子
    let reviewCount = 0;
    let lastInterval = 0;

    if (userVocab) {
      // 已有记录，更新
      easeFactor = userVocab.easeFactor || 2.5;
      reviewCount = userVocab.reviewCount;
      lastInterval = userVocab.lastInterval || 0;
    }

    // 计算下次复习时间
    const srsResult = calculateNextReview(
      quality,
      easeFactor,
      lastInterval,
      reviewCount
    );

    // 确定状态
    let status: 'NEW' | 'LEARNING' | 'REVIEWING' | 'MASTERED' = 'LEARNING';
    if (srsResult.reviewCount >= 5 && quality >= 4) {
      status = 'MASTERED';
    } else if (srsResult.reviewCount > 0) {
      status = 'REVIEWING';
    }

    // 计算下次复习时间
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + srsResult.interval);

    if (userVocab) {
      // 更新现有记录
      userVocab = await prisma.userVocabulary.update({
        where: { id: userVocab.id },
        data: {
          status,
          reviewCount: srsResult.reviewCount,
          easeFactor: srsResult.easeFactor,
          lastInterval: srsResult.interval,
          lastReview: now,
          nextReview: nextReviewDate,
        },
      });
    } else {
      // 创建新记录
      userVocab = await prisma.userVocabulary.create({
        data: {
          userId,
          vocabularyId,
          status,
          reviewCount: srsResult.reviewCount,
          easeFactor: srsResult.easeFactor,
          lastInterval: srsResult.interval,
          lastReview: now,
          nextReview: nextReviewDate,
        },
      });
    }

    // 更新用户积分
    if (quality >= 3) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: 5 }, // 每正确回答一个单词得5分
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...userVocab,
        nextReview: nextReviewDate,
        interval: srsResult.interval,
      },
    });

  } catch (error) {
    console.error('更新学习状态错误:', error);
    return NextResponse.json(
      { error: '更新学习状态失败' },
      { status: 500 }
    );
  }
}