import { TextareaHTMLAttributes, forwardRef, useId } from "react";

interface ContentdetailProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "className"
> {
  label?: string;
  hideLabel?: boolean;
  isError?: boolean;
  currentLength: number; // 현재 입력된 글자 수
  maxLength: number; // 최대 허용 글자 수
  className?: string;
}

const Contentdetail = forwardRef<HTMLTextAreaElement, ContentdetailProps>(
  (
    {
      label,
      hideLabel = false,
      isError = false,
      currentLength,
      maxLength,
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
        {/* 라벨과 글자 수 표시 섹션 */}
        <div className="flex justify-between w-full items-center">
          {label && (
            <label
              htmlFor={inputId}
              className={`text-[#1A1A1C] font-inter text-[11.5px] font-black leading-[17.5px] uppercase ${
                hideLabel ? "sr-only" : ""
              }`}
            >
              {label}
            </label>
          )}
          <p className="text-[#909094] font-inter text-[11.5px] font-black leading-[17.5px]">
            {currentLength}/{maxLength}
          </p>
        </div>

        {/* 텍스트 영역 (TextArea) */}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          aria-invalid={isError}
          className={`w-full h-[150px] px-5 py-4 bg-[#F9F9FB] shadow-sm rounded-2xl text-md font-bold leading-6 text-[#1A1A1C] placeholder:text-[#9CA3AF] outline-none ring-2 transition-all resize-none ${
            isError
              ? "ring-[#F87171] focus:ring-[#F87171]"
              : "ring-transparent focus:ring-[#FBA613]"
          }`}
          {...props}
        />
      </div>
    );
  },
);

Contentdetail.displayName = "Contentdetail";

export default Contentdetail;
