"use client";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import {
  SubscriptionIcon,
  PurchaseIcon,
  HeartIcon,
  UserIcon,
  CameraIcon,
} from "@/app/(main)/mypage/_components/Icons";
import Input from "@/components/common/Input";
import { useActionState, useState } from "react";
import { FileUploadRes } from "@/types/response";
import { uploadFiles } from "@/app/(main)/mypage/(layout)/profile/actions/profile";

export default function Profile({ token }: { token: string }) {
  const [preview, setPreview] = useState("/images/moomin.png");

  const [state, formAction, isPending] = useActionState(uploadFiles, { ok: 0, message: "" });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center pt-[75px]  ">
        <Badge variant="accent" className="">
          {"ACCOUT EDIT"}
        </Badge>
        <h1 className="pt-[14px] text-[#1A1A1C] font-['Pretendard'] text-[26px] font-black">
          회원정보 수정
        </h1>
        <p className="pt-[14px] pb-[42px] text-[#646468] font-['Pretendard'] text-[14px] font-[500]">
          서비스 이용을 위한 소중한 정보를 안전하게 관리하세요.
        </p>
        <form action={formAction} className="w-full max-w-[672px]">
          <div className=" mb-[161px] pr-[55px] pl-[57px] pt-[56px] pb-[70px] rounded-[49px] border border-black/[0.06] bg-[#FFF] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] max-lg:pl-[30px] max-lg:pr-[30px] w-full max-w-[672px]">
            <div className="flex flex-col">
              <div className="flex flex-col  items-center">
                <input type="hidden" name="accessToken" value={token} />
                <input type="hidden" name="type" value="profile" />
                <img
                  className="w-[97px] h-[97px] rounded-full ring-2 ring-white shadow-2xl"
                  src={preview}
                  alt="프로필 이미지"
                ></img>

                <div className="w-[35px] h-[35px] ml-16 -mt-8  flex justify-center items-center">
                  <label htmlFor="profileImageUpload">
                    <div className="w-[35px] h-[35px] bg-[#FBA613] rounded-full flex flex-row justify-center items-center border-2 border-[#FFFFFF] hover:cursor-pointer">
                      <CameraIcon className="text-white " />
                    </div>
                  </label>
                  <input
                    className="bg-amber-400 w-[35px] h-[35px] ml-[130px] bg-[#FBA613] flex justify-center items-center rounded-full ring-2 ring-white text-transparent hidden"
                    type="file"
                    id="profileImageUpload"
                    name="attach"
                    accept="image/*"
                    onChange={handleImageChange}
                  ></input>
                </div>

                <p className="mb-[42px] pt-[14px] text-[#909094] text-[11px] font-[700] l">
                  프로필 사진 변경
                </p>
              </div>
            </div>

            <Input
              className=" w-full mb-[22px] w-full flex grow-1 [&>label]:text-black [&>label]:font-black [&>label]:text-[12px] [&>label]:font-['Pretendard'] "
              label="이메일 주소"
              name="email"
              placeholder="hello@9Dog.co.kr"
            ></Input>
            {/* {배송 주소 입력 폼} */}
            <div className="">
              <div className="flex flex-row gap-[11px] ">
                <Input
                  name="zipcode"
                  className="max-w-[112px] [&>label]:text-black [&>label]:font-black [&>label]:text-[12px] [&>label]:font-['Pretendard'] "
                  label="배송 주소"
                  placeholder="12345"
                ></Input>

                <Button type="button" className=" mt-[28px]" size="xs" variant="primary">
                  주소 찾기
                </Button>
              </div>
              <div className="mb-[73px]">
                <Input
                  name="address"
                  label=""
                  placeholder="서울특별시 강남구 테헤란로 1234"
                ></Input>
                <Input name="detailaddress" label="" placeholder="나인독 타워 9층"></Input>
              </div>
              <div>
                {/* { 제출 버튼 } */}

                <div className=" h-[1px] bg-[rgba(0,0,0,0.06)] mx-auto mb-[28px] " />
                <div className="flex flex-row gap-[14px]">
                  <Button
                    type="submit"
                    className="flex-1"
                    size="md"
                    variant="primary"
                    disabled={isPending}
                  >
                    {isPending ? "저장 중..." : "정보 저장하기"}
                  </Button>

                  <Button type="button" className="flex-1" size="md" variant="outline">
                    취소
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
