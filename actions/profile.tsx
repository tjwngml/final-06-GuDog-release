"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { CameraIcon } from "@/app/(main)/mypage/_components/Icons";
import { updateUser, showError, showSuccess } from "@/lib";
import { uploadFile } from "@/app/(main)/mypage/(no-layout)/order/[orderid]/review/PostReview";
import { UserInfoRes } from "@/types";
import Image from "next/image";

export default function ProfileClient({
  token,
  user,
}: {
  token: string;
  user: UserInfoRes["item"];
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState(user?.image || "");

  const [addressInfo, setAddressInfo] = useState({
    zipcode: user.extra?.zipcode || "",
    address: user.address || "",
    detailAddress: user.extra?.detailaddress || "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const handleAddressSearch = () => {
    if (!window.daum) return;

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        const roadAddr = data.roadAddress;

        let extraRoadAddr = "";

        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname;
        }

        if (data.buildingName !== "" && data.apartment === "Y") {
          extraRoadAddr += extraRoadAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
        }

        if (extraRoadAddr !== "") {
          extraRoadAddr = ` (${extraRoadAddr})`;
        }

        setAddressInfo((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: roadAddr + extraRoadAddr,
        }));
      },
    }).open();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("attach", file);

    try {
      setIsPending(true);
      const fileData = await uploadFile(formData);
      const serverPath = fileData.item?.[0]?.path || fileData.path || fileData.name;
      setPreview(serverPath);
    } catch (error) {
      showError("이미지 업로드에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const updateData = {
      image: preview,
      address: addressInfo.address,
      extra: {
        ...user.extra,
        zipcode: addressInfo.zipcode,
        detailaddress: addressInfo.detailAddress,
      },
    };

    try {
      const result = await updateUser(user._id, updateData);
      if (result.ok) {
        showSuccess("회원 정보가 수정되었습니다.");
      } else {
        showError("수정에 실패했습니다.");
      }
    } catch (error) {
      showError("오류가 발생했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="flex flex-col items-center pt-[75px]">
      <Badge variant="accent" aria-hidden="true">
        {"ACCOUNT EDIT"}
      </Badge>
      <h1 className="pt-[14px] text-[#1A1A1C] font-['Pretendard'] text-[26px] font-black">
        회원정보 수정
      </h1>

      <form
        className="w-full max-w-[672px] mt-10"
        onSubmit={handleSubmit}
        aria-label="회원정보 수정 폼"
      >
        <div className="mb-[161px] pr-[55px] pl-[57px] pt-[56px] pb-[70px] rounded-[49px] border border-black/[0.06] bg-[#FFF] shadow-sm">
          <div className="flex flex-col items-center mb-10">
            <div className="relative">
              <Image
                width={97}
                height={97}
                className="w-[97px] h-[97px] rounded-full object-cover  ring-2 ring-gray-100"
                src={
                  preview
                    ? preview.startsWith("http")
                      ? preview
                      : `${API_URL}${preview}`
                    : "/images/userImage.jpg"
                }
                alt="프로필 이미지"
              />
              <label
                htmlFor="profileImageUpload"
                className="absolute bottom-0 right-0 w-[30px] h-[30px] bg-[#FBA613] rounded-full flex justify-center items-center cursor-pointer border-2 border-white"
                aria-label="프로필 이미지 변경"
              >
                <CameraIcon className="text-white w-4 h-4" aria-hidden="true" />
              </label>
              <input
                type="file"
                id="profileImageUpload"
                className="hidden"
                onChange={handleImageChange}
                accept="image/*"
                aria-label="프로필 이미지 업로드"
              />
            </div>
          </div>

          <Input label="이메일 주소" value={user.email} readOnly className="mb-6 opacity-60" />

          <div className="flex flex-row gap-2 items-end mb-4">
            <Input
              label="배송 주소"
              placeholder="우편번호"
              value={addressInfo.zipcode}
              readOnly
              className="w-32"
            />
            <Button type="button" variant="primary" size="md" onClick={handleAddressSearch}>
              주소 찾기
            </Button>
          </div>

          <Input
            label=""
            placeholder="기본 주소"
            value={addressInfo.address}
            readOnly
            className="mb-2"
          />

          <Input
            label=""
            placeholder="상세 주소를 입력하세요"
            value={addressInfo.detailAddress}
            onChange={(e) => setAddressInfo((prev) => ({ ...prev, detailAddress: e.target.value }))}
            className="mb-10"
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isPending}
              aria-label={isPending ? "정보 저장 중" : "정보 저장하기"}
            >
              {isPending ? "저장 중..." : "정보 저장하기"}
            </Button>
            {/* <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
              aria-label="취소하고 이전 페이지로 돌아가기"
            >
              취소
            </Button> */}
          </div>
        </div>
      </form>
    </main>
  );
}
