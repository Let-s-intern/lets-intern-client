import { useProgramApplicationQuery } from '@/api/application';
import { useChallengeQuery } from '@/api/challenge';
import { useServerChallenge } from '@/context/ServerChallenge';
import useAuthStore from '@/store/useAuthStore';
import { getProgramPathname } from '@/utils/url';
import ChallengeView from '@components/ChallengeView';
import FilledButton from '@components/common/program/program-detail/button/FilledButton';
import GradientButton from '@components/common/program/program-detail/button/GradientButton';
import NotiButton from '@components/common/program/program-detail/button/NotiButton';
import { useMediaQuery } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { Duration } from 'dayjs/plugin/duration';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const isMobile = useMediaQuery('(max-width:991px)');

  const challengeFromServer = useServerChallenge();
  const { data } = useChallengeQuery({ challengeId: Number(id || '') });
  // const { data: titleData } = useGetChallengeTitle(id ?? '');

  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';
  const isNotValidJson = challenge.desc && challenge.desc.startsWith('<');

  useEffect(() => {
    if (isNotValidJson) {
      navigate(`/program/challenge/old/${id}`);
    }
  }, [challenge.desc]);

  useEffect(() => {
    if (!titleFromUrl && !isLoading) {
      window.history.replaceState(
        {},
        '',
        getProgramPathname({
          programType: 'challenge',
          title: challenge.title,
          id,
        }),
      );
    }
  }, [challenge.title, id, isLoading, titleFromUrl]);

  if (isNotValidJson) {
    return <></>;
  }

  return (
    <>
      <ChallengeView challenge={challenge} />

      {isMobile ? (
        <ApplyCTA programType="challenge" program={challenge} />
      ) : (
        <DesktopApplyCTA programType="challenge" program={challenge} />
      )}
    </>
  );
};

/* CTA는 프로그램 상세페이지에서 공동으로 사용 */
interface ApplyCTAProps {
  programType: 'live' | 'challenge';
  program: {
    title?: string | null;
    deadline: Dayjs | null;
    beginning: Dayjs | null;
  };
}

export function ApplyCTA({ programType, program }: ApplyCTAProps) {
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
    title?: string;
  }>();

  const { isLoggedIn } = useAuthStore();
  // const {
  //   query: { data: program },
  // } = useProgramQuery({ programId: Number(id), type: programType });
  const { data: application } = useProgramApplicationQuery(
    programType,
    Number(id),
  );

  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;
  const isAlreadyApplied = application?.applied ?? false;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex w-full flex-col items-center overflow-hidden bg-neutral-0/65 text-xxsmall12">
      <div className="w-full bg-neutral-0/95 py-1.5 text-center font-bold text-static-100">
        {program?.title}
      </div>
      <div className="flex w-full items-center justify-between px-5 py-4 text-neutral-80">
        {isOutOfDate ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : isAlreadyApplied ? (
          <FilledButton
            caption="이미 신청이 완료되었습니다"
            disabled={true}
            className="apply_button"
          />
        ) : (
          <>
            <div>
              <span className="mb-2 block">
                {program?.deadline?.format('M월 D일 (dd)')} 마감까지 🚀
              </span>
              <DurationSection
                disabled={isAlreadyApplied || isOutOfDate}
                deadline={program?.deadline ?? dayjs()}
              />
            </div>
            <GradientButton
              onClick={() => {
                if (!isLoggedIn) {
                  navigate(`/login?redirect=${window.location.pathname}`);
                  return;
                }
                // 결제 페이지로 이동
              }}
            >
              지금 바로 신청
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}

export function DesktopApplyCTA({ programType, program }: ApplyCTAProps) {
  const { id } = useParams<{
    id: string;
    title?: string;
  }>();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuthStore();
  // const {
  //   query: { data: program, isLoading },
  // } = useProgramQuery({ programId: Number(id), type: programType });
  const { data: application } = useProgramApplicationQuery(
    programType,
    Number(id),
  );

  const isOutOfDate =
    program?.beginning && program.deadline
      ? dayjs().isBefore(program.beginning) || dayjs().isAfter(program.deadline)
      : false;
  const isAlreadyApplied = application?.applied ?? false;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-10 mx-auto flex w-full max-w-[60rem] items-center justify-between overflow-hidden rounded-sm bg-neutral-0/65 px-5 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-bold text-neutral-100">{program?.title}</span>
        <span className="text-xxsmall12 text-neutral-80">
          {program?.deadline?.format?.('M월 D일 (dd)')} 마감까지 🚀
        </span>
      </div>
      <div className="flex min-w-80 max-w-[60rem] items-center gap-8">
        {isOutOfDate ? (
          <NotiButton text={'출시알림신청'} className="early_button" />
        ) : isAlreadyApplied ? (
          <FilledButton
            caption="이미 신청이 완료되었습니다"
            disabled={true}
            className="apply_button"
          />
        ) : (
          <>
            <DurationSection
              disabled={isAlreadyApplied || isOutOfDate}
              deadline={program?.deadline ?? dayjs()}
            />
            <GradientButton
              onClick={() => {
                if (!isLoggedIn) {
                  navigate(`/login?redirect=${window.location.pathname}`);
                  return;
                }
                // 결제 페이지로 이동
              }}
            >
              {'지금 바로 신청'}
            </GradientButton>
          </>
        )}
      </div>
    </div>
  );
}

function DurationSection({
  deadline,
  disabled = false,
}: {
  deadline: Dayjs;
  disabled?: boolean;
}) {
  const [duration, setDuration] = useState<Duration>();

  useEffect(() => {
    setDuration(dayjs.duration(deadline.diff(dayjs())));
  }, [deadline]);

  /* 마감 일자 타이머 설정 */
  useEffect(() => {
    if (disabled) return;

    const timer = setInterval(() => {
      setDuration((prev) => prev?.subtract(1, 'second') ?? prev);
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, disabled]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <DurationBox>{duration?.days() ?? '--'}일</DurationBox>
        <DurationBox>{duration?.hours() ?? '--'}시간</DurationBox>
        <DurationBox>{duration?.minutes() ?? '--'}분</DurationBox>
        <DurationBox>{duration?.seconds() ?? '--'}초</DurationBox>
      </div>
      <span className="text-xxsmall12 text-neutral-80">남음</span>
    </div>
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
