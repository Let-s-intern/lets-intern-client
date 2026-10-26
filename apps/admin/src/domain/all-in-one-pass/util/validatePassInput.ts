import { PassFormInput } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';

/**
 * 생성/수정 저장 전 유효성 검증. 문제가 있으면 안내 문구를, 없으면 null 반환
 * 첫 번째로 걸린 항목 하나만 노티 (스낵바 한 줄 노출용)
 * 권장 처리: 권한 0개 플랜 차단 · 연장 가격 0원 허용(음수만 차단)
 */
export const validatePassInput = (input: PassFormInput): string | null => {
  const { purchaseStartDate, purchaseEndDate } = input;
  if (
    purchaseStartDate &&
    purchaseEndDate &&
    dayjs(purchaseEndDate).isBefore(dayjs(purchaseStartDate))
  ) {
    return '구매 가능 기간의 종료일이 시작일보다 빠릅니다.';
  }

  if (input.passDays == null || input.passDays <= 0) {
    return '패스 기간은 1일 이상으로 입력해주세요.';
  }

  if (input.plans.length === 0) {
    return '플랜을 1개 이상 추가해주세요.';
  }
  if (input.plans.some((plan) => plan.permissions.length === 0)) {
    return '권한이 없는 플랜이 있습니다. 플랜마다 권한을 1개 이상 선택해주세요.';
  }

  for (const option of input.extensionOptions) {
    if (option.days == null || option.days <= 0) {
      return '연장 옵션의 일수는 1일 이상으로 입력해주세요.';
    }
    if (option.price == null || option.price < 0) {
      return '연장 옵션의 가격은 0원 이상으로 입력해주세요.';
    }
  }

  return null;
};
