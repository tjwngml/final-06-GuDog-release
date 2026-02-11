import { getCartItems } from "@/lib";
import { CartListRes, ErrorRes } from "@/types";
import { create } from "zustand";

type DeliveryCycle = "2w" | "4w";

interface CartStoreState {
  cartData: CartListRes | null;
  isLoading: boolean;
  error: ErrorRes | null;

  // 정기구독 배송 주기 상태
  deliveryCycles: Record<number, DeliveryCycle>;

  // 상태 변경 함수
  setError: (error: ErrorRes | null) => void;
  fetchCart: (accessToken: string) => Promise<void>;
  handleDeleteSuccess: (deleteId: number) => void;
  handleDeleteMultiple: (deleteIds: number[]) => void;
  updateQuantity: (cartId: number, newQuantity: number) => void;

  // 정기구독 배송 함수
  setDeliveryCycle: (cartId: number, cycle: DeliveryCycle) => void;
  getDeliveryCycle: (cartId: number) => DeliveryCycle;

  // 1회구매/정기구독 필터링 데이터
  getOnetimeItems: () => CartListRes["item"];
  getSubscriptionItems: () => CartListRes["item"];

  // 품절 여부 확인
  isSoldOut: (cartId: number) => boolean;

  // 구매된 상품 제거
  clearPurchasedItems: (purchasedIds: number[]) => void;

  // 각 탭별 총 금액 계산
  getCartTotal: (type?: "oneTime" | "subscription") => {
    productsPrice: number;
    shippingFees: number;
    totalPrice: number;
    discount: number;
    availableCount: number;
    selectCount?: number;
  };

  // 선택 상품 총 금액 계산
  getSelectCartTotal: (
    selectIds: number[],
    type?: "oneTime" | "subscription"
  ) => {
    productsPrice: number;
    shippingFees: number;
    totalPrice: number;
    discount: number;
    selectCount: number;
  };

  // 결제 예정 상품
  checkoutItems: CartListRes["item"];
  setCheckoutItems: (items: CartListRes["item"]) => void;
}

const useCartStore = create<CartStoreState>((set, get) => ({
  cartData: null,
  isLoading: false,
  error: null,
  deliveryCycles: {}, // 초기값
  checkoutItems: [],
  setCheckoutItems: (items) => set({ checkoutItems: items }),

  setError: (error) => set({ error }),

  // 장바구니 목록 불러오기
  fetchCart: async (accessToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCartItems(accessToken);
      if (data.ok === 0) {
        set({ error: data, isLoading: false });
      } else {
        const initialCycles: Record<number, DeliveryCycle> = {};
        data.item.forEach((cart) => {
          if (cart.color === "subscription") {
            initialCycles[cart._id] = (cart.size as DeliveryCycle) || "2w";
          }
        });

        set({ cartData: data, isLoading: false, deliveryCycles: initialCycles });
      }
    } catch {
      set({
        error: { ok: 0, message: "장바구니 목록을 불러오는데 실패했습니다." },
        isLoading: false,
      });
    }
  },

  // 한건 삭제
  handleDeleteSuccess: (deleteId: number) => {
    set((state) => {
      const newCycles = { ...state.deliveryCycles };
      delete newCycles[deleteId]; // 삭제된 상품의 배송 주기도 제거

      return {
        cartData: state.cartData
          ? { ...state.cartData, item: state.cartData.item.filter((i) => i._id !== deleteId) }
          : null,
        deliveryCycles: newCycles,
      };
    });
  },

  // 여러 건 삭제
  handleDeleteMultiple: (deleteIds: number[]) => {
    set((state) => {
      const newCycles = { ...state.deliveryCycles };
      deleteIds.forEach((id) => delete newCycles[id]); // 삭제된 상품들의 배송 주기도 제거

      return {
        cartData: state.cartData
          ? {
              ...state.cartData,
              item: state.cartData.item.filter((i) => !deleteIds.includes(i._id)),
            }
          : null,
        deliveryCycles: newCycles,
      };
    });
  },

  // 수량 업데이트
  updateQuantity: (cartId: number, newQuantity: number) => {
    set((state) => ({
      cartData: state.cartData
        ? {
            ...state.cartData,
            item: state.cartData.item.map((item) =>
              item._id === cartId ? { ...item, quantity: newQuantity } : item
            ),
          }
        : null,
    }));
  },

  // 배송 주기 설정
  setDeliveryCycle: (cartId: number, cycle: DeliveryCycle) => {
    set((state) => ({
      deliveryCycles: {
        ...state.deliveryCycles,
        [cartId]: cycle,
      },
      cartData: state.cartData
        ? {
            ...state.cartData,
            item: state.cartData.item.map((item) =>
              item._id === cartId ? { ...item, size: cycle } : item
            ),
          }
        : null,
    }));
  },

  // 배송 주기 가져오기
  getDeliveryCycle: (cartId: number) => {
    return get().deliveryCycles[cartId] || "2w";
  },

  // 1회구매 상품
  getOnetimeItems: () => {
    const items = get().cartData?.item || [];
    return items.filter((cart) => cart.color === "oneTime");
  },

  // 정기구독 상품
  getSubscriptionItems: () => {
    const items = get().cartData?.item || [];
    return items.filter((cart) => cart.color === "subscription");
  },

  // 품절 여부 확인
  isSoldOut: (cartId: number) => {
    const items = get().cartData?.item || [];
    const cart = items.find((item) => item._id === cartId);

    if (!cart) return false;

    return cart.product.quantity === cart.product.buyQuantity;
  },

  // 총 금액 계산(타입별 필터링)
  getCartTotal: (type?: "oneTime" | "subscription") => {
    let items = get().cartData?.item || [];

    // 타입별 필터링
    if (type === "oneTime") {
      items = items.filter((cart) => cart.color === "oneTime");
    } else if (type === "subscription") {
      items = items.filter((cart) => cart.color === "subscription");
    }

    // 구매 가능한 상품
    const availableItems = items.filter(
      (item) => item.product.quantity !== item.product.buyQuantity
    );

    // 총 상품 금액 계산
    const productsTotal = availableItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 정기구독 시 10% 할인
    const discount = type === "subscription" ? productsTotal * 0.1 : 0;

    return {
      productsPrice: productsTotal,
      shippingFees: 0,
      totalPrice: productsTotal,
      discount,
      availableCount: availableItems.length,
      selectCount: 0,
    };
  },

  // 선택 상품 총 금액 계산
  getSelectCartTotal: (selectIds: number[], type?: "oneTime" | "subscription") => {
    let items = get().cartData?.item || [];

    // 타입별 필터링
    if (type === "oneTime") {
      items = items.filter((cart) => cart.color === "oneTime");
    } else if (type === "subscription") {
      items = items.filter((cart) => cart.color === "subscription");
    }

    // 선택된 상품 필터링
    const selectItems = items.filter((item) => selectIds.includes(item._id));

    // 선택된 상품 총 구매 가능한 상품(품절 제외)
    const availableSelectItems = selectItems.filter(
      (item) => item.product.quantity !== item.product.buyQuantity
    );

    // 총 상품 금액 계산
    const productsTotal = availableSelectItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // 정기구독일 때만 10% 할인
    const discount = type === "subscription" ? productsTotal * 0.1 : 0;

    return {
      productsPrice: productsTotal,
      shippingFees: 0,
      totalPrice: productsTotal,
      discount,
      selectCount: availableSelectItems.length,
    };
  },

  // 주문 완료된 아이템을 장바구니에서 제거
  clearPurchasedItems: (purchasedIds: number[]) => {
    set((state) => {
      if (!state.cartData) return state;

      const idsToRemove = new Set(purchasedIds);

      const newCycles = { ...state.deliveryCycles };
      idsToRemove.forEach((id) => delete newCycles[Number(id)]);

      const newItems = state.cartData.item.filter((item) => {
        const shouldKeep = !idsToRemove.has(item._id);
        return shouldKeep;
      });

      return {
        cartData: {
          ...state.cartData,
          item: newItems,
        },
        deliveryCycles: newCycles,
        checkoutItems: [],
      };
    });
  },
}));

export default useCartStore;
