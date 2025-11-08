'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract current view from pathname
  const currentView = pathname.split('/')[1] || 'dashboard';

  return (
    <PreferencesProvider>
      <AuthProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar currentView={currentView} />
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </PreferencesProvider>
  );
}
