import { useState } from 'react';

import JitsiEmbedModal from '@/pages/schedule/modal/JitsiEmbedModal';

/**
 * Dev 환경에서만 노출되는 Jitsi 회의실 테스트 카드.
 *
 * - `VITE_JITSI_USE_DEV_MOCK=true` 일 때만 렌더 (prod 안전)
 * - 멘티 측 동일 카드와 같은 방으로 수렴하는지 확인용
 * - feedbackId와 salt만 가지면 멘토/멘티/어드민이 같은 URL 산출
 */
const DEV_MOCK_ENABLED = import.meta.env.VITE_JITSI_USE_DEV_MOCK === 'true';
const MOCK_FEEDBACK_ID = Number(
  import.meta.env.VITE_JITSI_DEV_MOCK_FEEDBACK_ID ?? 999999,
);

const JitsiDevTestCard = () => {
  const [open, setOpen] = useState(false);

  if (!DEV_MOCK_ENABLED) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-primary hover:bg-primary-5 border-primary flex w-full items-center justify-between rounded-lg border border-dashed px-4 py-3 text-left text-sm font-medium"
      >
        <span>🧪 Jitsi 회의실 테스트 진입 (dev mock)</span>
        <span className="text-neutral-40 text-xs">
          feedbackId={MOCK_FEEDBACK_ID}
        </span>
      </button>
      <JitsiEmbedModal
        isOpen={open}
        onClose={() => setOpen(false)}
        meta={{ feedbackId: MOCK_FEEDBACK_ID }}
        spaceName="Jitsi 통합 QA · 테스트 방"
      />
    </>
  );
};

export default JitsiDevTestCard;
