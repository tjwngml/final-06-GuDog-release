import { User } from "@/types";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCartItems } from "@/lib";

// 로그인한 사용자 정보를 관리하는 스토어의 상태 인터페이스
interface UserStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
  // 장바구니 카운드 관련
  cartCount: number;
  fetchCartCount: (token: string) => Promise<void>;
  incrementCart: (qty: number) => void;
  resetCart: () => void;
}

// 로그인한 사용자 정보를 관리하는 스토어를 생성
// zustand의 set함수로 store안의 데이터 변경
// StateCreator 함수로 set 함수의 타입 자동 추론
const UserStore: StateCreator<UserStoreState> = (set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  resetUser: () => set({ user: null, cartCount: 0 }),

  // 장바구니 카운트 관련
  cartCount: 0,
  fetchCartCount: async (token: string) => {
    const res = await getCartItems(token);
    if (res.ok === 1) {
      set({ cartCount: res.item.length });
    }
  },
  incrementCart: (qty: number) => set((state) => ({ cartCount: state.cartCount + qty })),
  resetCart: () => set({ cartCount: 0 }),
});

// 스토리지 사용 ( sessionStorage에 저장)
const useUserStore = create<UserStoreState>()(
  persist(UserStore, {
    name: "user",
    storage: createJSONStorage(() => localStorage), // 기본은 localStorage
  })
);

export default useUserStore;
