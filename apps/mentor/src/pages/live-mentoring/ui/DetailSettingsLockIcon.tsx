import { Lock } from 'lucide-react';

import { useLiveMentoringOpenStatusQuery } from '@/api/live-mentoring/liveMentoring';

/**
 * 사이드바 "상세 페이지 설정" 항목 옆에 붙는 잠금 아이콘.
 *
 * 오픈 중에는 상세 페이지를 수정할 수 없다(서버가 `APPROVED` + 활성 개설 상태에서
 * 편집을 잠근다). 메뉴만 보고는 그 사실을 알 수 없어 들어갔다가 막힌 걸 알게
 * 되므로, 진입 전에 미리 알려준다.
 *
 * 판단 기준은 `LiveMentoringOpenBadge`와 동일하게 상품 상태가 아니라
 * **활성 개설(OPEN)의 존재**다. 같은 쿼리 키를 써서 캐시를 공유한다.
 */
const DetailSettingsLockIcon = ({ active = false }: { active?: boolean }) => {
  const { data } = useLiveMentoringOpenStatusQuery();

  const hasActiveOpening = data?.some((opening) => opening.status === 'OPEN');
  if (!hasActiveOpening) return null;

  return (
    <Lock
      size={12}
      // 링크가 활성(선택된 메뉴)일 땐 텍스트와 같은 색을 따라가고, 아니면
      // 배경(흰색)에서도 알아볼 수 있는 진하기의 회색을 쓴다.
      className={`shrink-0 ${active ? 'text-primary' : 'text-neutral-50'}`}
      aria-label="오픈 중에는 수정할 수 없어요"
    />
  );
};

export default DetailSettingsLockIcon;
