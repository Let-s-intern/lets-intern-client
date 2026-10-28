'use client';

import MentorApplyFlow from './MentorApplyFlow';

/** `/mentor-apply` 페이지 껍데기 */
export default function MentorApplyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <MentorApplyFlow
        heading={
          <h1 className="text-xlarge30 text-neutral-0 mb-10 font-bold">
            멘토 신청서
          </h1>
        }
      />
    </div>
  );
}
