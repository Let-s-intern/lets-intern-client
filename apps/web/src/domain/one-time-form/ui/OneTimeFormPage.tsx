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
import useApplicationForm, {
  type ApplicationFormRequest,
} from '../hooks/useApplicationForm';
import useOptionSelection from '../hooks/useOptionSelection';
import useSaveUtmOnEntry from '../hooks/useSaveUtmOnEntry';
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
  /**
   * 검증을 통과한 뒤 하단 버튼("다음"·"제출하기")을 누르면 부른다.
   * 결제 단계 이동(유료)과 U3 제출(무료)은 push8 이 이 자리에 연결한다.
   */
  onValidSubmit?: (request: ApplicationFormRequest) => void;
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
const OneTimeFormPage = ({ slug, onValidSubmit }: OneTimeFormPageProps) => {
  useSaveUtmOnEntry(slug);
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
  });
  const applicationForm = useApplicationForm({
    questions: data?.questions ?? NO_QUESTIONS,
    selectedOptionIds,
    missingRequiredGroupIds,
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
    return <LoadErrorState onRetry={() => myApplicationQuery.refetch()} />;
  }

  const application = myApplicationQuery.data;
  if (application && !application.isCanceled) {
    return <AlreadyAppliedState slug={slug} application={application} />;
  }

  const { form } = data;

  const handleSubmitClick = () => {
    if (applicationForm.attemptSubmit()) {
      onValidSubmit?.(applicationForm.buildRequest());
    }
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
          ) : null}
          {/* 필수 칸이 비면 막는다. 형식 오류는 누른 뒤 첫 오류 칸으로 안내한다 */}
          <button
            type="button"
            disabled={!applicationForm.isRequiredFilled}
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
