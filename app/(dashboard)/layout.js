'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AppBar from '@/components/layout/AppBar';
import ProtectedRoute from '@/components/layout/ProtectedRoute';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AppBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />
        <div className="flex pt-16">
          <Sidebar open={sidebarOpen} />
          <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
            <div className="p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}