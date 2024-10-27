import { useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetLiveQuery, useGetLiveTitle } from '@/api/program';
import { useServerLive } from '@/context/ServerLive';
import { getProgramPathname } from '@/utils/url';
import Header from '@components/common/program/program-detail/header/Header';
import { ApplyCTA, DesktopApplyCTA } from './ChallengeDetailSSRPage';

const LiveDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const isMobile = useMediaQuery('(max-width:991px)');

  const liveFromServer = useServerLive();
  const { data } = useGetLiveQuery({ liveId: Number(id || '') });
  const { data: titleData } = useGetLiveTitle(id ?? '');

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
      <div className="px-5 lg:px-10 xl:px-52">
        <Header programTitle={titleData?.title ?? ''} />
      </div>

      {isMobile ? (
        <ApplyCTA programType="live" program={live} />
      ) : (
        <DesktopApplyCTA programType="live" program={live} />
      )}
    </>
  );
};

export default LiveDetailSSRPage;
