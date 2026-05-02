'use client';

import { useState } from 'react';
import MentorSection from './live/MentorSection';
import TimeSlotSection from './live/TimeSlotSection';

const LiveFeedbackDetail = () => {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4 md:p-4">
      <MentorSection
        selectedMentorId={selectedMentorId}
        onSelect={setSelectedMentorId}
      />
      <TimeSlotSection selectedMentorId={selectedMentorId} />
    </div>
  );
};

export default LiveFeedbackDetail;
