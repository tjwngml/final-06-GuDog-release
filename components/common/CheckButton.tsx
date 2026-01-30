interface CheckButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}

export default function CheckButton({ selected, onClick, label, desc }: CheckButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-[1.8rem] border-2 transition-all font-bold text-left flex items-center justify-between ${
        selected
          ? "border-accent-primary bg-accent-soft text-accent-primary shadow-glow"
          : "border-border-primary hover:border-accent-soft text-text-tertiary bg-white"
      }`}
    >
      <div>
        <span className="text-sm font-black block mb-1">{label}</span>
        {desc && <span className="text-[10px] font-bold opacity-60">{desc}</span>}
      </div>
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected
            ? "bg-accent-primary border-accent-primary text-white"
            : "border-border-secondary"
        }`}
      >
        {selected && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
