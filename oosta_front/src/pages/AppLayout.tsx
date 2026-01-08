import React from 'react';
import Header from "./Header";
import Footer from "../ui/Footer";
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      
      {/* --- Fixed Background Layer --- */}
      {/* 'fixed inset-0' pins this div to the viewport so it never moves when scrolling. */}
      {/* 'z-0' keeps it behind everything. */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-2">
        
        {/* Top Left Green Blob */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 mix-blend-multiply" />
        
        {/* Bottom Right Purple Blob */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 mix-blend-multiply" />
        
        {/* Center White Highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-white/60 rounded-full blur-[80px]" />
      </div>

      {/* --- Main Scrollable Content --- */}
      {/* 'relative z-10' ensures the content sits on top of the fixed background and remains clickable. */}
      <div className="relative z-10">
        <Header />

        <main>
          <Outlet/>
        </main>

        <Footer />
      </div>

    </div>
  );
}

export default AppLayout;