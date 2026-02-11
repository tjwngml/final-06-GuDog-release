"use client";

import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { signup, showError, showSuccess } from "@/lib";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "user" as "user" | "seller",
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      showError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { passwordConfirm, ...signupData } = formData;

    const result = await signup(signupData);

    if (result.ok === 1) {
      showSuccess(`${result.item.name}님, 가입을 환영합니다!`);
      router.push("/login");
    } else {
      showError(result.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="bg-bg-secondary min-h-screen py-20 px-4">
        <div className="max-w-125 mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <header className="text-center mb-12">
            <Badge variant="accent" className="mb-4" aria-hidden="true">
              JOIN US
            </Badge>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">
              새로운 가족이 되어주세요
            </h1>
            <p className="text-sm font-medium text-text-tertiary mt-2">
              아이의 건강을 위한 첫 걸음, 9독과 함께해요
            </p>
          </header>

          <main className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-card border border-border-primary">
            <form onSubmit={handleSignup} className="space-y-8">
              <Input
                label="이름"
                name="name"
                placeholder="실명을 입력해주세요"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Input
                type="email"
                label="이메일 계정"
                name="email"
                placeholder="example@9dog.co.kr"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="비밀번호"
                type="password"
                name="password"
                placeholder="영문, 숫자 조합 8자 이상"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="비밀번호 확인"
                type="password"
                name="passwordConfirm"
                placeholder="한 번 더 입력해주세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                isError={
                  formData.passwordConfirm !== "" && formData.password !== formData.passwordConfirm
                }
                errorMessage="비밀번호가 일치하지 않습니다."
                required
              />

              <Button
                variant="primary"
                type="submit"
                className="w-full py-5 text-lg rounded-[1.8rem] shadow-glow mt-6"
              >
                가입하고 시작하기
              </Button>
            </form>
          </main>

          <nav className="text-center mt-12">
            <p className="text-sm font-bold text-text-secondary">
              이미 계정이 있으신가요?
              <Link
                href="/login"
                className="ml-2 text-accent-primary font-black hover:underline underline-offset-4 transition-all"
              >
                로그인 하기
              </Link>
            </p>
          </nav>
        </div>
      </div>
    </>
  );
}
