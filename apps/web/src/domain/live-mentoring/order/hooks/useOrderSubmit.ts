'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCreateLiveMentoringApplicationMutation } from '@/api/live-mentoring/liveMentoring';
import type { CreateLiveMentoringApplicationRequest } from '@/api/live-mentoring/liveMentoringSchema';
import {
  useOrderDraftStore,
  type LiveMentoringOrderDraft,
} from './useOrderDraft';
import type { QuestionInput } from '../types';
import { validateQuestionInput } from '../utils';
import { readServerError } from '../../utils/serverError';

/**
 * 일정을 다시 고르면 풀리는 실패들. 서버 `LiveMentoringErrorCode` 에서 실측한 값이다.
 *
 * - `SLOT_UNAVAILABLE` — 폼을 쓰는 사이 다른 사람이 가져갔다(409). 안 A 의 대가다
 * - `INVALID_SLOT_COMBINATION` — 플랜과 슬롯 수·연속성이 어긋난다
 *
 * 코드 이름을 짐작하면 안 된다. 처음에 `SLOT_ALREADY_RESERVED` 로 써 뒀다가
 * 실호출에서 `SLOT_UNAVAILABLE` 이 오는 것을 보고 고쳤다.
 */
const SLOT_CONFLICT_CODES = new Set([
  'LIVE_MENTORING_SLOT_UNAVAILABLE',
  'LIVE_MENTORING_INVALID_SLOT_COMBINATION',
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UseOrderSubmitParams {
  draft: LiveMentoringOrderDraft;
  contactEmail: string;
  question: QuestionInput;
  couponCode: string | null;
  customerName: string;
  customerMobilePhone: string;
}

/**
 * `결제하기` — 신청을 만들고 Toss 위젯 페이지로 넘긴다 (PRD 7-4 안 A).
 *
 * 신청 생성이 성공하는 순간 **슬롯이 10분 선점된다.** 그래서 이 시점까지 미룬다 —
 * 질문·쿠폰을 쓰는 동안 선점해 두면 남들이 그 시간을 못 쓰고, 사용자가 창을 닫으면
 * 10분간 빈자리로 묶인다.
 *
 * 그 대가로 폼을 쓰는 사이 다른 사람이 같은 슬롯을 가져갈 수 있다. 그때는 일정을
 * 다시 고르도록 상세로 돌려보낸다.
 */
export function useOrderSubmit({
  draft,
  contactEmail,
  question,
  couponCode,
  customerName,
  customerMobilePhone,
}: UseOrderSubmitParams) {
  const router = useRouter();
  const setApplication = useOrderDraftStore((state) => state.setApplication);
  const createApplication = useCreateLiveMentoringApplicationMutation(
    draft.openingId,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSlotConflict, setIsSlotConflict] = useState(false);

  /*
    서버가 공개 상세에 `durationPriceId` 를 아직 내려주지 않는다. 없으면 신청 생성이
    `@NotNull` 위반으로 400 이라, 눌러 보고 실패하게 두지 않고 미리 막는다.
    자세한 사정은 `liveMentoringSchema.ts` 의 `durationPriceId` 주석 참고.
  */
  const isContractReady = draft.durationPriceId !== null;
  const isEmailValid = EMAIL_PATTERN.test(contactEmail);
  /*
    서버 `validateQuestion` 과 같은 규칙을 미리 본다. 거기서 걸리면 400 의 문구가
    "질문 및 첨부 정보가 올바르지 않습니다" 하나뿐이라 무엇을 고쳐야 할지 알 수 없다.
  */
  const questionError = validateQuestionInput(question);
  const canSubmit = isContractReady && isEmailValid && questionError === null;

  const submit = () => {
    if (!canSubmit || createApplication.isPending) return;

    setErrorMessage(null);
    setIsSlotConflict(false);

    const body: CreateLiveMentoringApplicationRequest = {
      durationPriceId: draft.durationPriceId as number,
      slotIds: draft.slots.map((slot) => slot.slotId),
      mentoringTypeIds: draft.mentoringTypeIds,
      reservationChangeAgreed: draft.reservationChangeAgreed,
      contactEmail,
      // `나중에 작성하기` 면 빈 질문을 보낸다. 화면에서 값을 비웠으므로 그대로 옮긴다.
      question: {
        deferred: question.deferred,
        content: question.deferred ? null : question.content,
        attachmentType: question.attachmentType,
        fileId: question.attachmentType === 'FILE' ? question.fileId : null,
        url: question.attachmentType === 'URL' ? question.url : null,
        mentorShareAgreed: question.mentorShareAgreed,
      },
      couponCode,
    };

    createApplication.mutate(body, {
      onSuccess: (created) => {
        setApplication({
          applicationId: created.applicationId,
          orderId: created.payment.orderId,
          // 쿠폰까지 계산한 서버 금액을 그대로 쓴다. 화면에서 다시 계산하지 않는다.
          finalAmount: created.payment.finalAmount,
          orderName: created.product.name,
          customerName,
          customerEmail: contactEmail,
          customerMobilePhone: customerMobilePhone.replace(/[^0-9]/g, ''),
          expiresAt: created.reservation.expiresAt,
        });
        /*
          쿠폰으로 0원이 되면 결제할 것이 없다. 서버도 `finalAmount > 0` 일 때만 Toss 를
          부르므로 위젯을 띄우면 0원 결제 요청이 되어 실패한다. 위젯을 건너뛰고
          승인 단계로 바로 보낸다 — `paymentKey` 없이도 서버가 승인한다.
        */
        if (created.payment.finalAmount === 0) {
          const params = new URLSearchParams({
            orderId: created.payment.orderId,
            amount: '0',
          });
          router.push(`/live-mentoring/order/result?${params.toString()}`);
          return;
        }
        router.push('/live-mentoring/order/payment');
      },
      onError: (error) => {
        const { code, message } = readServerError(
          error,
          '신청을 만들지 못했습니다. 잠시 후 다시 시도해 주세요.',
        );
        setIsSlotConflict(SLOT_CONFLICT_CODES.has(code));
        setErrorMessage(message);
      },
    });
  };

  return {
    submit,
    canSubmit,
    isContractReady,
    isEmailValid,
    questionError,
    isPending: createApplication.isPending,
    errorMessage,
    isSlotConflict,
    /** 일정을 다시 고르러 상세로 돌아간다. */
    goBackToSchedule: () => router.push(`/live-mentoring/${draft.mentorId}`),
  };
}
