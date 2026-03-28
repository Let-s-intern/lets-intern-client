'use client';

import type { MentorItem } from '../types';
import { getMentorColor } from '../utils';

interface MentorListProps {
  mentors: MentorItem[];
}

export default function MentorList({ mentors }: MentorListProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-medium18 font-semibold">등록된 멘토</h3>
      {mentors.length === 0 ? (
        <p className="text-xsmall14 text-neutral-40">
          등록된 멘토가 없습니다.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {mentors.map((m, i) => {
            const career = m.userCareerList?.[0];
            const color = getMentorColor(i);
            return (
              <div
                key={m.challengeMentorId}
                className={`rounded-lg border px-4 py-3 ${color.bg} ${color.border}`}
              >
                <p className={`text-xsmall14 font-semibold ${color.text}`}>
                  {m.name}
                </p>
                {career?.company && career?.job && (
                  <p
                    className={`mt-0.5 text-xxsmall12 ${color.text} opacity-70`}
                  >
                    {career.company} / {career.job}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
