interface InfoBoxProps {
  children: React.ReactNode;
}

export default function InfoBox({ children }: InfoBoxProps) {
  return (
    <div className="p-5 md:p-10 bg-accent-soft/30 rounded-2xl md:rounded-[2.5rem] border border-accent-soft flex items-start space-x-4 md:space-x-6">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-accent-primary shadow-soft shrink-0">
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-xs md:text-sm font-bold text-accent-primaryDark leading-relaxed pt-1">{children}</p>
    </div>
  );
}
