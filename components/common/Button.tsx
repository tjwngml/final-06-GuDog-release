import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

// 기본 아이콘
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.25 2.91797L9.33333 7.0013L5.25 11.0846"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.75 11.0846L4.66667 7.0013L8.75 2.91797"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 공통 props
interface CommonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  leftIcon?: ReactNode | boolean;
  rightIcon?: ReactNode | boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

// 버튼 타입 (href 없음)
type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: never;
  };

// 링크 타입 (href 있음)
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-4 py-1 text-[0.625rem] gap-1",
  sm: "px-5 py-3 text-xs gap-1.5",
  md: "px-6 py-4 text-xs gap-2",
  lg: "px-5 py-3 text-sm gap-2 lg:px-7 lg:py-5 lg:text-base lg:gap-2.5",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#FBA613] text-white hover:bg-[#E59200] active:bg-[#D08500]",
  secondary: "bg-[#FFF5E6] text-[#FBA613] hover:bg-[#FFEDD5] active:bg-[#FFE4C4]",
  outline: "bg-white text-[#1A1A1C] border-2 border-black/10 hover:bg-gray-50 active:bg-gray-100",
  ghost: "bg-transparent text-[#646468] hover:bg-black/5 active:bg-black/10",
};

const baseStyles = `
  inline-flex items-center justify-center
  font-medium rounded-xl
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-[#FBA613] focus:ring-offset-2
`;

export default function Button(props: ButtonProps) {
  const {
    size = "md",
    variant = "primary",
    leftIcon,
    rightIcon,
    children,
    className = "",
    disabled,
  } = props;

  const combinedClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
    ${className}
  `.trim();

  const renderLeftIcon = () => {
    if (leftIcon === true) return <ArrowLeftIcon />;
    if (leftIcon) return leftIcon;
    return null;
  };

  const renderRightIcon = () => {
    if (rightIcon === true) return <ArrowRightIcon />;
    if (rightIcon) return rightIcon;
    return null;
  };

  const content = (
    <>
      {renderLeftIcon() && (
        <span className="shrink-0" aria-hidden="true">
          {renderLeftIcon()}
        </span>
      )}
      {children}
      {renderRightIcon() && (
        <span className="shrink-0" aria-hidden="true">
          {renderRightIcon()}
        </span>
      )}
    </>
  );

  // href가 있으면 Link
  if ("href" in props && props.href) {
    const { href, ...restProps } = props as ButtonAsLink;

    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  // href가 없으면 Button
  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      type={(props as ButtonAsButton).type ?? "button"}
      onClick={(props as ButtonAsButton).onClick}
    >
      {content}
    </button>
  );
}
