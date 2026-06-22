// 흩어진 CTA(Hero·FinalCta·하단바·Plans 카드)에서 플랜 선택 시트를 여는 경량 채널.
// prop drilling / store 없이 커스텀 이벤트로 PlanSheet와만 연결한다.
import type { MembershipPlanKey } from '../data/membership';

const OPEN_EVENT = 'membership:open-plan-sheet';

export function openPlanSheet(plan?: MembershipPlanKey) {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { plan } }));
}

export function onOpenPlanSheet(
  handler: (plan?: MembershipPlanKey) => void,
): () => void {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<{ plan?: MembershipPlanKey }>).detail;
    handler(detail?.plan);
  };
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
