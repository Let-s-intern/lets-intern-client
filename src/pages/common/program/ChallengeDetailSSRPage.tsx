import { useChallengeQuery } from '@/api/challenge';
import { useServerChallenge } from '@/context/ServerChallenge';
import { getProgramPathname } from '@/utils/url';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeDetailSSRPage = () => {
  const navigate = useNavigate();
  const { id, title: titleFromUrl } = useParams<{
    id: string;
    title?: string;
  }>();
  const { data } = useChallengeQuery({ challengeId: Number(id || '') });
  const [starRating, setStarRating] = useState<number | null>(null);
  const [formValue, setFormValue] = useState<string>('');
  const [isPostedRating, setIsPostedRating] = useState<boolean>(false);
  const [isJson, setIsJson] = useState(false);

  const challengeFromServer = useServerChallenge();
  const challenge = data || challengeFromServer;
  const isLoading = challenge.title === '로딩중...';

  useEffect(() => {
    try {
      JSON.parse(challenge.desc || '{}');
      setIsJson(true);
    } catch (error) {
      setIsJson(false);
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
  }, [challenge.title, id, isLoading, titleFromUrl, isJson]);

  if (!isJson) return <></>;

  return (
    <pre>{JSON.stringify(JSON.parse(challenge.desc || '{}'), null, 2)}</pre>
  );
};

export default ChallengeDetailSSRPage;
