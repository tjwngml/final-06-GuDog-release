import React from "react";
import Link from "next/link";

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

interface ButtonAsButton
  extends ButtonBaseProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonAsLink
  extends
    ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl";

  const variants = {
    primary:
      "bg-accent-primary text-white hover:bg-accent-primaryLight shadow-glow active:bg-accent-primaryDark",
    secondary:
      "bg-accent-soft text-accent-primary hover:bg-orange-100 active:bg-accent-soft",
    ghost:
      "bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary",
    outline:
      "bg-white text-text-primary border-2 border-border-secondary hover:border-accent-primary/30 active:bg-bg-secondary",
    icon: "p-2.5 text-text-secondary hover:text-accent-primary hover:bg-accent-soft border border-border-primary rounded-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4.5 text-base",
  };

  const finalClassName = `${baseStyles} ${variants[variant]} ${variant === "icon" ? "" : sizes[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={finalClassName}
        {...(props as Omit<
          React.AnchorHTMLAttributes<HTMLAnchorElement>,
          "href"
        >)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={finalClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};

export default Button;
