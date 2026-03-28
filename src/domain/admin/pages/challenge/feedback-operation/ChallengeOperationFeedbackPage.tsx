'use client';

import { useState } from 'react';
import MentorMenteeAssignment from '../mentor-assignment/MentorMenteeAssignment';
import FeedbackMissionList from './FeedbackMissionList';
import type { SubTab } from './types';

function ChallengeOperationFeedbackPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('feedbackManage');

  return (
    <div className="flex flex-col gap-4">
      {/* 하위 탭 버튼 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'mentorMentee'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => setActiveTab('mentorMentee')}
        >
          멘토/멘티 배정
        </button>
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'feedbackManage'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => setActiveTab('feedbackManage')}
        >
          피드백 관리
        </button>
      </div>

      {/* 하위 탭 컨텐츠 */}
      {activeTab === 'mentorMentee' ? (
        <MentorMenteeAssignment />
      ) : (
        <FeedbackMissionList />
      )}
    </div>
  );
}

export default ChallengeOperationFeedbackPage;
