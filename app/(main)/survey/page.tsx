"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import {
  recommendProducts,
  createResultUrl,
  type ExtendedSurveyFormData,
} from "@/lib/recommendProducts";
import CheckButton from "@/components/common/CheckButton";
import ChoiceButton from "@/components/common/ChoiceButton";
import InfoBox from "@/components/common/InfoBox";

// 설문조사 4단계
const TOTAL_STEPS = 4;

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExtendedSurveyFormData>({
    size: "",
    age: "",
    neutered: "",
    activityLevel: "",
    bodyType: "",
    currentFeedIssues: [],
    allergies: [],
    healthConcerns: [],
    diagnosedDiseases: [],
    protein: "",
    grainPreference: "",
    foodType: "",
  });

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      setIsSubmitting(true);

      try {
        const results = await recommendProducts(formData);

        if (!results || results.length === 0) {
          alert("조건에 맞는 제품을 찾지 못했습니다. 조건을 변경해 주세요.");
          setIsSubmitting(false);
          return;
        }

        const resultUrl = createResultUrl(results, formData);
        console.log("전체 설문 결과:", formData);
        router.push(resultUrl);
      } catch (error) {
        console.error("추천 처리 중 오류:", error);
        alert("추천 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      router.back();
    }
  };

  const updateField = (field: keyof ExtendedSurveyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (
    field: "allergies" | "healthConcerns" | "currentFeedIssues" | "diagnosedDiseases",
    value: string,
    max?: number,
  ) => {
    setFormData((prev) => {
      const current = prev[field];

      // '없음' 선택 시 다른 모든 선택 해제
      if (value === "없음") {
        return { ...prev, [field]: current.includes("없음") ? [] : ["없음"] };
      }

      // 이미 선택된 항목이면 해제
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((i) => i !== value) };
      }

      // '없음' 제거
      const filtered = current.filter((i) => i !== "없음");

      // 최대 개수 초과 시: 가장 처음 선택한 것 제거
      if (max && filtered.length >= max) {
        const [, ...rest] = filtered;
        return { ...prev, [field]: [...rest, value] };
      }

      return { ...prev, [field]: [...filtered, value] };
    });
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  // 각 단계별 유효성 검사 로직
  const isNextDisabled =
    isSubmitting ||
    (currentStep === 1 && (!formData.size || !formData.age || !formData.neutered)) ||
    (currentStep === 2 && (!formData.activityLevel || !formData.bodyType)) ||
    (currentStep === 3 &&
      (formData.allergies.length === 0 || formData.healthConcerns.length === 0)) ||
    (currentStep === 4 && (!formData.protein || !formData.grainPreference));

  const stepTitles: Record<number, string> = {
    1: "기본 정보를 알려주세요",
    2: "아이의 생활 패턴은 어떤가요?",
    3: "아이의 건강 상태는 어떤가요?",
    4: "마지막으로 선호도를 알려주세요",
  };

  return (
    <div className="bg-bg-secondary min-h-screen pb-40 pt-16">
      <div className="container-custom max-w-225">
        {/* 헤더 */}
        <div className="flex flex-col items-center text-center mb-10">
          <Badge variant="accent" className="mb-4">
            DOG NUTRITION SURVEY
          </Badge>
          <h2 className="text-4xl font-black text-text-primary tracking-tighter mb-4">
            {stepTitles[currentStep]}
          </h2>
          <p className="text-text-secondary font-medium uppercase tracking-widest text-xs">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden mb-16">
          <div
            className="h-full bg-accent-primary transition-all duration-500 ease-out shadow-glow"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="bg-white rounded-[3.5rem] p-10 md:p-16 shadow-card border border-border-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* STEP 1: 기본 정보 */}
          {currentStep === 1 && (
            <div className="space-y-16">
              <SurveySection
                number={1}
                title="우리 아이의 크기는 어떻게 되나요?"
                subtitle="체중에 맞춰 선택해주세요."
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { id: "소형견 (~7kg)", label: "소형견", desc: "약 7kg 이하" },
                    { id: "중형견 (7~25kg)", label: "중형견", desc: "7kg ~ 25kg" },
                    { id: "대형견 (25kg~)", label: "대형견", desc: "25kg 이상" },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.id}
                      selected={formData.size === item.id}
                      onClick={() => updateField("size", item.id)}
                      label={item.label}
                      desc={item.desc}
                    />
                  ))}
                </div>
              </SurveySection>

              <SurveySection number={2} title="우리 아이의 나이는 어떻게 되나요?">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { id: "puppy", label: "퍼피", desc: "생후 12개월 이하" },
                    { id: "adult", label: "성견", desc: "1세 ~ 7세" },
                    { id: "senior", label: "시니어", desc: "7세 이상" },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.id}
                      selected={formData.age === item.id}
                      onClick={() => updateField("age", item.id)}
                      label={item.label}
                      desc={item.desc}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-text-tertiary">
                  🔸 크기와 견종을 고려해 시니어 시점을 자동 반영합니다!
                </p>
              </SurveySection>

              <SurveySection number={3} title="중성화 수술을 했나요?">
                <div className="grid grid-cols-2 gap-4">
                  {["예", "아니요"].map((val) => (
                    <ChoiceButton
                      key={val}
                      selected={formData.neutered === val}
                      onClick={() => updateField("neutered", val)}
                      label={val}
                    />
                  ))}
                </div>
              </SurveySection>
            </div>
          )}

          {/* STEP 2: 생활 패턴 */}
          {currentStep === 2 && (
            <div className="space-y-16">
              <SurveySection
                number={4}
                title="활동량은 어떤 편인가요?"
                subtitle="평소 산책 시간과 놀이 수준을 고려해주세요."
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    { id: "적음", label: "적음", desc: "실내 생활 위주, 주 1회 산책" },
                    { id: "보통", label: "보통", desc: "하루 30분~1시간 걷기" },
                    { id: "많음", label: "많음", desc: "하루 1~2시간 이상 활동" },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.id}
                      selected={formData.activityLevel === item.id}
                      onClick={() => updateField("activityLevel", item.id)}
                      label={item.label}
                      desc={item.desc}
                    />
                  ))}
                </div>
              </SurveySection>

              <SurveySection number={5} title="현재 반려견의 체형은 어떤가요?">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { id: "thin", label: "마름", desc: "갈비뼈가 눈에 보임" },
                    { id: "ideal", label: "적정", desc: "갈비뼈는 만져지지만 보이지 않음" },
                    { id: "overweight", label: "과체중", desc: "갈비뼈가 안 보임" },
                    { id: "obese", label: "비만", desc: "복부 라인이 거의 보이지 않음" },
                  ].map((item) => (
                    <ChoiceButton
                      key={item.id}
                      selected={formData.bodyType === item.id}
                      onClick={() => updateField("bodyType", item.id)}
                      label={item.label}
                      desc={item.desc}
                      size="sm"
                    />
                  ))}
                </div>
              </SurveySection>
            </div>
          )}

          {/* STEP 3: 건강 상태 */}
          {currentStep === 3 && (
            <div className="space-y-16">
              <SurveySection
                number={6}
                title="알러지나 피해야 할 원재료가 있나요?"
                subtitle="복수 선택 가능"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    "없음",
                    "닭고기",
                    "소고기",
                    "양고기",
                    "생선",
                    "달걀",
                    "유제품",
                    "밀/곡물",
                    "완두콩·콩류",
                    "기타 알러지 있음 (구체적 원료 미상)",
                  ].map((val) => (
                    <CheckButton
                      key={val}
                      selected={formData.allergies.includes(val)}
                      onClick={() => toggleArrayField("allergies", val)}
                      label={val}
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm text-text-tertiary">
                  🔸 "기타 알러지 있음"을 선택하면 저자극성 사료를 우선 추천해드려요.
                </p>
              </SurveySection>

              <SurveySection
                number={7}
                title="건강 관련 고민이 있나요?"
                subtitle="복수 선택 가능, 최대 2개"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "없음",
                    "피부/모질 (가려움, 비듬, 털 빠짐)",
                    "소화/장 건강 (설사, 토, 무른 변)",
                    "관절/뼈 건강 (슬개골, 고관절)",
                    "체중 관리 (다이어트 필요)",
                  ].map((val) => (
                    <CheckButton
                      key={val}
                      selected={formData.healthConcerns.includes(val)}
                      onClick={() => toggleArrayField("healthConcerns", val, 2)}
                      label={val}
                    />
                  ))}
                </div>
              </SurveySection>
            </div>
          )}

          {/* STEP 4: 선호도 */}
          {currentStep === 4 && (
            <div className="space-y-16">
              <SurveySection number={8} title="선호하는 단백질 원재료가 있나요?">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["상관없음", "닭고기", "오리고기", "양고기", "연어", "소고기"].map((val) => (
                    <ChoiceButton
                      key={val}
                      selected={formData.protein === val}
                      onClick={() => updateField("protein", val)}
                      label={val}
                    />
                  ))}
                </div>
              </SurveySection>

              <SurveySection number={9} title="곡물(Grain) 포함 여부 선호">
                <div className="grid grid-cols-2 gap-4">
                  {["상관없음", "그레인프리(Grain Free) 선호"].map((val) => (
                    <ChoiceButton
                      key={val}
                      selected={formData.grainPreference === val}
                      onClick={() => updateField("grainPreference", val)}
                      label={val}
                    />
                  ))}
                </div>
              </SurveySection>

              <InfoBox>
                작성하신 모든 정보를 바탕으로 아이에게 가장 적합한 사료를 정확하게 추천해 드릴게요!
                <br />
                추천 결과는 아이의 생애주기, 건강 상태, 선호도를 모두 고려하여 선정됩니다.
              </InfoBox>
            </div>
          )}

          {/* 네비게이션 */}
          <div className="mt-16 pt-10 border-t border-border-primary flex items-center justify-between">
            <Button onClick={handlePrev} variant="ghost" size="lg" leftIcon disabled={isSubmitting}>
              {currentStep === 1 ? "취소하기" : "이전으로"}
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={isNextDisabled}
              rightIcon={currentStep !== TOTAL_STEPS}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  분석 중...
                </span>
              ) : currentStep === TOTAL_STEPS ? (
                "추천 결과 보기"
              ) : (
                "다음 단계로"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 서브 컴포넌트들
interface SurveySectionProps {
  number: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function SurveySection({ number, title, subtitle, children }: SurveySectionProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-center space-x-3">
        <span className="w-8 h-8 rounded-full bg-accent-soft text-accent-primary flex items-center justify-center font-black text-sm">
          {number}
        </span>
        <h4 className="text-xl font-black text-text-primary tracking-tight">
          {title}{" "}
          {subtitle && <span className="text-sm font-bold text-text-tertiary">{subtitle}</span>}
        </h4>
      </div>
      {children}
    </section>
  );
}
