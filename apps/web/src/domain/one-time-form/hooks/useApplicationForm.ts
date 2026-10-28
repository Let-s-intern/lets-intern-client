import type {
  CreateOneTimeFormApplicationRequest,
  OneTimeFormQuestion,
} from '@/api/one-time-form/oneTimeFormSchema';
import { useUserQuery } from '@/api/user/user';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { answersToJson } from '../utils/answersToJson';
import {
  applicantInfoFromUser,
  EMPTY_APPLICANT_INFO,
  formatPhoneNumber,
  type ApplicantField,
  type ApplicantInfo,
} from '../utils/applicantInfo';
import {
  collectFieldErrors,
  fieldDomId,
  hasEmptyRequiredField,
  type ApplicationFieldKey,
} from '../utils/applicationFormErrors';
import type { RawAnswer, RawAnswers } from '../utils/rawAnswer';

/** U3 요청 중 신청서 화면이 만드는 부분. UTM·결제는 7.6·push8 이 붙인다 */
export type ApplicationFormRequest = Pick<
  CreateOneTimeFormApplicationRequest,
  'name' | 'email' | 'phoneNum' | 'selectedOptionIds' | 'answers'
>;

interface UseApplicationFormParams {
  questions: OneTimeFormQuestion[];
  selectedOptionIds: number[];
  missingRequiredGroupIds: number[];
}

const focusField = (key: ApplicationFieldKey) => {
  const element = document.getElementById(fieldDomId(key));
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element?.focus({ preventScroll: true });
};

/**
 * 신청서 입력 상태(필수 정보 3개와 질문 답)와 검증.
 * 필수 정보는 계정 정보가 처음 도착했을 때 빈 칸만 채운다.
 * 오류 문구는 칸을 벗어난 뒤(markTouched)나 제출 시도(attemptSubmit) 뒤에만 visibleErrors 에 담긴다.
 */
const useApplicationForm = ({
  questions,
  selectedOptionIds,
  missingRequiredGroupIds,
}: UseApplicationFormParams) => {
  const { data: user } = useUserQuery();
  const [applicant, setApplicant] =
    useState<ApplicantInfo>(EMPTY_APPLICANT_INFO);
  const [answers, setAnswers] = useState<RawAnswers>({});
  const [touched, setTouched] = useState<ReadonlySet<ApplicationFieldKey>>(
    () => new Set(),
  );
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const isPrefilled = useRef(false);
  useEffect(() => {
    if (!user || isPrefilled.current) return;
    isPrefilled.current = true;
    const prefill = applicantInfoFromUser(user);
    setApplicant((prev) => ({
      name: prev.name || prefill.name,
      email: prev.email || prefill.email,
      phoneNum: prev.phoneNum || prefill.phoneNum,
    }));
  }, [user]);

  const errors = useMemo(
    () => collectFieldErrors(questions, applicant, answers),
    [questions, applicant, answers],
  );

  const visibleErrors = useMemo(() => {
    if (hasTriedSubmit) return errors;
    const shown: Partial<Record<ApplicationFieldKey, string>> = {};
    for (const key of touched) {
      if (errors[key]) shown[key] = errors[key];
    }
    return shown;
  }, [errors, touched, hasTriedSubmit]);

  const isRequiredFilled =
    !hasEmptyRequiredField(questions, applicant, answers) &&
    missingRequiredGroupIds.length === 0;
  const isSubmittable = isRequiredFilled && Object.keys(errors).length === 0;

  const setApplicantField = useCallback(
    (field: ApplicantField, value: string) =>
      setApplicant((prev) => ({
        ...prev,
        [field]: field === 'phoneNum' ? formatPhoneNumber(value) : value,
      })),
    [],
  );

  const setAnswer = useCallback(
    (questionId: number, value: RawAnswer | undefined) =>
      setAnswers((prev) => ({ ...prev, [questionId]: value })),
    [],
  );

  const markTouched = useCallback(
    (key: ApplicationFieldKey) =>
      setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key))),
    [],
  );

  /** 모든 오류 문구를 켠다. 오류가 있으면 첫 오류 칸으로 스크롤·포커스하고 false */
  const attemptSubmit = useCallback((): boolean => {
    setHasTriedSubmit(true);
    const firstErrorKey = Object.keys(errors)[0] as
      | ApplicationFieldKey
      | undefined;
    if (firstErrorKey) focusField(firstErrorKey);
    return isSubmittable;
  }, [errors, isSubmittable]);

  const buildRequest = useCallback(
    (): ApplicationFormRequest => ({
      name: applicant.name.trim(),
      email: applicant.email.trim(),
      phoneNum: applicant.phoneNum.trim(),
      selectedOptionIds,
      answers: answersToJson(questions, answers),
    }),
    [applicant, selectedOptionIds, questions, answers],
  );

  return {
    applicant,
    answers,
    visibleErrors,
    isRequiredFilled,
    isSubmittable,
    setApplicantField,
    setAnswer,
    markTouched,
    attemptSubmit,
    buildRequest,
  };
};

export default useApplicationForm;
