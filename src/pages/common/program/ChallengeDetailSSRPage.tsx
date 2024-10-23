import dayjs from 'dayjs';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useProgramApplicationQuery } from '@/api/application';
import { useChallengeQuery } from '@/api/challenge';
import { useProgramQuery } from '@/api/program';
import { useServerChallenge } from '@/context/ServerChallenge';
import useAuthStore from '@/store/useAuthStore';
import FilledButton from '@components/common/program/program-detail/button/FilledButton';
import NotiButton from '@components/common/program/program-detail/button/NotiButton';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const { data } = useChallengeQuery({ challengeId: Number(id || '') });

  const challengeFromServer = useServerChallenge();
  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';
  const isNotValidJson = challenge.desc && challenge.desc.startsWith('<');

  useEffect(() => {
    if (isNotValidJson) navigate(`/program/challenge/old/${id}`);
  }, [challenge.desc]);

  // useEffect(() => {
  //   if (!titleFromUrl && !isLoading) {
  //     window.history.replaceState(
  //       {},
  //       '',
  //       getProgramPathname({
  //         programType: 'challenge',
  //         title: challenge.title,
  //         id,
  //       }),
  //     );
  //   }
  // }, [challenge.title, id, isLoading, titleFromUrl]);

  if (isNotValidJson) return <></>;

  return (
    <>
      <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>

      <ProgramDetailCTA programType="challenge" />
    </>
  );
};

/* 프로그램 상세페이지에서 공동으로 사용 */
interface ProgramDetailCTAProps {
  programType: 'live' | 'challenge';
}

export function ProgramDetailCTA({ programType }: ProgramDetailCTAProps) {
  const { id } = useParams<{
    id: string;
    title?: string;
  }>();

  const {
    query: { data: program },
  } = useProgramQuery({ programId: Number(id), type: programType });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex w-full flex-col items-center overflow-hidden bg-neutral-0/65 text-xxsmall12">
      <div className="w-full bg-neutral-0/95 py-1.5 text-center font-bold text-static-100">
        {program?.title}
      </div>
      <div className="flex w-full items-center justify-between px-5 py-4 text-neutral-80">
        <CTAContent programType={programType} />
      </div>
    </div>
  );
}

function CTAContent({ programType }: ProgramDetailCTAProps) {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
    title?: string;
  }>();

  const { isLoggedIn } = useAuthStore();
  const {
    query: { data: program },
  } = useProgramQuery({ programId: Number(id), type: programType });
  const { data: application } = useProgramApplicationQuery(
    programType,
    Number(id),
  );

  const [diff, setDiff] = useState(
    program?.deadline ? program?.deadline.diff(dayjs()) : 0,
  );

  const duration = dayjs.duration(diff);
  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;
  const isAlreadyApplied = application?.applied ?? false;

  /* 마감 일자 타이머 설정 */
  useEffect(() => {
    if (isOutOfDate || isAlreadyApplied) return;

    const timer = setInterval(() => {
      setDiff((prev) => prev - 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isOutOfDate)
    return <NotiButton text={'출시알림신청'} className="early_button" />;

  if (isAlreadyApplied)
    return (
      <FilledButton
        caption="이미 신청이 완료되었습니다"
        disabled={true}
        className="apply_button"
      />
    );

  return (
    <>
      <div>
        <span>{program?.deadline?.format('M월 D일 (dd)')} 마감까지 🚀</span>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <DurationBox>{duration.days()}일</DurationBox>
            <DurationBox>{duration.hours()}시간</DurationBox>
            <DurationBox>{duration.minutes()}분</DurationBox>
            <DurationBox>{duration.seconds()}초</DurationBox>
          </div>
          <span>남음</span>
        </div>
      </div>
      <button
        className="py-2.4 rounded-sm bg-slate-600 bg-gradient-to-r from-[#4B53FF] to-[#763CFF] px-5 py-3 text-xsmall14 font-semibold text-static-100"
        onClick={() => {
          if (!isLoggedIn) {
            navigate(`/login?redirect=${window.location.pathname}`);
            return;
          }
          // 결제 페이지로 이동
        }}
      >
        지금 바로 신청
      </button>
    </>
  );
}

function DurationBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xxs bg-primary-10 p-1 text-xxsmall12 font-bold text-primary">
      {children}
    </div>
  );
}

export default ChallengeDetailSSRPage;
