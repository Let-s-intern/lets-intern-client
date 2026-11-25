'use client';

// 성공·이미 구매·실패 화면의 확인·닫기 버튼. 창을 닫고, 닫히지 않으면 검증된 returnUrl 로 이동한다.
import { useSearchParams } from 'next/navigation';
import { closePurchaseWindow } from '../utils/purchaseWindow';
import { RETURN_URL_PARAM } from '../utils/purchasePath';

const PurchaseCloseButton = ({ label }: { label: string }) => {
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      className="rounded-md bg-primary px-6 py-3 text-center font-medium text-neutral-100"
      onClick={() => closePurchaseWindow(searchParams.get(RETURN_URL_PARAM))}
    >
      {label}
    </button>
  );
};

export default PurchaseCloseButton;
