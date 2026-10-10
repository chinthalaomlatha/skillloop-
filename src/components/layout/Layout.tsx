import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ConfigBanner } from './ConfigBanner';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      <ConfigBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
