"use client";

import { useState } from "react";
import EditImage from "@/app/(main)/mypage/_components/EditProfile/EditProfle";

export default function ProfilePage() {
  return (
    <div className="p-10">
      <EditImage profileImageUrl={"/public/images/angrymoomin.jpg"} onImageChange={() => {}} />

      <button className="mt-4 p-2 bg-blue-500 text-white rounded">변경사항 저장</button>
    </div>
  );
}
