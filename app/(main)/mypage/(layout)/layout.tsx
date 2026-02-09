import { cookies } from "next/headers";
import { getUser } from "@/lib/user";
import MyTapButton from "@/app/(main)/mypage/_components/MyTapButton";
import {
  SubscriptionIcon,
  PurchaseIcon,
  HeartIcon,
  UserIcon,
} from "@/app/(main)/mypage/_components/Icons";
import { SubscriptIcon } from "lucide-react";

export default async function Mypagelayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  let user = null;

  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const payload = JSON.parse(decodedPayload);
      const userId = payload._id || payload.id;

      const res = await getUser(userId);
      user = "item" in res ? res.item : null;
    } catch (error) {
      console.error("Layout 데이터 페치 에러:", error);
    }
  }

  const profileImage = user?.image
    ? user.image.startsWith("http")
      ? user.image
      : `${API_URL}${user.image}`
    : "/images/userImage.jpg";

  return (
    <>
      {/* 프로필 영역 */}
      <div className="w-full bg-linear-to-l from-[#FFF9F2] to-[#FFFFFF] h-105.25 relative z-10">
        <div className="flex flex-col pt-[129px] items-center relative">
          <img
            className="w-[97px] h-[97px] rounded-full ring-4 ring-white shadow-2xl object-cover"
            src={profileImage}
            alt="프로필 이미지"
          />

          <div className="flex items-baseline">
            {/* 유저 이메일 출력 */}
            <p className="pt-4.25 text-[31.5px] font-black">{user?.email || "로그인 정보 없음"}</p>
            <p className="pt-[21px] pl-2">님</p>
          </div>
          <div className="w-[336px] h-[336px] rounded-full bg-[#FBA613]/10 blur-[50px] absolute top-0 right-0"></div>
        </div>
      </div>

      {/* 회색 영역 (탭 버튼) */}
      <div className="w-full bg-[#F9F9FB]">
        <div className="flex justify-center gap-[14px] pb-4 relative z-20 -mt-[50px] max-lg:flex max-lg:flex-wrap max-lg:ml-[20px] max-lg:mr-[20px]">
          <MyTapButton
            content="회원 정보"
            href="/mypage/profile"
            icon={<UserIcon className="" />}
          />
          <MyTapButton
            content="정기 구독"
            href="/mypage/subscription"
            icon={<SubscriptIcon className="" />}
          />
          <MyTapButton
            content="주문 내역"
            href="/mypage/order"
            icon={<PurchaseIcon className=" " />}
          />
          <MyTapButton
            content="관심 상품"
            href="/mypage/wishlist"
            icon={<HeartIcon className="" />}
          />
        </div>
        {/* 개별 페이지 컨텐츠 */}
        {children}
      </div>
    </>
  );
}
