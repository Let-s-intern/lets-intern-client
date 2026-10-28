'use client';

import {
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_NOT_FOUND,
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import type {
  OneTimeFormOptionGroup,
  OneTimeFormQuestion,
} from '@/api/one-time-form/oneTimeFormSchema';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useApplicationForm from '../hooks/useApplicationForm';
import useFreeFormSubmit from '../hooks/useFreeFormSubmit';
import useOptionSelection from '../hooks/useOptionSelection';
import useSaveUtmOnEntry from '../hooks/useSaveUtmOnEntry';
import { ConsentCheckbox } from '../payment/ui/PaymentConsents';
import { answersFromJson } from '../utils/answersToJson';
import { readDraft, saveDraft } from '../utils/applicationDraft';
import { isLoginRequiredError } from '../utils/loginRequired';
import AccountBar from './AccountBar';
import ApplicantInfoFields from './ApplicantInfoFields';
import FormPopupShell from './FormPopupShell';
import OptionGroupList from './OptionGroupList';
import ProductCard from './ProductCard';
import QuestionList from './questions/QuestionList';
import AlreadyAppliedState from './states/AlreadyAppliedState';
import ApplyPeriodState from './states/ApplyPeriodState';
import LoadErrorState from './states/LoadErrorState';
import LoginRequiredState from './states/LoginRequiredState';
import NotFoundState from './states/NotFoundState';

interface OneTimeFormPageProps {
  slug: string;
}

const PAID_STEP = { current: 1, total: 2 };
const NO_OPTION_GROUPS: OneTimeFormOptionGroup[] = [];
const NO_QUESTIONS: OneTimeFormQuestion[] = [];

const LoadingState = () => (
  <FormPopupShell title="신청서 작성">
    <p className="text-xsmall14 text-neutral-40 py-10 text-center">
      불러오는 중이에요
    </p>
  </FormPopupShell>
);

/**
 * 일회성 폼 신청 팝업 1단계(정보 입력). 유료는 "신청서 작성 1/2", 무료는 단계 없이 분류 문구(categoryText)가 제목.
 * 입력 화면 전에 계약 11.2 순서로 예외 화면을 고른다: 없는 폼 → 기간 밖 → 비로그인 → 이미 신청함.
 */
const OneTimeFormPage = ({ slug }: OneTimeFormPageProps) => {
  useSaveUtmOnEntry(slug);
  const router = useRouter();
  // 결제 단계에서 "수정"·이전으로 돌아오면 보관한 입력값으로 다시 채운다
  const [storedDraft] = useState(() => readDraft(slug));
  // 무료 폼은 결제 단계가 없어 개인정보 동의를 제출 버튼 위에서 받는다(시안 3절)
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const freeSubmit = useFreeFormSubmit(slug);
  const formQuery = useOneTimeFormQuery(slug);
  const { data } = formQuery;
  const isAuthInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const myApplicationQuery = useMyOneTimeFormApplicationQuery(slug, {
    enabled: isLoggedIn && data?.form.applyStatus === 'OPEN',
  });
  const {
    selectedOptionIds,
    totalPrice,
    missingRequiredGroupIds,
    toggleOption,
  } = useOptionSelection({
    basePrice: data?.form.basePrice ?? 0,
    optionGroups: data?.optionGroups ?? NO_OPTION_GROUPS,
    initialSelectedOptionIds: storedDraft?.selectedOptionIds,
  });
  const applicationForm = useApplicationForm({
    questions: data?.questions ?? NO_QUESTIONS,
    selectedOptionIds,
    missingRequiredGroupIds,
    initialValues: storedDraft
      ? {
          applicant: {
            name: storedDraft.name,
            email: storedDraft.email,
            phoneNum: storedDraft.phoneNum,
          },
          answers: answersFromJson(storedDraft.answers),
        }
      : undefined,
  });

  if (formQuery.isLoading) return <LoadingState />;

  if (!data) {
    return getOneTimeFormErrorCode(formQuery.error) ===
      ONE_TIME_FORM_NOT_FOUND ? (
      <NotFoundState />
    ) : (
      <LoadErrorState onRetry={() => formQuery.refetch()} />
    );
  }

  if (data.form.applyStatus !== 'OPEN') {
    return <ApplyPeriodState form={data.form} />;
  }

  // 저장된 로그인 상태를 읽기 전에 로그인 화면이 깜빡이지 않게 기다린다
  if (!isAuthInitialized) return <LoadingState />;
  if (!isLoggedIn) return <LoginRequiredState form={data.form} />;

  if (myApplicationQuery.isLoading) return <LoadingState />;
  if (myApplicationQuery.isError) {
    // 로그인 상태가 남아 있어도 서버가 세션을 거절하면(401·403) 비로그인과 같다
    return isLoginRequiredError(myApplicationQuery.error) ? (
      <LoginRequiredState form={data.form} />
    ) : (
      <LoadErrorState onRetry={() => myApplicationQuery.refetch()} />
    );
  }

  const application = myApplicationQuery.data;
  if (application && !application.isCanceled) {
    return <AlreadyAppliedState slug={slug} application={application} />;
  }

  const { form } = data;

  const handleSubmitClick = () => {
    if (!applicationForm.attemptSubmit()) return;
    const request = applicationForm.buildRequest();
    if (!form.isPaid) {
      freeSubmit.submit(request);
      return;
    }
    // 계약 11.2-7: 토스 왕복 뒤에도 쓸 수 있게 보관한다. orderId 는 결제 단계에서 만든다
    if (!saveDraft(slug, { ...request, orderId: null, amount: totalPrice })) {
      window.alert(
        '브라우저 저장소를 쓸 수 없어 결제를 진행할 수 없어요. 시크릿 모드를 끄고 다시 시도해 주세요.',
      );
      return;
    }
    router.push(`/form/${slug}/payment`);
  };

  return (
    <FormPopupShell
      title={form.isPaid ? '신청서 작성' : form.categoryText}
      step={form.isPaid ? PAID_STEP : undefined}
      footer={
        <>
          {form.isPaid ? (
            <div className="text-xsmall14 text-neutral-40 mb-2.5 flex items-baseline justify-between">
              <span>선택한 금액</span>
              <b className="text-small18 text-neutral-0">
                {totalPrice.toLocaleString('ko-KR')}원
              </b>
            </div>
          ) : (
            <>
              {freeSubmit.errorMessage ? (
                <p
                  role="alert"
                  className="text-xxsmall12 text-requirement mb-2.5 break-keep text-center"
                >
                  {freeSubmit.errorMessage}
                </p>
              ) : null}
              <ConsentCheckbox
                checked={isPrivacyAgreed}
                onChange={setIsPrivacyAgreed}
                size="sm"
                className="text-xxsmall12 text-neutral-35 mb-3"
              >
                [필수] 개인정보 수집 및 이용 동의
              </ConsentCheckbox>
            </>
          )}
          {/* 필수 칸이 비면 막는다. 형식 오류는 누른 뒤 첫 오류 칸으로 안내한다 */}
          <button
            type="button"
            disabled={
              !applicationForm.isRequiredFilled ||
              (!form.isPaid && (!isPrivacyAgreed || freeSubmit.isPending))
            }
            onClick={handleSubmitClick}
            className="bg-primary text-xsmall16 text-static-100 hover:bg-primary-hover disabled:bg-neutral-85 disabled:text-neutral-45 h-[52px] w-full rounded-sm font-semibold transition-colors"
          >
            {form.isPaid ? '다음' : '제출하기'}
          </button>
        </>
      }
    >
      <ProductCard form={form} />
      <AccountBar />
      <OptionGroupList
        optionGroups={data.optionGroups}
        selectedOptionIds={selectedOptionIds}
        onSelect={toggleOption}
      />
      <ApplicantInfoFields
        applicant={applicationForm.applicant}
        errors={applicationForm.visibleErrors}
        onChange={applicationForm.setApplicantField}
        onBlur={applicationForm.markTouched}
      />
      <QuestionList
        slug={slug}
        questions={data.questions}
        answers={applicationForm.answers}
        errors={applicationForm.visibleErrors}
        onChange={applicationForm.setAnswer}
        onBlur={applicationForm.markTouched}
      />
    </FormPopupShell>
  );
};

export default OneTimeFormPage;
