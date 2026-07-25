import React from "react";


interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div 
      className={`glass-card ${className}`} 
      style={{ padding: props.style?.padding || "1.75rem", ...props.style }}
      {...props}
    >
      {children}
    </div>
  );
}
