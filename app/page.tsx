'use client';

import Link from 'next/link';

export default function Home() {
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
            href="/vocabulary"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            开始学习
          </Link>
        </div>
      </nav>

      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            高中英语学习平台
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            智能化英语学习，全方位提升你的英语能力
          </p>
          <Link
            href="/vocabulary"
            className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 font-medium"
          >
            立即开始学习
          </Link>
        </div>

        {/* 功能模块 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { href: '/vocabulary', icon: '📚', title: '词汇学习', desc: '科学记忆，高效积累' },
            { href: '/grammar', icon: '📝', title: '语法练习', desc: '系统学习，巩固基础' },
            { href: '/listening', icon: '🎧', title: '听力训练', desc: '多样素材，提升听力' },
            { href: '/reading', icon: '📖', title: '阅读理解', desc: '精选文章，培养语感' },
            { href: '/writing', icon: '✏️', title: '写作练习', desc: '技巧指导，范文参考' },
            { href: '/speaking', icon: '🗣️', title: '口语对话', desc: 'AI陪练，提升口语' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
