interface SectionTitleProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  alignLg?: "left" | "center";
  descriptionWidth?: string;
}

export default function SectionTitle({
  title,
  description,
  align = "left",
  alignLg,
  descriptionWidth = "max-w-120",
}: SectionTitleProps) {
  const baseAlign = align === "center" ? "items-center text-center" : "items-start text-left";
  const lgAlign =
    alignLg === "center"
      ? "lg:items-center lg:text-center"
      : alignLg === "left"
        ? "lg:items-start lg:text-left"
        : "";

  return (
    <div className={`flex flex-col mb-16 gap-4 ${baseAlign} ${lgAlign}`}>
      <h2 className="text-5xl md:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tighter leading-[1.1] text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={`${descriptionWidth} font-medium text-base md:text-xl leading-normal text-[#646468] text-balance`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
