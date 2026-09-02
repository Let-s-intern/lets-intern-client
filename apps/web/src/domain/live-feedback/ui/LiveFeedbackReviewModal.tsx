'use client';

import { useState } from 'react';

import { usePatchFeedbackReview } from '@/api/feedback/feedback';
import BaseModal from '@/common/modal/BaseModal';

export const REVIEW_MAX_LENGTH = 300;

/** 별점 입력 — 후기 모달과 대시보드 인라인 섹션이 함께 쓴다. */
export function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <img
            src={
              active >= star
                ? '/icons/star-yellow.svg'
                : '/icons/star-unfill.svg'
            }
            alt={`별 ${star}개`}
            className="size-7"
          />
        </button>
      ))}
    </div>
  );
}

interface LiveFeedbackReviewModalProps {
  isOpen: boolean;
  /** 저장 없이 닫기(나중에 쓸게요·제출 완료 후 공통). */
  onClose: () => void;
  feedbackId: number;
  /** 멘토 이름 — 있으면 제목에 붙인다. */
  mentorName?: string;
}

/**
 * 라이브 멘토링 종료 직후 뜨는 후기 작성 모달.
 *
 * 문구 설계 — "멘토님께 후기를 남겨주세요"라고 물으면 멘티에게는 쓸 이유가 없다.
 * 그래서 "멘토링을 통해 무엇을 알게 되었는지"를 묻는다. 멘티는 자기 정리를 위해 쓰고,
 * 그 답은 그대로 멘토 프로필에 실릴 만한 후기가 된다.
 * placeholder 가 답의 형태를 좌우하므로 "무엇을 몰랐는지 → 무엇을 알게 됐는지 →
 * 무엇을 바꿀 것인지" 흐름의 예시를 유지할 것. 라벨을 임의로 되돌리지 말 것.
 *
 * 저장 계약은 대시보드 인라인 섹션과 동일한 `PATCH /feedback/{id}` `{score, review}` 다.
 */
const LiveFeedbackReviewModal = ({
  isOpen,
  onClose,
  feedbackId,
  mentorName,
}: LiveFeedbackReviewModalProps) => {
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');

  const { mutate: patchReview, isPending } = usePatchFeedbackReview(feedbackId);

  const canSubmit = stars > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isPending) return;
    patchReview({ score: stars, review: content }, { onSuccess: onClose });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isLoading={isPending}
      className="max-h-[90dvh] max-w-[480px] overflow-y-auto"
    >
      <div className="flex flex-col gap-6 p-6">
        <header className="flex flex-col gap-2">
          <h2 className="text-small18 text-neutral-0 font-bold">
            오늘 멘토링, 무엇을 얻으셨나요?
          </h2>
          <p className="text-xsmall14 text-neutral-40">
            {mentorName ? `${mentorName} 멘토님과의 ` : '오늘 '}대화에서 새로
            알게 된 것을 지금 정리해두면, 다음 준비가 훨씬 빨라져요.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <h3 className="text-xsmall14 text-neutral-0 font-semibold">
            오늘 멘토링, 얼마나 도움이 됐나요?
          </h3>
          <StarRating value={stars} onChange={setStars} />
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-xsmall14 text-neutral-0 font-semibold">
            멘토링을 통해 새롭게 알게 된 점을 작성해주세요
          </h3>
          <div className="flex flex-col gap-1">
            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value.slice(0, REVIEW_MAX_LENGTH))
              }
              placeholder="예) 혼자 볼 때는 이력서가 왜 안 통하는지 몰랐는데, 성과가 숫자로 안 보인다는 점을 짚어주셨어요. 프로젝트마다 지표를 한 줄씩 붙이는 방법까지 알려주셔서 바로 고칠 수 있었어요."
              className="text-xsmall14 text-neutral-0 border-neutral-80 rounded-xxs font-regular placeholder:text-neutral-70 h-[144px] w-full resize-none border p-3 outline-none"
            />
            <p className="text-xxsmall12 text-right">
              <span className="text-neutral-9">{content.length}</span>
              <span className="text-neutral-45">/{REVIEW_MAX_LENGTH}</span>
            </p>
          </div>
          {!canSubmit && (
            <p className="text-xxsmall12 text-system-error">
              별점과 내용을 채우면 저장할 수 있어요.
            </p>
          )}
        </section>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="bg-primary text-xsmall14 w-full rounded-sm py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            작성 완료
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-xsmall14 text-neutral-45 w-full py-2 font-medium"
          >
            나중에 쓸게요
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default LiveFeedbackReviewModal;
