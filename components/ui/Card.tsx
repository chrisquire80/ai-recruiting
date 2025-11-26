import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode; 
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => (
  // AssessFirst Style: Extra rounded corners (rounded-3xl) and very soft shadows
  <div className={`bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 ${className}`}>
    {(title || action) && (
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
        {title && (
            <div className="font-bold text-slate-800 text-lg">{title}</div>
        )}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-8">
      {children}
    </div>
  </div>
);