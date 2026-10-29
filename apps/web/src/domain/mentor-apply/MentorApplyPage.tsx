'use client';

import MentorApplyFlow from './MentorApplyFlow';
import { pageTitleClassName } from './ui/styles';

/** `/mentor-apply` 페이지 껍데기 */
export default function MentorApplyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 text-zinc-900 sm:px-6 sm:py-16">
      <MentorApplyFlow
        heading={<h1 className={`${pageTitleClassName} mb-10`}>멘토 신청서</h1>}
      />
    </div>
  );
}
