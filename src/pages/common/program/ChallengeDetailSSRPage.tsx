import dayjs from 'dayjs';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useProgramApplicationQuery } from '@/api/application';
import { useChallengeQuery } from '@/api/challenge';
import { useProgramQuery } from '@/api/program';
import { useServerChallenge } from '@/context/ServerChallenge';
import useAuthStore from '@/store/useAuthStore';
import { getProgramPathname } from '@/utils/url';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const { isLoggedIn } = useAuthStore();
  const { data } = useChallengeQuery({ challengeId: Number(id || '') });
  const program = useProgramQuery({ programId: Number(id), type: 'challenge' });
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(id),
  );

  const programQueryData = program.query.data;

  const [duration, setDuration] = useState(
    dayjs.duration(
      program.query.data!.deadline
        ? program.query.data!.deadline.diff(dayjs())
        : 0,
    ),
  );
  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);

  const challengeFromServer = useServerChallenge();
  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';
  const isNotValidJson = challenge.desc && challenge.desc.startsWith('<');
  const isAlreadyApplied = application?.applied ?? false;
  const programDate = {
    beginning: programQueryData?.beginning,
    deadline: programQueryData?.deadline,
    startDate: programQueryData?.startDate,
    endDate: programQueryData?.endDate,
  };

  useEffect(() => {
    if (isNotValidJson) navigate(`/program/challenge/old/${id}`);
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

  if (isNotValidJson) return <></>;

  return (
    <>
      <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>

      {/* 하단 신청하기 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex w-full max-w-[56rem] flex-col items-center bg-neutral-0/65 text-xxsmall12 shadow-04 lg:rounded-sm">
        <div className="w-full bg-neutral-0/95 py-1.5 text-center font-bold text-static-100">
          {programQueryData?.title}
        </div>
        <div className="flex w-full items-center justify-between px-5 py-4 text-neutral-80">
          <div>
            <span>
              {programDate?.deadline?.format('M월 D일 (dd)')} 마감까지 🚀
            </span>
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
            disabled={isAlreadyApplied}
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
        </div>
      </div>
    </>
  );
};

function DurationBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xxs bg-primary-10 p-1 text-xxsmall12 font-bold text-primary">
      {children}
    </div>
  );
}

export default ChallengeDetailSSRPage;
