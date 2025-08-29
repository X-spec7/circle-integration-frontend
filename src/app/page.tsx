'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { ProjectsProvider } from '@/contexts/projects-context';
import Dashboard from '@/components/dashboard';
import SMEDashboard from '@/components/sme-dashboard';
import Header from '@/components/header';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <ProjectsProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        {user?.user_type === 'sme' ? <SMEDashboard /> : <Dashboard />}
      </div>
    </ProjectsProvider>
  );
}
