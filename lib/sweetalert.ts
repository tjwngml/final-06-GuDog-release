import Swal from "sweetalert2";

// 사이트 디자인에 맞는 SweetAlert2 커스텀 설정
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "rounded-[1.5rem] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]",
  },
});

// 기본 Alert 커스텀
export const Alert = Swal.mixin({
  customClass: {
    popup: "rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.06)]",
    title: "text-[1.5rem] font-bold text-[#1A1A1C] mt-6",
    htmlContainer: "text-[0.938rem] text-[#646468] mt-2",
    confirmButton:
      "bg-[#FBA613] text-white px-7 py-4 rounded-xl font-bold text-sm hover:bg-[#E59200] active:bg-[#D08500] transition-colors duration-200 shadow-[0_2px_8px_rgba(251,166,19,0.24)] min-w-[120px]",
    cancelButton:
      "bg-white text-[#1A1A1C] px-7 py-4 rounded-xl font-bold text-sm border-2 border-black/10 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 min-w-[120px]",
    actions: "gap-3 mt-6",
  },
  buttonsStyling: false,
  confirmButtonText: "확인",
  cancelButtonText: "취소",
});

// Confirm 다이얼로그 (삭제, 취소 등)
export const Confirm = Swal.mixin({
  customClass: {
    popup: "rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.06)]",
    title: "text-[1.5rem] font-bold text-[#1A1A1C] mt-6",
    htmlContainer: "text-[0.938rem] text-[#646468] mt-2",
    confirmButton:
      "bg-[#FBA613] text-white px-7 py-4 rounded-xl font-bold text-sm hover:bg-[#E59200] active:bg-[#D08500] transition-colors duration-200 shadow-[0_2px_8px_rgba(251,166,19,0.24)] min-w-[120px]",
    cancelButton:
      "bg-white text-[#1A1A1C] px-7 py-4 rounded-xl font-bold text-sm border-2 border-black/10 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 min-w-[120px]",
    actions: "gap-3 mt-6",
  },
  buttonsStyling: false,
  showCancelButton: true,
  confirmButtonText: "확인",
  cancelButtonText: "취소",
  reverseButtons: true, // 취소 버튼을 왼쪽에 배치
});

// 성공 메시지 (우측 상단 토스트)
export const showSuccess = (title: string, text?: string) => {
  return Toast.fire({
    icon: "success",
    title,
    text,
  });
};

// 에러 메시지 (우측 상단 토스트)
export const showError = (title: string, text?: string) => {
  return Toast.fire({
    icon: "error",
    title,
    text,
  });
};

// 경고 메시지 (우측 상단 토스트)
export const showWarning = (title: string, text?: string) => {
  return Toast.fire({
    icon: "warning",
    title,
    text,
  });
};

// 정보 메시지 (우측 상단 토스트)
export const showInfo = (title: string, text?: string) => {
  return Toast.fire({
    icon: "info",
    title,
    text,
  });
};

// 확인 다이얼로그
export const showConfirm = (title: string, text?: string, confirmText = "확인", cancelText = "취소") => {
  return Confirm.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

// 삭제 확인 다이얼로그
export const showDeleteConfirm = (text?: string) => {
  return Confirm.fire({
    icon: "warning",
    title: "삭제하시겠습니까?",
    text: text || "이 작업은 되돌릴 수 없습니다.",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    customClass: {
      popup: "rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.06)]",
      title: "text-[1.5rem] font-bold text-[#1A1A1C] mt-6",
      htmlContainer: "text-[0.938rem] text-[#646468] mt-2",
      confirmButton:
        "bg-[#EF4444] text-white px-7 py-4 rounded-xl font-bold text-sm hover:bg-[#DC2626] active:bg-[#B91C1C] transition-colors duration-200 shadow-[0_2px_8px_rgba(239,68,68,0.24)] min-w-[120px]",
      cancelButton:
        "bg-white text-[#1A1A1C] px-7 py-4 rounded-xl font-bold text-sm border-2 border-black/10 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 min-w-[120px]",
      actions: "gap-3 mt-6",
    },
  });
};

// 로딩 표시 (우측 상단 토스트, 타이머)
export const showLoading = (title: string, text?: string, timer = 1500) => {
  return Toast.fire({
    icon: "success",
    title,
    text,
    timer,
  });
};

export default Alert;
