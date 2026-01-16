'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Sidebar from './Sidebar';
import AuthGuard from './AuthGuard';

export default function MainLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Scroll to top on route change to prevent "masked" content
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 relative isolate">
        <AuthGuard>
          {/* Background blobs */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-[rgba(45,212,191,0.15)] blur-3xl" />
            <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-[rgba(14,116,144,0.15)] blur-3xl" />
          </div>
          <div
            id="main-content-scroll"
            className="relative h-full overflow-y-auto px-6 pb-12 pt-14 sm:px-8 lg:px-10 z-10"
          >
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-8">
              {children}
            </div>
          </div>
        </AuthGuard>
      </div>
    </div>
  );
}
