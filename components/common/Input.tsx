import { InputHTMLAttributes, forwardRef, useId } from "react";

const SearchIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.375 18.375L13.125 13.125M14.875 8.75C14.875 9.55435 14.7166 10.3508 14.4088 11.0939C14.101 11.8371 13.6498 12.5123 13.081 13.081C12.5123 13.6498 11.8371 14.101 11.0939 14.4088C10.3508 14.7166 9.55435 14.875 8.75 14.875C7.94565 14.875 7.14918 14.7166 6.40606 14.4088C5.66294 14.101 4.98773 13.6498 4.41897 13.081C3.85021 12.5123 3.39905 11.8371 3.09124 11.0939C2.78343 10.3508 2.625 9.55435 2.625 8.75C2.625 7.12555 3.27031 5.56763 4.41897 4.41897C5.56763 3.27031 7.12555 2.625 8.75 2.625C10.3745 2.625 11.9324 3.27031 13.081 4.41897C14.2297 5.56763 14.875 7.12555 14.875 8.75Z"
      stroke="#909094"
      strokeWidth="2.1875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  hideLabel?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isSearch?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hideLabel = false,
      isError = false,
      errorMessage,
      isSearch = false,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={`flex flex-col items-start gap-[14px] ${className}`}>
        <label
          htmlFor={inputId}
          className={`text-[0.6125rem] font-black leading-[15px] tracking-[2px] uppercase text-[#909094] ${
            hideLabel ? "sr-only" : ""
          }`}
        >
          {label}
        </label>
        <div className="relative w-full">
          {isSearch && (
            <span className="absolute left-5 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={isError}
            className={`w-full h-12 px-5 py-4 bg-[#F9F9FB] shadow-sm rounded-2xl text-md font-bold leading-4 text-[#1A1A1C] placeholder:text-[#9CA3AF] outline-none ring-2 focus:ring-2 transition-shadow ${
              isSearch ? "pl-[3.5rem]" : ""
            } ${
              isError
                ? "ring-[#F87171] focus:ring-[#F87171]"
                : "ring-transparent focus:ring-[#FBA613]"
            }`}
            {...props}
          />
        </div>
        {isError && errorMessage && (
          <p className="text-xs font-bold text-red-500 ml-2 animate-in fade-in slide-in-from-top-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
