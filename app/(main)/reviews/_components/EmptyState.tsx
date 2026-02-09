export const EmptyState = () => (
  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-border-primary">
    <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-text-tertiary">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h4 className="text-xl font-black text-text-primary mb-2">선택한 별점의 후기가 없습니다</h4>
    <p className="text-text-secondary font-medium">다른 별점 필터를 선택해 보세요.</p>
  </div>
);
