'use client';

import { useState } from 'react';
import type { MissionPeriod } from './live/types';
import MentorSection from './live/MentorSection';
import TimeSlotSection from './live/TimeSlotSection';

interface Props {
  period: MissionPeriod;
}

const LiveFeedbackDetail = ({ period }: Props) => {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <MentorSection
        selectedMentorId={selectedMentorId}
        onSelect={setSelectedMentorId}
      />
      <TimeSlotSection selectedMentorId={selectedMentorId} period={period} />
    </div>
  );
};

export default LiveFeedbackDetail;
