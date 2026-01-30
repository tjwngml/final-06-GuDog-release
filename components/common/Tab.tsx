interface TabItem<T extends string> {
  key: T;
  label: string;
  count?: number;
}

interface TabProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  className?: string;
}

const Tab = <T extends string>({ tabs, activeTab, onTabChange, className = "" }: TabProps<T>) => {
  return (
    <div
      className={`flex border px-1.5 py-1.5 rounded-[0.875rem] border-border-primary bg-white shadow-(--shadow-card) ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`inline-flex flex-1 justify-center px-10.5 py-3.5 rounded-[0.875rem] text-[0.75rem] font-black whitespace-nowrap transition-colors
            ${
              activeTab === tab.key
                ? "bg-[#FBA613] text-white shadow-(--shadow-glow)"
                : "bg-white text-text-tertiary"
            }`}
        >
          {tab.label}
          {tab.count !== undefined && `(${tab.count})`}
        </button>
      ))}
    </div>
  );
};

export default Tab;
