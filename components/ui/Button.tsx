import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon: Icon,
  className = '',
  disabled,
  ...props 
}) => {
  // AssessFirst Style: Fully rounded (rounded-full) buttons
  // Accessibility: Added focus-visible classes for better keyboard navigation without ugly clicks
  const baseStyles = "inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-offset-2";
  
  const variants = {
    // Primary is now Pink (#ec4899)
    primary: "bg-pink-500 text-white hover:bg-pink-600 hover:shadow-lg hover:shadow-pink-500/40 focus-visible:ring-pink-400 border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-pink-300 hover:text-pink-600 shadow-sm focus-visible:ring-pink-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 hover:border-red-200 focus-visible:ring-red-500",
    ghost: "text-slate-500 hover:bg-pink-50 hover:text-pink-600 focus-visible:ring-pink-200"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : Icon ? (
        <Icon size={18} className={children ? "" : ""} />
      ) : null}
      {children}
    </button>
  );
};