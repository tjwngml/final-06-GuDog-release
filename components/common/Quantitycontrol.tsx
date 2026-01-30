import { useState } from "react";
import Image from "next/image";

interface QuantityControlProps {
  initialCount?: number;
  minCount?: number;
  maxCount?: number;
  onChange?: (newCount: number) => void; // 개수 변경시 부모에게 전달
  className?: string;
}

export default function QuantityControl({
  initialCount = 1,
  minCount = 1,
  maxCount = 100,
  onChange,
  className = "",
}: QuantityControlProps) {
  const [count, setCount] = useState(initialCount);

  const handleCountDown = () => {
    if (count > minCount) {
      const newCount = count - 1;
      setCount(newCount);

      if (onChange) {
        onChange(newCount);
      }
    }
  };

  const handleCountUp = () => {
    if (count < maxCount) {
      const newCount = count + 1;
      setCount(newCount);

      if (onChange) {
        onChange(newCount);
      }
    }
  };

  return (
    <div
      className={`flex items-center border rounded-[0.875rem] w-fit bg-[#F9F9FB] border-border-primary ${className}`}
    >
      {/* 감소 버튼 */}
      <button
        onClick={handleCountDown}
        disabled={count <= minCount}
        className="flex px-0.5 sm:px-1 sm:py-1 justify-center items-center hover:bg-gray-200 transition-colors rounded-l-[0.875rem] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Image src="/images/cart/-.svg" alt="감소" width={28} height={28} />
      </button>

      {/* 개수 표시 */}
      <p className="w-8 sm:w-9 text-center text-xs sm:text-sm font-semibold">{count}</p>

      {/* 증가 버튼 */}
      <button
        onClick={handleCountUp}
        disabled={count >= maxCount}
        className="flex justify-center items-center px-0.5 sm:px-1 sm:py-1 hover:bg-gray-200 transition-colors rounded-r-[0.875rem] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Image src="/images/cart/+.svg" alt="증가" width={28} height={28} />
      </button>
    </div>
  );
}
