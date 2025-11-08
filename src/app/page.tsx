'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import Login from '@/components/Login';
import Onboarding from '@/components/Onboarding';

function AppContent() {
  const router = useRouter();
  const { isAuthenticated, needsOnboarding, completeOnboarding } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !needsOnboarding) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, needsOnboarding, router]);

  if (!isAuthenticated) {
    return <Login />;
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return null; // Will redirect to /dashboard
}

export default function Home() {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PreferencesProvider>
  );
}
