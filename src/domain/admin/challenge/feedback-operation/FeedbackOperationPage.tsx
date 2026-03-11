'use client';

import { useState } from 'react';
import { twMerge } from '@/lib/twMerge';
import MentorNoticeManagement from './MentorNoticeManagement';
import OngoingChallenges from './OngoingChallenges';

type Tab = 'notice' | 'ongoing';

const tabs: { id: Tab; label: string }[] = [
  { id: 'notice', label: '공지사항' },
  { id: 'ongoing', label: '진행중 챌린지' },
];

export default function FeedbackOperationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notice');

  return (
    <section className="p-5">
      <nav className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'rounded-md border px-4 py-2 text-xsmall14',
              activeTab === tab.id
                ? 'border-neutral-0 bg-neutral-0 text-white'
                : 'border-neutral-80 bg-white text-neutral-40',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'notice' && <MentorNoticeManagement />}
      {activeTab === 'ongoing' && <OngoingChallenges />}
    </section>
  );
}
