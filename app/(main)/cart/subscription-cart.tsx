import SubscriptionItemList from "@/app/(main)/cart/_components/subscription-item-list";
import { deleteCartItem, deleteCartItems } from "@/app/(main)/cart/action/cart";
import useCartStore from "@/zustand/useCartStore";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import useUserStore from "@/zustand/useStore";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function SubscriptionCart() {
  // 토큰 가져오기
  const { user } = useUserStore();
  const accessToken = user?.token?.accessToken;

  // zustand 상태
  const {
    handleDeleteMultiple: deleteStoreItems,
    handleDeleteSuccess: deleteStoreItem,
    getCartTotal,
    getSubscriptionItems,
    getSelectCartTotal,
  } = useCartStore();

  // 체크박스 선택된 상품 ID
  const [selectIds, setSelectIds] = useState<number[]>([]);

  // 정기구독 상품 가져오기
  const items = getSubscriptionItems();

  // 정기구독 총액 계산
  const { productsPrice, shippingFees, totalPrice, availableCount, discount, selectCount } =
    useMemo(() => {
      if (selectIds.length > 0) {
        // 선택된 상품만 계산
        return {
          ...getSelectCartTotal(selectIds, "subscription"),
          availableCount: getCartTotal("subscription").availableCount, // 전체 개수 유지
        };
      } else {
        // 전체 상품 계산
        return {
          ...getCartTotal("subscription"),
          selectCount: 0, // 기본값 설정
        };
      }
    }, [selectIds, getSelectCartTotal, getCartTotal]);

  // 한건 삭제 핸들러
  const handleDelete = async (cartId: number) => {
    if (!confirm("삭제하시겠습니까?")) return;

    try {
      const result = await deleteCartItem(cartId, accessToken as string);

      if (result?.ok !== 0) {
        deleteStoreItem(cartId);
        setSelectIds((prev) => prev.filter((id) => id !== cartId));
      }
    } catch {
      alert("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 여러 건 삭제
  const [isDeleting, setIsDeleting] = useState(false);

  // 개별 선택/해제 핸들러
  const handleSelect = (id: number) => {
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectIds.length === items.length) {
      setSelectIds([]);
    } else {
      setSelectIds(items.map((item) => item._id));
    }
  };

  // 여러 건 삭제 핸들러
  const handleDeleteMultiple = async () => {
    if (selectIds.length === 0) {
      alert("삭제할 상품을 선택해주세요.");
      return;
    }

    // 헤더 에러 방지
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!confirm(`선택한 ${selectIds.length}개 상품을 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("cartIds", JSON.stringify(selectIds));
      formData.append("accessToken", accessToken);
      const result = await deleteCartItems(null, formData);

      if (result === null) {
        deleteStoreItems(selectIds);

        setSelectIds([]);
      } else {
        alert(result.message);
      }
    } catch {
      alert("삭제에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-9 justify-center">
      {/* 장바구니 목록 */}
      <div className="xl:w-2/3">
        {items.length > 0 ? (
          <>
            <section className="flex gap-3 items-center bg-white border border-[#F9F9FB] rounded-[0.875rem] p-3 sm:p-7 mb-5 shadow-(--shadow-card)">
              <Checkbox
                label={`전체 선택(${selectIds.length}/${items.length})`}
                checked={selectIds.length === items.length && items.length > 0}
                onChange={handleSelectAll}
                className="text-[#1A1A1C] text-[0.75rem] font-black"
              />
              <button
                onClick={handleDeleteMultiple}
                disabled={selectIds.length === 0 || isDeleting}
                className="ml-auto text-text-tertiary text-[0.625rem] font-bold"
              >
                선택 삭제
              </button>
            </section>

            {/* 상품 목록 */}
            {items.map((cart) => (
              <SubscriptionItemList
                key={cart._id}
                cart={cart}
                isSelect={selectIds.includes(cart._id)}
                onSelect={() => handleSelect(cart._id)}
                onDelete={handleDelete}
              />
            ))}
          </>
        ) : (
          <div className="border border-[#F9F9FB] rounded-[0.875rem] px-7 py-7 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
            <p className="text-[0.75rem] text-[#1A1A1C] font-bold text-center">
              구독 중인 상품이 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* 결제 상세 요약 */}
      <aside className="xl:w-1/3">
        <div className="xl:sticky xl:top-8">
          <section className="flex flex-col gap-7 bg-white border border-border-primary rounded-[0.875rem] shadow-(--shadow-card) px-9 py-9 mb-5">
            <h2 className="text-[1.125rem] text-[#1A1A1C] font-black">결제 상세 요약</h2>
            <div className="flex justify-between">
              <p className="text-[0.75rem] text-text-secondary font-bold">총 상품 금액</p>
              <p className="text-[0.75rem] text-[#1A1A1C] font-black">
                {productsPrice.toLocaleString()}원
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[0.75rem] text-text-secondary font-bold">배송비</p>
              <p className="text-[0.75rem] text-[#1A1A1C] font-black">
                +{shippingFees.toLocaleString()}원
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-[0.75rem] text-text-secondary font-bold">정기구독 할인</p>
              <p className="text-[0.75rem] text-[#1A1A1C] font-black">
                {discount.toLocaleString()}원
              </p>
            </div>

            <div className="flex justify-between border-t border-border-primary py-7">
              <h2 className="text-[1rem] text-[#1A1A1C] font-black">총 결제 예정액</h2>
              <p className="text-2xl text-[#FBA613] font-black">
                {(totalPrice - discount).toLocaleString()}원
              </p>
            </div>

            {/* 구매하기 버튼 */}
            <Button
              href="/checkout"
              disabled={selectIds.length > 0 ? selectCount === 0 : availableCount === 0}
            >
              {selectIds.length > 0
                ? selectCount > 0
                  ? `${selectCount}개 상품 구매하기`
                  : "선택한 상품 중 구매 가능한 상품이 없습니다."
                : availableCount > 0
                ? `${availableCount}개 상품 구매하기`
                : "구매 가능한 상품이 없습니다."}
            </Button>

            <div className="flex items-center justify-center gap-2">
              <Image src="/images/cart/safe.svg" alt="" width={14} height={14} />
              <p className="text-center text-[0.75rem] text-text-tertiary font-black">
                안전한 보안 결제 시스템
              </p>
            </div>
          </section>

          {/* 정기 구독 혜택 */}
          <section className="flex flex-col bg-[#FFF9F2] px-5 py-5 rounded-[0.875rem] gap-3 border border-[#FFF5E6]">
            <div className="flex items-center gap-2.5">
              <Image src="/images/cart/구독혜택.svg" alt="" width={28} height={28} />
              <h3 className="text-[0.75rem] text-[#1A1A1C] font-black">나만의 정기 구독 혜택</h3>
            </div>
            <ul className="flex flex-col gap-1.5 ml-4">
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                배송비 무료 혜택
              </li>
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                전 상품 10% 자동 상시 할인
              </li>
              <li className="text-[0.75rem] text-text-tertiary font-bold list-disc ml-2 pl-1">
                배송 주기 자유로운 변경 및 해지
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}
