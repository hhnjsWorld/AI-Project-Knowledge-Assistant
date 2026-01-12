'use client';

import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className="relative flex-1 overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-[rgba(15,118,110,0.18)] blur-3xl" />
            <div className="absolute -bottom-20 -left-32 h-80 w-80 rounded-full bg-[rgba(14,116,144,0.15)] blur-3xl" />
          </div>
          <div className="relative h-full overflow-y-auto scroll-smooth px-6 pb-12 pt-14 sm:px-8 lg:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
