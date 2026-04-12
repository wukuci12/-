import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

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

// 获取语法练习题列表
export async function GET(request: NextRequest) {
  try {
    // 验证用户
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const level = searchParams.get('level') as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | null;
    const completed = searchParams.get('completed') === 'true';

    // 构建查询条件
    const where: any = {};
    if (level) {
      where.level = level;
    }

    // 获取练习题
    const exercises = await prisma.grammarExercise.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    // 如果请求已完成练习，需要查询用户完成状态
    if (completed && userId) {
      const userExercises = await prisma.userExercise.findMany({
        where: {
          userId,
          exerciseType: 'GRAMMAR',
          completed: true,
        },
        select: { exerciseId: true, score: true, completedAt: true },
      });

      const userExerciseMap = new Map(userExercises.map(ue => [ue.exerciseId, ue]));

      // 合并练习数据和用户完成状态
      const exercisesWithStatus = exercises.map(exercise => {
        const userExercise = userExerciseMap.get(exercise.id);
        return {
          ...exercise,
          completed: !!userExercise,
          score: userExercise?.score || null,
          completedAt: userExercise?.completedAt || null,
        };
      });

      return NextResponse.json(exercisesWithStatus);
    }

    return NextResponse.json(exercises);

  } catch (error) {
    console.error('获取语法练习错误:', error);
    return NextResponse.json(
      { error: '获取语法练习失败' },
      { status: 500 }
    );
  }
}

// 提交语法练习答案
export async function POST(request: NextRequest) {
  try {
    // 验证用户
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { exerciseId, answers, timeSpent } = await request.json();

    if (!exerciseId || !answers) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取练习题
    const exercise = await prisma.grammarExercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: '练习题不存在' },
        { status: 404 }
      );
    }

    // 解析答案
    let correctAnswers: any;
    try {
      correctAnswers = JSON.parse(exercise.answer);
    } catch (error) {
      console.error('解析正确答案失败:', error);
      return NextResponse.json(
        { error: '练习题答案格式错误' },
        { status: 500 }
      );
    }

    // 检查答案并计算分数
    const userAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
    const result = checkAnswers(userAnswers, correctAnswers);

    const now = new Date();
    const score = result.score;

    // 查找或创建用户练习记录
    let userExercise = await prisma.userExercise.findUnique({
      where: {
        userId_exerciseId_exerciseType: {
          userId,
          exerciseId,
          exerciseType: 'GRAMMAR',
        },
      },
    });

    if (userExercise) {
      // 更新现有记录
      userExercise = await prisma.userExercise.update({
        where: { id: userExercise.id },
        data: {
          completed: true,
          score,
          userAnswers: JSON.stringify(userAnswers),
          timeSpent: timeSpent || 0,
          completedAt: now,
        },
      });
    } else {
      // 创建新记录
      userExercise = await prisma.userExercise.create({
        data: {
          userId,
          exerciseId,
          exerciseType: 'GRAMMAR',
          completed: true,
          score,
          userAnswers: JSON.stringify(userAnswers),
          timeSpent: timeSpent || 0,
          completedAt: now,
        },
      });
    }

    // 更新用户积分
    if (score >= 60) { // 及格分数
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: { increment: exercise.points || 10 },
        },
      });
    }

    // 更新学习进度
    await updateProgress(userId, 'GRAMMAR');

    return NextResponse.json({
      success: true,
      data: {
        ...userExercise,
        result: result.details,
        correctAnswers: correctAnswers,
      },
    });

  } catch (error) {
    console.error('提交语法练习错误:', error);
    return NextResponse.json(
      { error: '提交语法练习失败' },
      { status: 500 }
    );
  }
}

// 检查答案并计算分数
function checkAnswers(userAnswers: any, correctAnswers: any): { score: number; details: any } {
  // 简单实现：比较答案
  // 实际应该根据题型进行更复杂的检查
  let correctCount = 0;
  let totalCount = 0;
  const details: any = {};

  if (Array.isArray(correctAnswers) && Array.isArray(userAnswers)) {
    totalCount = correctAnswers.length;
    for (let i = 0; i < correctAnswers.length; i++) {
      const isCorrect = JSON.stringify(userAnswers[i]) === JSON.stringify(correctAnswers[i]);
      if (isCorrect) correctCount++;
      details[`question${i + 1}`] = {
        correct: isCorrect,
        userAnswer: userAnswers[i],
        correctAnswer: correctAnswers[i],
      };
    }
  } else if (typeof correctAnswers === 'object' && typeof userAnswers === 'object') {
    // 对象格式的答案
    const keys = Object.keys(correctAnswers);
    totalCount = keys.length;
    keys.forEach(key => {
      const isCorrect = JSON.stringify(userAnswers[key]) === JSON.stringify(correctAnswers[key]);
      if (isCorrect) correctCount++;
      details[key] = {
        correct: isCorrect,
        userAnswer: userAnswers[key],
        correctAnswer: correctAnswers[key],
      };
    });
  }

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return { score, details };
}

// 更新语法学习进度
async function updateProgress(userId: string, module: string) {
  try {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_module: {
          userId,
          module,
        },
      },
    });

    // 计算用户完成的语法练习数量
    const completedExercises = await prisma.userExercise.count({
      where: {
        userId,
        exerciseType: 'GRAMMAR',
        completed: true,
      },
    });

    // 简单逻辑：完成5个练习视为完成该模块
    const completed = completedExercises >= 5;

    if (progress) {
      await prisma.progress.update({
        where: { id: progress.id },
        data: {
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    } else {
      await prisma.progress.create({
        data: {
          userId,
          module,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }
  } catch (error) {
    console.error('更新进度错误:', error);
  }
}