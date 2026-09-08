'use client';

import { useState } from 'react';

import { useCreateLiveMentoringReviewMutation } from '@/api/review/review';
import BaseModal from '@/common/modal/BaseModal';

import { readServerError } from '../../utils/serverError';

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
const SAVE_FAILED = '후기를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.';

/**
 * 사용자에게 보일 실패 문구를 고른다.
 *
 * `readServerError` 는 서버 문구가 없으면 `error.message` 를 그대로 돌려준다. 그런데
 * 연결이 끊기면 axios 가 `Error('Network Error')` 를 던지므로, 그대로 쓰면 화면에
 * 영문 원문이 뜬다. 이 티켓의 재현 경로(`ERR_CONNECTION_REFUSED`)가 바로 그 경우다.
 *
 * 서버가 준 코드가 있을 때만 서버 문구를 믿는다. 인터셉터가 만든 `ApiError` 에는 코드가
 * 있고, 날것의 `Error` 에는 없어 `UNKNOWN` 으로 읽힌다.
 *
 * `readServerError` 자체를 고치지 않은 이유는 그 함수를 질문 모달과 취소 화면이 함께
 * 쓰기 때문이다. 같은 새는 곳이 그쪽에도 있지만 이 티켓의 범위가 아니다.
 */
function toUserMessage(error: unknown): string {
  const { code, message } = readServerError(error, SAVE_FAILED);
  return code === 'UNKNOWN' ? SAVE_FAILED : message;
}

const LiveMentoringReviewModal = ({
  isOpen,
  onClose,
  applicationId,
  productName,
  mentorName,
}: LiveMentoringReviewModalProps) => {
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);

  const { mutate: createReview, isPending } =
    useCreateLiveMentoringReviewMutation(applicationId);

  const canSubmit = stars > 0 && content.trim().length > 0;

  /*
    실패를 화면에 적는다. 예전에는 onSuccess 만 넘겨서, 저장이 실패해도 모달이 그대로
    남고 버튼만 다시 눌리는 상태로 돌아왔다. 화면 어디에도 표시가 없으니 사용자는
    저장된 줄 알고 "나중에 쓸게요" 나 창 닫기로 넘어갔고, 후기는 사라졌다.

    문구가 "저장하지 못했다" 로 시작해야 한다 — 여기서 알려야 하는 것은 원인이 아니라
    아직 저장되지 않았다는 사실이다.
  */
  const handleSubmit = () => {
    if (!canSubmit || isPending) return;
    setSaveError(null);
    createReview(
      { score: stars, content },
      {
        onSuccess: onClose,
        onError: (error) => setSaveError(toUserMessage(error)),
      },
    );
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
              placeholder="예) 혼자서는 무엇부터 정리해야 할지 막막했는데, 제 상황에 맞는 다음 단계를 구체적으로 짚어주셨어요. 덕분에 바로 시작할 수 있었어요."
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
          {saveError && (
            <p role="alert" className="text-xxsmall12 text-system-error">
              {saveError}
            </p>
          )}
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
