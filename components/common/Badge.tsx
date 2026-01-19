import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "status" | "info";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-bg-tertiary text-text-secondary border border-border-primary",
    accent:
      "bg-accent-soft text-accent-primary border border-accent-primary/20",
    status: "bg-green-50 text-green-600 border border-green-100",
    info: "bg-blue-50 text-blue-600 border border-blue-100",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
