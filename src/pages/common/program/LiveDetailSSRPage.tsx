import { useGetLiveQuery } from '@/api/program';
import { useServerLive } from '@/context/ServerLive';
import { getProgramPathname } from '@/utils/url';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const LiveDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const { data } = useGetLiveQuery({ liveId: Number(id || '') });
  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);

  const liveFromServer = useServerLive();
  const live = data || liveFromServer;
  const isLoading = live.title === '로딩중...';
  const isNotValidJson = live.desc && live.desc.startsWith('<');

  useEffect(() => {
    if (isNotValidJson) navigate(`/program/live/old/${id}`);
  }, [live.desc]);

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

  return <pre>{JSON.stringify(JSON.parse(live.desc || '{}'), null, 2)}</pre>;
};

export default LiveDetailSSRPage;
