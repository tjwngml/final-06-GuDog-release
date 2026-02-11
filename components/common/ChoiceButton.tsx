interface ChoiceButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
  size?: "default" | "sm";
}

export default function ChoiceButton({
  selected,
  onClick,
  label,
  desc,
  size = "default",
}: ChoiceButtonProps) {
  /** 공통 클래스 */
  const baseClass = "border-2 transition-all";

  /** 선택/비선택 상태 */
  const stateClass = selected
    ? "border-accent-primary bg-accent-soft text-accent-primary shadow-glow"
    : "border-border-primary hover:border-accent-soft text-text-tertiary";

  /** desc 없는 단일 버튼 */
  if (!desc) {
    return (
      <button
        type="button"
        onClick={onClick}
        role="radio"
        aria-checked={selected}
        className={`${baseClass} ${stateClass} p-4 md:p-6 rounded-xl md:rounded-2xl font-black text-xs md:text-sm`}
      >
        {label}
      </button>
    );
  }

  /** desc 있는 카드형 버튼 */
  const sizeClass = size === "sm" ? "p-3 md:p-5 h-24 md:h-32 rounded-2xl md:rounded-[2rem]" : "p-5 md:p-8 rounded-2xl md:rounded-[2.5rem]";

  return (
    <button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      className={`${baseClass} ${stateClass} ${sizeClass} flex flex-col items-center justify-center duration-300 ${
        selected ? "scale-105" : ""
      }`}
    >
      <span className={`font-black mb-1 ${size === "sm" ? "text-xs md:text-sm" : "text-base md:text-lg"}`}>{label}</span>
      <span
        className={`font-bold opacity-60 ${
          size === "sm" ? "text-[10px] leading-tight" : "text-[10px] md:text-xs"
        }`}
      >
        {desc}
      </span>
    </button>
  );
}
