import { InputHTMLAttributes, forwardRef, useId } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "size"
> {
  label: string;
  hideLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hideLabel = false, size = "md", className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const sizeStyles = {
      sm: {
        box: "w-4 h-4 bg-[length:16px_64px]",
        positions:
          "bg-[position:0_0] peer-checked:bg-[position:0_-16px] peer-focus:bg-[position:0_-32px] peer-checked:peer-focus:bg-[position:0_-48px]",
        text: "text-xs",
      },
      md: {
        box: "w-6 h-6 bg-[length:24px_96px]",
        positions:
          "bg-[position:0_0] peer-checked:bg-[position:0_-24px] peer-focus:bg-[position:0_-48px] peer-checked:peer-focus:bg-[position:0_-72px]",
        text: "text-sm",
      },
    };

    const styles = sizeStyles[size];

    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <input ref={ref} type="checkbox" id={inputId} className="peer sr-only" {...props} />
        <label
          htmlFor={inputId}
          className={`cursor-pointer bg-[url('/images/checkbox-sprite.svg')] ${styles.box} ${styles.positions}`}
        >
          <span className="sr-only">{label}</span>
        </label>
        {!hideLabel && (
          <label htmlFor={inputId} className={`cursor-pointer ${styles.text} text-[#1A1A1C]`}>
            {label}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
