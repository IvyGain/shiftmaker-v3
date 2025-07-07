'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      // Redirect based on user role
      if (user.role === 'manager') {
        router.push('/admin');
      } else {
        router.push('/employee');
      }
    } else {
      // Redirect to login page
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          シフト管理システム
        </h1>
        <p className="text-gray-600">
          リダイレクト中...
        </p>
      </div>
    </div>
  );
}
