'use client';

import Link from 'next/link';

export default function GrammarTestPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">语法测试</h1>
        <p className="text-gray-600 text-lg">
          通过综合测试评估你的语法掌握程度
        </p>
      </div>

      {/* 功能说明卡片 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">功能说明</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">综合评估</h3>
              <p className="text-gray-600">
                语法测试将包含各种语法知识点，从基础到高级，全面评估你的语法能力。
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-green-600">📊</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">详细报告</h3>
              <p className="text-gray-600">
                测试完成后将生成详细报告，指出你的强项和需要改进的薄弱环节。
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-purple-600">🎯</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">个性化建议</h3>
              <p className="text-gray-600">
                根据测试结果为你推荐针对性的学习计划和练习内容。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 即将推出提示 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200">
        <div className="text-center">
          <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">功能开发中</h3>
          <p className="text-gray-600 mb-6">
            语法测试功能正在积极开发中，即将上线！
            目前你可以先使用语法练习功能提升语法能力。
          </p>
          <Link
            href="/grammar/practice"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 font-medium"
          >
            📚 开始语法练习
          </Link>
        </div>
      </div>

      {/* 替代方案 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">语法练习</h3>
          <p className="text-gray-600 mb-6">
            通过针对性的语法练习，逐步提升各个语法知识点的掌握程度。
          </p>
          <Link
            href="/grammar/practice"
            className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
          >
            开始练习 →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">错题复习</h3>
          <p className="text-gray-600 mb-6">
            查看和分析之前做错的题目，巩固薄弱环节，避免重复犯错。
          </p>
          <Link
            href="/grammar/review"
            className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 font-medium"
          >
            复习错题 →
          </Link>
        </div>
      </div>

      {/* 返回导航 */}
      <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/grammar"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          ← 返回语法学习
        </Link>
        <div className="text-sm text-gray-600">
          语法测试功能预计 2-3 周后上线
        </div>
      </div>
    </div>
  );
}