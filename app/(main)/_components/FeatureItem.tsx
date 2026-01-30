interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex items-start gap-7">
      {/* 아이콘 박스 */}
      <div className="w-14 h-14 flex items-center justify-center shrink-0">{icon}</div>
      {/* 텍스트 */}
      <div className="flex flex-col gap-1.5">
        <h4 className="text-base font-black text-[#1A1A1C] leading-6">{title}</h4>
        <p className="max-w-95 text-xs font-medium text-[#646468] leading-[23px]">{description}</p>
      </div>
    </div>
  );
}
