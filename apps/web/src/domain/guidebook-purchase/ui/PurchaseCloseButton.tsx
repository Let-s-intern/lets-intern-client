'use client';

// 성공·이미 구매·실패 화면의 확인·닫기 버튼. 복귀 이동은 returnUrl 검증과 함께 이어서 붙인다.
const PurchaseCloseButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="rounded-md bg-primary px-6 py-3 text-center font-medium text-neutral-100"
    onClick={() => window.close()}
  >
    {label}
  </button>
);

export default PurchaseCloseButton;
