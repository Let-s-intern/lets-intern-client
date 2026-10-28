'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import MentorApplyComplete from './MentorApplyComplete';
import MentorApplyForm from './MentorApplyForm';

interface MentorApplyFlowProps {
  /** 신청서 위에만 보이는 제목. 완료 화면에는 자기 제목이 있다 */
  heading?: ReactNode;
  onHome?: () => void;
}

/** 제출 전에는 신청서, 제출 후에는 같은 자리에서 완료 화면을 보여 준다 */
export default function MentorApplyFlow({
  heading,
  onHome,
}: MentorApplyFlowProps) {
  const [submitted, setSubmitted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // 긴 신청서 아래쪽에서 제출하므로, 바뀐 화면의 머리로 올린다
  useEffect(() => {
    if (submitted) topRef.current?.scrollIntoView?.({ block: 'start' });
  }, [submitted]);

  return (
    <div ref={topRef}>
      {submitted ? (
        <MentorApplyComplete onHome={onHome} />
      ) : (
        <>
          {heading}
          <MentorApplyForm onSubmitted={() => setSubmitted(true)} />
        </>
      )}
    </div>
  );
}
