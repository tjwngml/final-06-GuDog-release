import useUserStore from "@/zustand/useStore";
import Image from "next/image";

export default function Profile() {
  const image = useUserStore((state) => state.user?.image);

  return (
    <div className="hidden sm:flex items-center">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
        {image && (
          <Image
            src={image}
            alt="프로필"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
