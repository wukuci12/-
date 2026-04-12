'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email或用户名不能为空'),
  password: z.string().min(1, '密码不能为空'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      await login(data.emailOrUsername, data.password);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || '登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">欢迎回来</h2>
        <p className="text-gray-600 mt-2">登录您的账户继续学习</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱或用户名
          </label>
          <input
            {...register('emailOrUsername')}
            type="text"
            id="emailOrUsername"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="请输入邮箱或用户名"
            disabled={isLoading}
          />
          {errors.emailOrUsername && (
            <p className="mt-1 text-sm text-red-600">{errors.emailOrUsername.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="请输入密码"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              记住我
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            忘记密码？
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          还没有账户？{' '}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}