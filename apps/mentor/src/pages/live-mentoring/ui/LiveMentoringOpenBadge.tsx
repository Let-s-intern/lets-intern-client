import { useLiveMentoringOpenStatusQuery } from '@/api/live-mentoring/liveMentoring';

/**
 * 사이드바 "1대1 라이브 멘토링" 그룹 라벨 옆에 붙는 오픈 상태 배지.
 *
 * 멘토가 오픈 설정 화면에 들어가지 않고도 지금 오픈 중인지 한눈에 알 수 있게 한다.
 * 오픈 중이 아니거나 아직 불러오는 중이면 아무것도 렌더하지 않는다 —
 * "마감" 같은 반대 상태까지 늘 띄우면 사이드바가 시끄러워지고, 정작 알아야 할
 * "지금 열려 있다"는 신호가 묻힌다.
 *
 * `상품 1 : 개설 N` 분리로 `settings.isOpen` 이 사라져, 판정 근거는 개설 이력에
 * 활성(`OPEN`) 개설이 있는지다. 쿼리는 오픈 현황·오픈 설정 화면과 **같은 쿼리 키**를
 * 써서 캐시를 공유한다(중복 요청 없음).
 *
 * 별도 모듈인 이유: `MentorSidebar` 자체는 react-query 의존이 없어 테스트에서
 * QueryClientProvider 없이 렌더된다. `NotificationBell` 과 같은 이유·같은 방식으로
 * 분리해 사이드바 테스트에서 모킹할 수 있게 한다.
 */
const LiveMentoringOpenBadge = () => {
  const { data } = useLiveMentoringOpenStatusQuery();

  if (!data?.some((opening) => opening.status === 'OPEN')) return null;

  return (
    <span className="bg-primary-10 text-primary text-xxsmall12 flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-medium">
      <span className="bg-primary h-1 w-1 rounded-full" aria-hidden="true" />
      오픈중
    </span>
  );
};

export default LiveMentoringOpenBadge;
