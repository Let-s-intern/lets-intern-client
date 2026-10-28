import {
  fetchMyOneTimeFormApplication,
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_ALREADY_APPLIED,
  useCreateOneTimeFormApplicationMutation,
} from '@/api/one-time-form/oneTimeForm';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import {
  clearApplicationSession,
  readDraft,
} from '../../utils/applicationDraft';
import { readUtm } from '../../utils/utmStorage';
import { getApplicationErrorMessage } from '../utils/applicationErrorMessage';
import {
  resolvePaymentResult,
  type PaymentResultQuery,
} from '../utils/paymentResult';

/**
 * 토스 성공 리다이렉트에서 U3 를 한 번만 부르고 결과 경로로 replace 한다.
 * strict mode 의 effect 두 번 실행과 리렌더에도 ref 로 한 번만 부른다.
 * 성공 뒤 다시 들어오면 보관값이 없어 U2 로 판단한다.
 */
const usePaymentResult = (slug: string, query: PaymentResultQuery | null) => {
  const router = useRouter();
  const { mutateAsync } = useCreateOneTimeFormApplicationMutation(slug);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    resolvePaymentResult(slug, query, {
      readDraft: () => readDraft(slug),
      readUtm: () => readUtm(slug),
      createApplication: mutateAsync,
      fetchMyApplication: () => fetchMyOneTimeFormApplication(slug),
      clearSession: () => clearApplicationSession(slug),
      getErrorCode: getOneTimeFormErrorCode,
      getErrorMessage: getApplicationErrorMessage,
      alreadyAppliedCode: ONE_TIME_FORM_ALREADY_APPLIED,
    }).then((path) => router.replace(path));
  }, [slug, query, mutateAsync, router]);
};

export default usePaymentResult;
