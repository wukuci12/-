'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/vocabulary');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // 重定向中
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg"></div>
          <span className="text-xl font-bold text-indigo-700">English Learning</span>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            登录
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            注册
          </Link>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            智能化高中英语学习平台
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            基于AI技术，提供词汇、语法、听力、阅读、写作、口语全方位训练，
            助力高中英语学习高效提升
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg"
            >
              免费开始学习
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-lg"
            >
              了解更多
            </Link>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">智能词汇学习</h3>
            <p className="text-gray-600">
              基于间隔重复算法，个性化记忆曲线，高效掌握高中核心词汇
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI写作批改</h3>
            <p className="text-gray-600">
              Claude AI智能批改作文，提供语法检查、内容评价和改进建议
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🗣️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">口语对话练习</h3>
            <p className="text-gray-600">
              与AI对话伙伴实时练习口语，获得发音建议和语法纠正
            </p>
          </div>
        </div>

        {/* 学习模块展示 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            六大学习模块
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: '词汇记忆', icon: '🧠', color: 'bg-blue-100', desc: '高中核心词汇' },
              { name: '语法练习', icon: '📝', color: 'bg-green-100', desc: '系统语法训练' },
              { name: '听力训练', icon: '🎧', color: 'bg-yellow-100', desc: '听力理解提升' },
              { name: '阅读理解', icon: '📖', color: 'bg-purple-100', desc: '分级阅读材料' },
              { name: '写作练习', icon: '✏️', color: 'bg-pink-100', desc: 'AI智能批改' },
              { name: '口语对话', icon: '💬', color: 'bg-indigo-100', desc: '实时对话练习' },
            ].map((module, index) => (
              <div key={index} className="text-center p-6">
                <div className={`h-16 w-16 ${module.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{module.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{module.name}</h4>
                <p className="text-gray-600 text-sm">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="mt-16 py-8 border-t border-gray-200 text-center text-gray-600">
        <p>© 2024 English Learning Platform. All rights reserved.</p>
        <p className="mt-2 text-sm">让英语学习更高效、更智能</p>
      </footer>
    </div>
  );
}
