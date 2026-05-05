'use client';

import { DUMMY_WRITTEN_FEEDBACK_MISSIONS } from '@/domain/challenge/feedback/dummy';
import FeedbackMissionCard from '@/domain/challenge/feedback/FeedbackMissionCard';
import {
  WRITTEN_FEEDBACK_BUTTON_LABEL,
  toWrittenCardConfig,
} from '@/domain/challenge/feedback/written/utils';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

const WrittenFeedbackPage = () => {
  const router = useRouter();
  const params = useParams<{ applicationId: string; programId: string }>();

  const handleClick = useCallback(() => {
    router.push(`/challenge/${params.applicationId}/${params.programId}/me`);
  }, [params.applicationId, params.programId, router]);

  const cardList = useMemo(
    () =>
      DUMMY_WRITTEN_FEEDBACK_MISSIONS.map((mission) => (
        <FeedbackMissionCard
          key={mission.id}
          config={toWrittenCardConfig(mission)}
          buttonLabel={WRITTEN_FEEDBACK_BUTTON_LABEL[mission.status]}
          onClick={handleClick}
        />
      )),
    [handleClick],
  );

  return <div className="flex flex-col gap-y-5 pt-8">{cardList}</div>;
};

export default WrittenFeedbackPage;
