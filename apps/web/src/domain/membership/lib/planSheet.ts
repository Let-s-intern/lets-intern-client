// 흩어진 CTA(Hero·FinalCta·하단바·Plans)에서 결제 시트 오픈을 트리거하는 경량 채널.
// prop drilling / store 없이 커스텀 이벤트로 결제 컨트롤러(MembershipPaymentSheet)와만 연결한다.
// 멤버십은 단일 올패스 플랜이라 플랜 선택 인자가 없다(시트 안에서 어드민 priceInfo 로 선택).

const OPEN_EVENT = 'membership:open-plan-sheet';

export function openPlanSheet() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function onOpenPlanSheet(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}
