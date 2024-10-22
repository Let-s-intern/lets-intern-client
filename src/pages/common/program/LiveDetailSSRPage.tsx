import { useProgramApplicationQuery } from '@/api/application';
import { useGetLiveQuery, useProgramQuery } from '@/api/program';
import { useServerLive } from '@/context/ServerLive';
import useAuthStore from '@/store/useAuthStore';
import { getProgramPathname } from '@/utils/url';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LiveDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);

  const liveFromServer = useServerLive();
  const { isLoggedIn } = useAuthStore();
  const { data } = useGetLiveQuery({ liveId: Number(id || '') });
  const program = useProgramQuery({ programId: Number(id), type: 'live' });
  const { data: application } = useProgramApplicationQuery('live', Number(id));

  const live = data || liveFromServer;
  const isLoading = live.title === '로딩중...';
  const isNotValidJson = live.desc && live.desc.startsWith('<');
  const isAlreadyApplied = application?.applied ?? false;
  const programDate = {
    beginning: program.query.data?.beginning,
    deadline: program.query.data?.deadline,
    startDate: program.query.data?.startDate,
    endDate: program.query.data?.endDate,
  };

  useEffect(() => {
    if (isNotValidJson) navigate(`/program/live/old/${id}`);
  }, [isNotValidJson]);

  useEffect(() => {
    if (!titleFromUrl && !isLoading) {
      window.history.replaceState(
        {},
        '',
        getProgramPathname({
          programType: 'live',
          title: live.title,
          id,
        }),
      );
    }
  }, [live.title, id, isLoading, titleFromUrl]);

  if (isNotValidJson) return <></>;

  return (
    <>
      <pre>{JSON.stringify(JSON.parse(live.desc || '{}'), null, 2)}</pre>

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

export default LiveDetailSSRPage;
