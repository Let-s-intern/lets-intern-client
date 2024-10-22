import { useProgramApplicationQuery } from '@/api/application';
import { useChallengeQuery } from '@/api/challenge';
import { useProgramQuery } from '@/api/program';
import { useServerChallenge } from '@/context/ServerChallenge';
import useAuthStore from '@/store/useAuthStore';
import { getProgramPathname } from '@/utils/url';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);

  const { isLoggedIn } = useAuthStore();
  const { data } = useChallengeQuery({ challengeId: Number(id || '') });
  const program = useProgramQuery({ programId: Number(id), type: 'challenge' });
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(id),
  );

  const challengeFromServer = useServerChallenge();
  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';
  const isNotValidJson = challenge.desc && challenge.desc.startsWith('<');
  const isAlreadyApplied = application?.applied ?? false;
  const programDate = {
    beginning: program.query.data?.beginning,
    deadline: program.query.data?.deadline,
    startDate: program.query.data?.startDate,
    endDate: program.query.data?.endDate,
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
      <div className="fixed bottom-4 left-0 right-0 z-10 mx-auto flex max-w-[56rem] items-center justify-between rounded-sm bg-white p-4 shadow-04">
        <div>
          <span>
            {programDate?.deadline?.format('M월 D일 (dd) A h시')}까지 모집
          </span>
          <div>
            <span>모집 마감</span>{' '}
            <span>
              {programDate?.deadline
                ? dayjs
                    .duration(programDate.deadline.diff(dayjs()))
                    .format('DD:HH:mm:ss')
                : '00:00:00:00'}
            </span>
          </div>
        </div>
        <button
          className="w-2/6 rounded-full bg-slate-600 py-3 text-static-100"
          disabled={isAlreadyApplied}
          onClick={() => {
            if (!isLoggedIn) {
              navigate(`/login?redirect=${window.location.pathname}`);
              return;
            }
            // 결제 페이지로 이동
          }}
        >
          {isAlreadyApplied ? '신청완료' : '신청하기'}
        </button>
      </div>
    </>
  );
};

export default ChallengeDetailSSRPage;
