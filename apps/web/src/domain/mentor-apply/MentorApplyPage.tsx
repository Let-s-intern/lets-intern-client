'use client';

import { useState } from 'react';

import MentorApplyForm from './MentorApplyForm';

/** `/mentor-apply` 페이지 껍데기. 완료 처리는 임시 문구이고 push 5 에서 완료 화면으로 바꾼다 */
export default function MentorApplyPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:px-6 md:py-16">
      <h1 className="text-xlarge30 text-neutral-0 font-bold">멘토 신청서</h1>
      <div className="mt-10">
        {submitted ? (
          <p className="text-xsmall16 text-neutral-0">
            신청서가 제출되었습니다.
          </p>
        ) : (
          <MentorApplyForm onSubmitted={() => setSubmitted(true)} />
        )}
      </div>
    </div>
  );
}
