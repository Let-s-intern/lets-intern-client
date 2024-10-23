import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetLiveQuery } from '@/api/program';
import { useServerLive } from '@/context/ServerLive';
import { getProgramPathname } from '@/utils/url';
import { ProgramDetailCTA } from './ChallengeDetailSSRPage';

const LiveDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();

  const liveFromServer = useServerLive();
  const { data } = useGetLiveQuery({ liveId: Number(id || '') });

  const live = data || liveFromServer;
  const isLoading = live.title === '로딩중...';
  const isNotValidJson = live.desc && live.desc.startsWith('<');

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

      <ProgramDetailCTA programType="live" />
    </>
  );
};

export default LiveDetailSSRPage;
