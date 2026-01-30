"use client";

import { ChangeEvent, useState } from "react";
import Image, { StaticImageData } from "next/image";
import GuDog from "@/public/images/logo.png";

type ProfileImageUploaderProps = {
  profileImageUrl: string | StaticImageData;
  onImageChange: (file: File | null) => void;
};

export default function EditImage({ profileImageUrl, onImageChange }: ProfileImageUploaderProps) {
  // 초기 상태 ( 기본 이미지 출력 )
  const [preview, setPreview] = useState(profileImageUrl || GuDog);

  // 파일 선택 /  input 이벤트 발생
  // 파일 업로드 버튼을 눌렀을 때 handleImageChange 함수 실행

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 사용자가 선택한 파일 가져오기
    if (file) {
      setPreview(URL.createObjectURL(file)); // 미리보기용 URL 생성
      onImageChange(file); // 부모 컴포넌트에 전달
    }
  };

  return (
    <>
      <Image
        src={preview}
        alt="프로필 이미지"
        className="w-[97px] h-[97px] rounded-full ring-2 ring-white shadow-2xl"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-[35px] h-[35px] -mr-15 -mt-8  bg-[#FBA613] flex justify-center items-center rounded-full ring-2 ring-white"
      />
    </>
  );
}
