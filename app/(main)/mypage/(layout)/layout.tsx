import MyTapButton from "@/app/(main)/mypage/_components/MyTapButton";
import {
  SubscriptionIcon,
  PurchaseIcon,
  HeartIcon,
  UserIcon,
  CameraIcon,
} from "@/app/(main)/mypage/_components/Icons";
import { SubscriptIcon } from "lucide-react";

export default function Mypagelayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const handleHeartClick = () => {
    console.log(" 관심상품 버튼이 클릭되었습니다 !");
  };

  return (
    <>
      {/* {프로필 } */}
      <div className="w-full bg-linear-to-l from-[#FFF9F2] to-[#FFFFFF] h-105.25 relative z-10">
        <div className="flex flex-col pt-[129px] items-center relative">
          <img
            className="w-[97px] h-[97px] rounded-full ring-4 ring-white shadow-2xl"
            src="/images/프로필.png"
            alt="프로필 이미지"
          ></img>

          <div className="flex items-baseline">
            <p className="pt-4.25 text-[31.5px] font-black">hello@9Dog.co.kr</p>
            <p className="pt-[21px] pl-2">님</p>
          </div>
          <div className="w-[336px] h-[336px] rounded-full bg-[#FBA613]/10 blur-[50px] absolute top-0 right-0"></div>
        </div>
      </div>

      {/* {회색 영역} */}
      <div className="w-full bg-[#F9F9FB] ">
        <div className="flex justify-center gap-[14px] pb-4 relative z-20 -mt-[50px] max-lg:flex max-lg:flex-wrap max-lg:ml-[20px] max-lg:mr-[20px]">
          {/* {회원 정보 수정 버튼} */}

          <MyTapButton
            content="회원 정보"
            href="/mypage/profile"
            icon={<UserIcon className="" />}
          />

          {/* {정기 구독 플랜 버튼} */}

          <MyTapButton
            content="정기 구독"
            href="/mypage/subscription"
            icon={<SubscriptIcon className="" />}
          />

          {/* {주문 내역 버튼} */}

          <MyTapButton
            content="주문 내역"
            href="/mypage/order"
            icon={<PurchaseIcon className=" " />}
          />

          {/* 관심 상품 버튼 */}

          <MyTapButton
            content="관심 상품"
            href="/mypage/wishlist"
            icon={<HeartIcon className="" />}
          />
        </div>
        {/* {개별 프롭스} */}
        {children}
      </div>
    </>
  );
}
