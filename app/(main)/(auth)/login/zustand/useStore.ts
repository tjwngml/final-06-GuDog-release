import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  _id: number;
  email: string;
  name: string;
  image?: string;
  token?: {
    accessToken: string;
    refreshToken: string;
  };
}

// 로그인한 사용자 정보를 관리하는 스토어의 상태 인터페이스
interface UserStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}

// 로그인한 사용자 정보를 관리하는 스토어를 생성
// zustand의 set함수로 store안의 데이터 변경
// StateCreator 함수로 set 함수의 타입 자동 추론
const UserStore: StateCreator<UserStoreState> = (set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  resetUser: () => set({ user: null }),
});

// 스토리지 사용 ( sessionStorage에 저장)
const useUserStore = create<UserStoreState>()(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => localStorage), // 기본은 localStorage
  }),
);

export default useUserStore;
