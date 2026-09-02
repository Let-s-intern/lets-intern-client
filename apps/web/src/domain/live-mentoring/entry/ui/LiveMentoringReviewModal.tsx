'use client';

import { useState } from 'react';

import { useCreateLiveMentoringReviewMutation } from '@/api/review/review';
import BaseModal from '@/common/modal/BaseModal';

import StarRating from './StarRating';

export const REVIEW_MAX_LENGTH = 300;

interface LiveMentoringReviewModalProps {
  isOpen: boolean;
  /** 저장 없이 닫기(나중에 쓸게요·제출 완료 후 공통). */
  onClose: () => void;
  applicationId: number;
  /** 상품명 — 있으면 제목에 붙인다. 없으면(드묾) "1:1 멘토링"으로 폴백. */
  productName?: string;
  /** 멘토 이름 — 있으면 부제에 붙인다. */
  mentorName?: string;
}

/**
 * 1:1 멘토링 세션 종료 직후 뜨는 후기 작성 모달.
 *
 * `domain/live-feedback`의 `LiveFeedbackReviewModal`과 같은 문구 설계 원칙(멘티에게
 * "정리"의 이유를 주는 것)을 따르되, 챌린지 전제 표현("다음 준비가 훨씬 빨라져요")은
 * 걷어내고 상품명을 넣는다(PRD §3.3.4). 저장 계약도 다르다 —
 * `POST /api/v2/review?applicationId={id}` `{ type: 'LIVE_MENTORING_REVIEW', score, content }`.
 */
const LiveMentoringReviewModal = ({
  isOpen,
  onClose,
  applicationId,
  productName,
  mentorName,
}: LiveMentoringReviewModalProps) => {
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');

  const { mutate: createReview, isPending } =
    useCreateLiveMentoringReviewMutation(applicationId);

  const canSubmit = stars > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isPending) return;
    createReview({ score: stars, content }, { onSuccess: onClose });
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
            {productName ? `${productName} 멘토링` : '1:1 멘토링'}, 어떠셨나요?
          </h2>
          <p className="text-xsmall14 text-neutral-40">
            {mentorName ? `${mentorName} 멘토님과 나눈` : '멘토님과 나눈'}{' '}
            이야기를 지금 정리해두면 더 오래 기억에 남아요.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <h3 className="text-xsmall14 text-neutral-0 font-semibold">
            이번 멘토링, 얼마나 도움이 됐나요?
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
              placeholder="예) 이력서에서 어떤 항목을 강조해야 할지 몰랐는데, 지원 직무와 연결되는 경험을 앞에 배치하라고 짚어주셨어요. 덕분에 다음 지원서부터 바로 적용할 수 있었어요."
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

export default LiveMentoringReviewModal;
