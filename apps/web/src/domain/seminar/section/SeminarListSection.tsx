'use client';

import { useUserQuery } from '@/api/user/user';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { ProgramInfo } from '@/schema';
import { useSeminarList } from '../hooks/useSeminarList';
import { useSeminarStatusParam } from '../hooks/useSeminarStatusParam';
import SeminarClosedCard from '../ui/SeminarClosedCard';
import SeminarRecruitingCard from '../ui/SeminarRecruitingCard';
import { SeminarStatus } from '../utils/seminarStatus';
import SeminarListEmptyState from './SeminarListEmptyState';
import SeminarProgramPager from './SeminarProgramPager';
import SeminarStatusTabs from './SeminarStatusTabs';
import SuggestSeminarCta from './SuggestSeminarCta';

const ERROR_MESSAGE =
  "세미나 조회 중 오류가 발생했습니다.\n새로고침 후에도 문제가 지속되면 아래 '채팅문의'를 통해 문의해주세요.";

interface SeminarListContentProps {
  status: SeminarStatus;
  isLoading: boolean;
  isError: boolean;
  programs: ProgramInfo[];
  onGoClosed: () => void;
}

/** 세미나 리스트 본문 — 로딩/에러/빈 상태를 early return으로 가드한 뒤 카드 그리드를 렌더한다. */
const SeminarListContent = ({
  status,
  isLoading,
  isError,
  programs,
  onGoClosed,
}: SeminarListContentProps) => {
  // 앵콜 이벤트 user_id용. 로그인 시 1회 조회(캐시)해 카드에 내려준다.
  const { data: user } = useUserQuery();

  if (isLoading) return <LoadingContainer text="세미나 조회 중" />;

  if (isError) {
    return <p className="whitespace-pre-line text-center">{ERROR_MESSAGE}</p>;
  }

  if (programs.length === 0) {
    return status === 'recruiting' ? (
      <SeminarListEmptyState onGoClosed={onGoClosed} />
    ) : (
      <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 py-10 text-center">
        종료된 무료 세미나가 없어요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-11 md:gap-14">
      <SeminarProgramPager
        // 탭(모집중/종료) 전환 시 리마운트해 페이지·캐러셀 스크롤 상태를 리셋한다
        // (컴포넌트 재사용 시 이전 탭의 page/scroll 이 남아 빈 화면이 노출됨).
        key={status}
        programs={programs}
        // 모집 종료는 앵콜 요청 카드(figma 14), 모집 중은 기존 프로그램 카드.
        renderCard={
          status === 'closed'
            ? (program) => (
                <SeminarClosedCard program={program} userId={user?.userId} />
              )
            : (program) => (
                <SeminarRecruitingCard
                  program={program}
                  userId={user?.userId}
                />
              )
        }
      />
      {/* 모집 중/종료 세미나가 있어도 제안 CTA는 항상 노출(figma 4_0) */}
      <SuggestSeminarCta variant="banner" />
    </div>
  );
};

/** 모집 중 탭 전용 헤더 — 앵커(탭) 바로 아래 노출되는 eyebrow + 신청 유도 헤딩(figma). */
const RecruitingHeader = () => (
  <div className="flex flex-col items-center gap-3 text-center">
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 font-semibold">
      모집 중인 무료 라이브 세미나
    </p>
    <h2 className="text-small20 md:text-xlarge30 text-neutral-0 break-keep font-bold">
      곧 진행될{' '}
      <span className="bg-primary inline-block -rotate-2 rounded-none px-2 py-1 text-neutral-100">
        무료 세미나
      </span>
      를
      <br />
      지금 바로 신청하세요
    </h2>
  </div>
);

/** 모집 종료 탭 전용 헤더 — eyebrow + 헤딩 + VOD 아카이브 안내 서브텍스트(figma). */
const ClosedHeader = () => (
  <div className="flex flex-col items-center gap-3 text-center">
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 font-semibold">
      종료된 무료 라이브 세미나
    </p>
    <h2 className="text-small20 md:text-xlarge30 text-neutral-0 break-keep font-bold">
      <span className="text-small18 md:text-medium22">챌린지 참여자는,</span>
      <br />
      <span className="bg-primary inline-block -rotate-2 rounded-none px-2 py-1 text-neutral-100">
        놓친
      </span>{' '}
      무료 세미나를
      <br />
      언제든지 다시 볼 수 있어요
    </h2>
    <p className="text-xsmall14 md:text-xsmall16 text-neutral-45 mt-2 break-keep">
      챌린지 1개 이상 참여 시 세미나를 다시 시청할 수 있는 &apos;챌린지 참여자
      전용 VOD 아카이브&apos;를 제공해 드립니다.
    </p>
  </div>
);

/** 세미나 리스트 섹션(S4) — 모집상태 필터 탭 + LIVE 프로그램 카드 그리드. */
const SeminarListSection = () => {
  const [status, setStatus] = useSeminarStatusParam();
  const { data, isLoading, isFetching, isError } = useSeminarList(status);
  const programs = data?.programList ?? [];

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 md:gap-11">
      <SeminarStatusTabs />
      {/* 헤더는 세미나가 있을 때만. 비었을 땐 빈 상태 메시지와 중복되지 않게 숨긴다. */}
      {programs.length > 0 &&
        (status === 'recruiting' ? <RecruitingHeader /> : <ClosedHeader />)}
      <SeminarListContent
        status={status}
        isLoading={isLoading || isFetching}
        isError={isError}
        programs={programs}
        onGoClosed={() => setStatus('closed')}
      />
    </section>
  );
};

// (재배포 트리거: 병합 커밋 diff=0으로 Vercel skip-build에 걸린 배포를 다시 태우기 위한 no-op 변경)
export default SeminarListSection;
