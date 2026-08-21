'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserQuery } from '@/api/user/user';
import { useLiveMentoringCoupon } from './hooks/useLiveMentoringCoupon';
import {
  useOrderDraftStore,
  type LiveMentoringOrderDraft,
} from './hooks/useOrderDraft';
import { useOrderSubmit } from './hooks/useOrderSubmit';
import ApplicantFormSection from './section/ApplicantFormSection';
import CouponSection from './section/CouponSection';
import PriceSection from './section/PriceSection';
import ProgramCardSection from './section/ProgramCardSection';
import QuestionSection from './section/QuestionSection';
import { EMPTY_QUESTION, type QuestionInput } from './types';

interface OrderPageProps {
  /**
   * 되돌아갈 상세 페이지의 멘토 id. 쿼리스트링으로 받는다.
   *
   * 선택값은 메모리에만 있어 새로고침하면 사라지는데, 그때 어느 상세로 보낼지
   * 알아야 한다. 그래서 멘토 id 만 URL 에 남긴다 — 이것 하나로 되돌아갈 곳이 정해진다.
   */
  mentorId: string | null;
}

/**
 * 1대1 라이브 멘토링 결제 페이지 (시안 `2-0`).
 *
 * 신청 시트에서 고른 값(`useOrderDraftStore`)을 받아 질문·쿠폰을 마저 받고
 * 결제로 넘긴다. 신청 생성은 `결제하기` 를 누르는 순간 한 번에 일어난다
 * (PRD 7-4 안 A) — 그전까지 슬롯은 선점되지 않는다.
 */
const OrderPage = ({ mentorId }: OrderPageProps) => {
  const router = useRouter();
  const draft = useOrderDraftStore((state) => state.draft);
  const { data: user } = useUserQuery();

  const accountEmail = user?.email ?? '';
  /*
    시안은 `가입한 이메일과 동일` 이 체크된 상태로 열린다. 체크돼 있는 동안에는
    입력을 잠그고 가입 이메일을 그대로 따라간다 — 사용자 조회가 늦게 끝나도
    빈 칸이 남지 않게 상태를 따로 들지 않고 파생시킨다.
  */
  const [sameAsAccountEmail, setSameAsAccountEmail] = useState(true);
  const [typedContactEmail, setTypedContactEmail] = useState('');
  const contactEmail = sameAsAccountEmail ? accountEmail : typedContactEmail;
  const [question, setQuestion] = useState<QuestionInput>(EMPTY_QUESTION);
  const coupon = useLiveMentoringCoupon();

  /*
    선택값 없이 이 주소에 닿는 경로는 둘이다 — 새로고침, 그리고 주소창 직접 입력.
    어느 쪽이든 결제할 대상이 없으므로 되돌려보낸다. 빈 화면에 "결제하기" 만
    떠 있으면 눌렀을 때 무슨 일이 날지 알 수 없다.
  */
  useEffect(() => {
    if (draft) return;
    router.replace(mentorId ? `/live-mentoring/${mentorId}` : '/live-mentoring');
  }, [draft, mentorId, router]);

  if (!draft) {
    return <p className="text-neutral-40 py-20 text-center">이동 중…</p>;
  }

  return (
    <div className="mw-1180 flex flex-col gap-8 px-5 py-8 md:py-12">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="이전으로"
          className="hover:bg-neutral-90 rounded-full p-1"
        >
          <img
            src="/icons/Chevron_Left_MD.svg"
            alt=""
            aria-hidden="true"
            className="h-6 w-6"
          />
        </button>
        <h1 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
          결제하기
        </h1>
      </div>

      <ProgramCardSection draft={draft} />

      <ApplicantFormSection
        name={user?.name ?? ''}
        phoneNumber={user?.phoneNum ?? ''}
        accountEmail={accountEmail}
        contactEmail={contactEmail}
        onContactEmailChange={setTypedContactEmail}
        sameAsAccountEmail={sameAsAccountEmail}
        onSameAsAccountEmailChange={(same) => {
          setSameAsAccountEmail(same);
          // 체크를 풀면 방금까지 보이던 값에서 이어 고치게 한다
          if (!same) setTypedContactEmail(contactEmail);
        }}
      />

      <QuestionSection value={question} onChange={setQuestion} />

      <hr className="border-neutral-85" />

      <CouponSection
        inputValue={coupon.inputValue}
        onInputChange={coupon.setInputValue}
        appliedCode={coupon.appliedCode}
        onRegister={coupon.register}
        onClear={coupon.clear}
      />

      <PriceSection price={draft.price} appliedCouponCode={coupon.appliedCode} />

      <SubmitBlock
        draft={draft}
        contactEmail={contactEmail}
        question={question}
        couponCode={coupon.appliedCode}
        customerName={user?.name ?? ''}
        customerMobilePhone={user?.phoneNum ?? ''}
      />

      {/*
        TODO(7-7): 시안 `2-0` 의 "마감까지 3일 23시간 58분 58초" 배너 자리.
        근거 데이터가 없어 그리지 않는다 — 개설에 모집 마감일 개념이 없고,
        10분 선점 만료는 자릿수가 맞지 않는다. 근거가 확정되면 여기에 넣는다.
      */}
    </div>
  );
};

interface SubmitBlockProps {
  draft: LiveMentoringOrderDraft;
  contactEmail: string;
  question: QuestionInput;
  couponCode: string | null;
  customerName: string;
  customerMobilePhone: string;
}

/**
 * `결제하기` 버튼과 그 실패 안내.
 *
 * `useOrderSubmit` 은 `draft` 가 있어야 개설 id 를 안다. 선택값이 없을 때
 * `OrderPage` 는 일찍 반환하는데 훅을 조건부로 부를 수는 없으므로 이 블록만 분리했다.
 */
const SubmitBlock = ({
  draft,
  contactEmail,
  question,
  couponCode,
  customerName,
  customerMobilePhone,
}: SubmitBlockProps) => {
  const {
    submit,
    canSubmit,
    isContractReady,
    isEmailValid,
    questionError,
    isPending,
    errorMessage,
    isSlotConflict,
    goBackToSchedule,
  } = useOrderSubmit({
    draft,
    contactEmail,
    question,
    couponCode,
    customerName,
    customerMobilePhone,
  });

  return (
    <div className="flex flex-col gap-3">
      {!isEmailValid && (
        <p className="text-xxsmall12 text-system-error">
          정보 수신용 이메일 형식을 확인해 주세요.
        </p>
      )}

      {questionError && (
        <p className="text-xxsmall12 text-system-error">{questionError}</p>
      )}

      {/*
        durationPriceId 를 못 받는 서버(구버전)에 붙었을 때만 뜬다. 누르면 400 이
        나므로 미리 막고 왜 막혔는지 알린다.
      */}
      {!isContractReady && (
        <p className="text-xxsmall12 text-system-error">
          결제에 필요한 플랜 정보를 불러오지 못했습니다. 잠시 후 다시 시도해
          주세요.
        </p>
      )}

      {errorMessage && (
        <div className="bg-system-error/5 flex flex-col gap-2 rounded-sm px-4 py-3">
          <p className="text-xsmall14 text-system-error">{errorMessage}</p>
          {isSlotConflict && (
            <button
              type="button"
              onClick={goBackToSchedule}
              className="text-xsmall14 text-primary self-start underline"
            >
              일정 다시 고르기
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit || isPending}
        className="bg-primary text-xsmall16 disabled:bg-neutral-80 disabled:text-neutral-40 w-full rounded-sm py-4 font-medium text-white"
      >
        {isPending ? '신청하는 중…' : '결제하기'}
      </button>
    </div>
  );
};

export default OrderPage;
