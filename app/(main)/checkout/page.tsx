"use client";

import * as PortOne from "@portone/browser-sdk/v2";
import { createOrder, OrderRequestProduct } from "@/actions/checkout";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import Input from "@/components/common/Input";
import ProductImage from "@/components/common/ProductImage";
import useCartStore from "@/zustand/useCartStore";
import useUserStore from "@/zustand/useStore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { deleteCartItems } from "@/actions/cart";
import { showWarning, showSuccess, showError } from "@/lib";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkoutItems, getSelectCartTotal, clearPurchasedItems, fetchCart } = useCartStore();
  const [isSearching, setIsSearching] = useState(false);

  // 토큰 가져오기
  const { user } = useUserStore();
  const accessToken = user?.token?.accessToken;

  // 체크박스 상태 관리 (주문동의, 정기결제동의, 제3자제공동의)
  const [checkedList, setCheckedList] = useState({
    order: false,
    autoPay: false,
    thirdParty: false,
  });

  // 배송 정보 상태
  const [shippingInfo, setShippingInfo] = useState({
    recipient: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    request: "",
  });

  // 단건 구매(쿼리 파라미터)
  const productId = searchParams.get("product_id");

  // 다음 주소 검색 스크립트
  useEffect(() => {
    if (document.getElementById("daum-postcode-script")) return;

    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const target = document.getElementById("daum-postcode-script");
      if (target) document.body.removeChild(target);
    };
  }, []);

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    if (isSearching) return;

    if (!window.daum) {
      showWarning("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSearching(true);

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

        setShippingInfo((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: roadAddr + extraRoadAddr,
        }));

        setIsSearching(false);

        // 상세주소 입력으로 포커스 이동
        const detailInput = document.querySelector<HTMLInputElement>(
          'input[placeholder="상세 주소를 입력해주세요"]'
        );
        detailInput?.focus();
      },
      onclose: () => {
        setIsSearching(false);
      },
    }).open();
  };

  // 결제 상품 리스트
  const finalCheckoutItems = useMemo(() => {
    // 쿼리 파라미터에 상품 id가 있으면 바로 구매
    if (productId) {
      return [
        {
          _id: Number(productId),
          product: {
            _id: Number(productId),
            name: searchParams.get("name") || "",
            price: Number(searchParams.get("price") || 0),
            image: { path: searchParams.get("image") || "" },
            quantity: 999, // 임시
            buyQuantity: 0,
          },
          quantity: Number(searchParams.get("quantity") || 1),
          color: searchParams.get("type") === "subscription" ? "subscription" : "oneTime",
          size: searchParams.get("cycle") || "", // 배송 주기
        },
      ];
    }
    // 쿼리가 없으면 장바구니 zustand 스토어 아이템 사용
    return checkoutItems;
  }, [productId, searchParams, checkoutItems]);

  const firstItem = finalCheckoutItems[0];
  const isSubscribe = firstItem?.color === "subscription";
  const cycleLabel = firstItem?.size === "2w" ? "격주 배송" : "매월 배송";
  const displayProductName = firstItem
    ? finalCheckoutItems.length > 1
      ? `${firstItem.product.name} 외 ${finalCheckoutItems.length - 1}건`
      : firstItem.product.name
    : "주문 상품 없음";

  // 모든 상품의 수량 합계
  const totalQuantity = useMemo(() => {
    return finalCheckoutItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [finalCheckoutItems]);

  // 결제하기 버튼 활성화 조건 계산
  const isAllChecked = useMemo(() => {
    if (isSubscribe) {
      // 정기구독: 3개 모두 체크 필요
      return checkedList.order && checkedList.autoPay && checkedList.thirdParty;
    }
    // 일반구매: 주문동의와 제3자제공동의 2개 체크 필요
    return checkedList.order && checkedList.thirdParty;
  }, [isSubscribe, checkedList]);

  // 금액 계산
  const { productsPrice, shippingFees, discount, totalPrice } = useMemo(() => {
    if (!finalCheckoutItems.length) {
      return { productsPrice: 0, shippingFees: 0, discount: 0, totalPrice: 0 };
    }

    // 바로 구매인 경우 직접 계산
    if (productId) {
      const item = finalCheckoutItems[0];
      const price = item.product.price * item.quantity;
      const disc = isSubscribe ? price * 0.1 : 0;

      return {
        productsPrice: price,
        shippingFees: 0,
        discount: disc,
        totalPrice: price,
      };
    }

    // 장바구니 구매인 경우
    const selectIds = finalCheckoutItems.map((item) => item._id);
    const type = isSubscribe ? "subscription" : "oneTime";
    return getSelectCartTotal(selectIds, type);
  }, [productId, finalCheckoutItems, isSubscribe, getSelectCartTotal]);

  const finalAmount = totalPrice - discount;

  // 결제 요청 핸들러
  const handlePayment = async () => {
    if (!accessToken) {
      showWarning("로그인이 필요합니다.");
      return;
    }

    try {
      // 포트원 결제창 호출
      const response = await PortOne.requestPayment({
        storeId: "store-02600244-0316-4a81-b1aa-b0ebce842ce4",
        channelKey: "channel-key-25183f67-0b75-4ddc-b57d-16e66e74d008",
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: isSubscribe ? `${displayProductName} (정기구독)` : displayProductName,
        totalAmount: finalAmount, // 우리가 계산한 최종 금액 연결
        currency: "KRW",
        payMethod: "CARD",
      });

      // 결제 결과 확인
      if (!response || response.code !== undefined) {
        //결제 취소, 오류 발생 시
        return;
      }

      // 결제 성공 시 주문 생성 api 호출
      await createServerOrder(accessToken);
    } catch (err) {
      console.error("결제 오류", err);
      showError("결제 중 오류가 발생했습니다.");
    }
  };

  // 주문 생성 및 장바구니 정리
  const createServerOrder = async (token: string) => {
    const individualOrders: OrderRequestProduct[] = finalCheckoutItems.map((item) => {
      const colorValue = item.color === "subscription" ? "subscription" : "oneTime";
      const sizeValue = colorValue === "subscription" ? item.size || "2w" : "";

      return {
        _id: item.product._id,
        quantity: item.quantity,
        size: sizeValue,
        color: colorValue,
      };
    });

    const results = await Promise.all(
      individualOrders.map((orderItem) => createOrder([orderItem], token))
    );

    const allSuccess = results.every((res) => res.ok === 1);

    if (allSuccess) {
      showSuccess("주문이 완료되었습니다.");
      router.push("/mypage/order");

      // 장바구니 정리
      if (!productId && finalCheckoutItems.length > 0) {
        const purchasedIds = finalCheckoutItems.map((item) => item._id);

        (async () => {
          try {
            // 서버에서 삭제
            const formData = new FormData();
            formData.append("cartIds", JSON.stringify(purchasedIds));
            formData.append("accessToken", token);

            const deleteResult = await deleteCartItems(null, formData);

            if (deleteResult === null) {
            }

            // Zustand 업데이트
            clearPurchasedItems(purchasedIds);

            // 최신 데이터 가져오기
            await fetchCart(token);
          } catch (error) {
            console.error("백그라운드 정리 실패:", error);
          }
        })();
      }
    } else {
      showError("주문 데이터 처리에 실패했습니다.");
    }
  };

  if (finalCheckoutItems.length === 0) {
    return (
      <main className="flex flex-col items-center py-40 gap-4" role="alert">
        <p className="text-text-secondary font-bold">결제할 상품 정보가 없습니다.</p>
        <Button variant="outline" onClick={() => router.push("/cart")}>
          장바구니로 돌아가기
        </Button>
      </main>
    );
  }

  return (
    <div className="bg-(--color-bg-secondary)">
      <main className="xl:max-w-300 min-w-90 mx-auto px-4 pt-8 pb-[8.75em]">
        {/* 헤더 */}
        <section aria-labelledby="checkout-heading" className="text-center mb-16 mt-10">
          <Badge variant="accent" className="mb-3.5" aria-hidden="true">
            CHECKOUT
          </Badge>
          <h1 id="checkout-heading" className="text-[2rem] font-black">
            주문/결제
          </h1>
        </section>
        <div className="flex flex-col xl:flex-row gap-10">
          <div className="flex flex-col gap-9 xl:w-2/3">
            {/* 주문 상품 정보 */}
            <section aria-labelledby="order-product-info">
              <div className="border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                <h2
                  id="order-product-info"
                  className="text-lg text-(--color-text-primary) font-black mb-7"
                >
                  주문 상품 정보
                </h2>
                <div className="flex gap-2 sm:gap-5">
                  <div className="w-20 h-20 sm:w-17 shrink-0">
                    <ProductImage
                      src={firstItem.product.image?.path}
                      alt={firstItem.product.name}
                      className="w-full h-full rounded-[0.875rem] object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 sm:gap-1 mt-2.5">
                    <p className="text-[1rem] text-(--color-text-primary) font-black">
                      {displayProductName}
                      {/* 정기구독일 때 텍스트 추가 */}
                      {isSubscribe && (
                        <span className="text-sm text-accent-primary ml-1">(정기구독)</span>
                      )}
                    </p>
                    <p className="text-xs text-(--color-text-tertiary) font-bold">
                      {isSubscribe
                        ? `정기배송 (${cycleLabel}) | 구매 총 수량 ${totalQuantity}개`
                        : `구매 총 수량 ${totalQuantity}개`}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 배송 정보 */}
            <section aria-labelledby="shipping-info">
              <div className="border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                <h2
                  id="shipping-info"
                  className="text-lg text-(--color-text-primary) font-black mb-7"
                >
                  배송 정보
                </h2>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-5">
                    <Input
                      label="수령인"
                      placeholder=""
                      className="w-full"
                      value={shippingInfo.recipient}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({ ...prev, recipient: e.target.value }))
                      }
                    />
                    <Input
                      label="연락처"
                      placeholder=""
                      className="w-full"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex gap-2.5 items-end">
                      <Input
                        label="배송지 주소"
                        placeholder="우편번호"
                        value={shippingInfo.zipcode}
                        readOnly
                        className="w-32"
                      />
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddressSearch}
                        disabled={isSearching}
                        aria-label="우편번호 검색"
                      >
                        주소 찾기
                      </Button>
                    </div>
                    <Input
                      label=""
                      placeholder="기본 주소"
                      value={shippingInfo.address}
                      readOnly
                      className="mb-2"
                    />
                    <Input
                      label=""
                      placeholder="상세 주소를 입력해주세요"
                      value={shippingInfo.detailAddress}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({ ...prev, detailAddress: e.target.value }))
                      }
                    />
                  </div>
                  <Input
                    label="배송 요청사항"
                    placeholder=""
                    value={shippingInfo.request}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({ ...prev, request: e.target.value }))
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          {/* 최종 결제 금액 */}
          <div className="xl:w-1/3">
            <div className="xl:sticy xl:top-8">
              <section aria-labelledby="payment-summary">
                <div className="flex flex-col gap-7 border border-[#F9F9FB] rounded-[0.875rem] px-3 py-3 sm:px-7 sm:py-7 bg-white shadow-(--shadow-card)">
                  <h2
                    id="payment-summary"
                    className="text-lg text-(--color-text-primary) font-black"
                  >
                    최종 결제 금액
                  </h2>
                  <div className="flex flex-col gap-3.5">
                    <div className="flex justify-between">
                      <p className="text-xs text-(--color-text-secondary) font-bold">
                        총 상품 금액
                      </p>
                      <p className="text-xs text-(--color-text-primary) font-bold">
                        {productsPrice.toLocaleString()}원
                      </p>
                    </div>
                    {isSubscribe && (
                      <div className="flex justify-between">
                        <p className="text-xs text-(--color-text-secondary) font-bold">
                          정기 구독 할인
                        </p>
                        <p className="text-xs text-(--color-accent-primary) font-bold">
                          -{discount.toLocaleString()}원
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p className="text-xs text-(--color-text-secondary) font-bold">배송비</p>
                      <p className="text-xs text-(--color-text-primary) font-bold">
                        {shippingFees.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-text-tertiary pt-7">
                    <p className="text-[1rem] text-(--color-text-primary) font-black">
                      최종 결제액
                    </p>
                    <p className="text-[1.625rem] text-(--color-accent-primary) font-black">
                      {finalAmount.toLocaleString()}원
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5 py-1.5" role="group">
                    <li>
                      <Checkbox
                        label="(필수) 주문 정보를 확인하였으며 결제에 동의합니다."
                        size="sm"
                        checked={checkedList.order}
                        onChange={() => setCheckedList((prev) => ({ ...prev, order: !prev.order }))}
                      />
                    </li>
                    {isSubscribe && (
                      <li>
                        <Checkbox
                          label="(필수) 매월 자동 정기 결제에 동의합니다."
                          size="sm"
                          checked={checkedList.autoPay}
                          onChange={() =>
                            setCheckedList((prev) => ({ ...prev, autoPay: !prev.autoPay }))
                          }
                        />
                      </li>
                    )}
                    <li>
                      <Checkbox
                        label="(필수) 개인정보 제 3자 제공에 동의합니다."
                        size="sm"
                        checked={checkedList.thirdParty}
                        onChange={() =>
                          setCheckedList((prev) => ({ ...prev, thirdParty: !prev.thirdParty }))
                        }
                      />
                    </li>
                  </ul>
                  <Button
                    disabled={!isAllChecked}
                    onClick={handlePayment}
                    aria-label={`${finalAmount.toLocaleString()}원 결제하기`}
                  >
                    {finalAmount.toLocaleString()}원 결제하기
                  </Button>
                  <Button
                    href="/cart"
                    variant="outline"
                    className="w-full border-none text-xs text-text-secondary font-black hover:bg-transparent hover:underline shadow-none"
                  >
                    장바구니로 돌아가기
                  </Button>
                </div>
                <p className="flex justify-center gap-2.5 text-[0.625rem] text-(--color-text-primary) font-black) mt-7">
                  <Image src="/images/checkout/safe2.svg" alt="보안 결제" width={18} height={18} />
                  TSL 1.3 암호화 보안 결제 시스템
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-text-tertiary">로딩 중...</p>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
