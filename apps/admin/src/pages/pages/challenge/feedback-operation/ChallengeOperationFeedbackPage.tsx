import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  isLegacyChallenge,
  MentorMissionFeedbackAttendanceQueryKey,
  MentorMenteeAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import MentorMenteeAssignment from '../mentor-assignment/MentorMenteeAssignment';
import FeedbackMissionList from './ui/FeedbackMissionList';
import type { SubTab } from './types';

function ChallengeOperationFeedbackPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('feedbackManage');
  const queryClient = useQueryClient();
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  // 230 미만 챌린지는 멘토 배정 모델이 attendance 단위라 이 화면의 멘토/멘티 배정
  // 흐름과 호환되지 않는다. 탭 자체를 숨겨 잘못 진입하지 않게 한다.
  const isLegacy = isLegacyChallenge(programId ?? Number.MAX_SAFE_INTEGER);
  const showMentorMenteeTab = isAdmin === true && !isLegacy;

  const handleTabChange = useCallback(
    (tab: SubTab) => {
      // 멘토 배정 탭에서 다른 탭으로 전환 시 관련 쿼리 무효화
      if (activeTab === 'mentorMentee' && tab !== 'mentorMentee') {
        queryClient.invalidateQueries({
          queryKey: ['admin', 'challenge'],
        });
        queryClient.invalidateQueries({
          queryKey: ['useChallengeApplicationsQuery', programId],
        });
        queryClient.invalidateQueries({
          queryKey: [ChallengeMissionFeedbackAttendanceQueryKey],
        });
        queryClient.invalidateQueries({
          queryKey: [MentorMissionFeedbackAttendanceQueryKey],
        });
        queryClient.invalidateQueries({
          queryKey: [MentorMenteeAttendanceQueryKey],
        });
      }
      setActiveTab(tab);
    },
    [activeTab, queryClient, programId],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 하위 탭 버튼 */}
      <div className="flex items-center gap-2">
        {showMentorMenteeTab && (
          <button
            type="button"
            className={`text-xsmall14 rounded-md border px-4 py-2 font-medium transition-colors ${
              activeTab === 'mentorMentee'
                ? 'border-neutral-0 bg-neutral-0 text-white'
                : 'border-neutral-80 text-neutral-0 hover:bg-neutral-95 bg-white'
            }`}
            onClick={() => handleTabChange('mentorMentee')}
          >
            멘토/멘티 배정
          </button>
        )}
        <button
          type="button"
          className={`text-xsmall14 rounded-md border px-4 py-2 font-medium transition-colors ${
            activeTab === 'feedbackManage'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 text-neutral-0 hover:bg-neutral-95 bg-white'
          }`}
          onClick={() => handleTabChange('feedbackManage')}
        >
          피드백 관리
        </button>
      </div>

      {/* 하위 탭 컨텐츠 */}
      {activeTab === 'mentorMentee' && showMentorMenteeTab ? (
        <MentorMenteeAssignment />
      ) : (
        <FeedbackMissionList />
      )}
    </div>
  );
}

export default ChallengeOperationFeedbackPage;
