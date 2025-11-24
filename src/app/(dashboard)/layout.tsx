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
        <div className="container">
          <Sidebar currentView={currentView} />
          <div className="main-content">
            <div className="header">
              <Header />
            </div>
            <main>
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </PreferencesProvider>
  );
}
