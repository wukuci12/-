import { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-indigo-700">English Learning</h1>
            <p className="text-gray-600 mt-2">高中英语学习平台</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {children}
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2024 English Learning Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}