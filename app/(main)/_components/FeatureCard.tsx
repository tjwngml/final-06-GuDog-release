interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor?: string;
  iconBgColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  bgColor = "bg-[#FFF9F2]/50",
  iconBgColor = "#FFFFFF",
}: FeatureCardProps) {
  return (
    <div
      className={`${bgColor} border border-border-primary p-12 rounded-[2.5rem] text-center hover:shadow-soft transition-all group`}
    >
      <div
        style={{ backgroundColor: iconBgColor }}
        className="w-14 h-14 text-accent-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:scale-110 transition-transform border border-border-primary"
      >
        {icon}
      </div>
      <h4 className="text-xl font-black text-text-primary mb-4 tracking-tight">{title}</h4>
      <p className="text-sm text-text-secondary font-medium leading-relaxed px-2">{description}</p>
    </div>
  );
}
