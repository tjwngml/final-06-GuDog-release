interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div
      className={`
        bg-linear-to-r
        from-gray-200 via-gray-100 to-gray-200
        bg-size-[200%_100%]
        animate-shimmer
        rounded
        ${className}
      `}
    />
  );
};

export default Skeleton;
