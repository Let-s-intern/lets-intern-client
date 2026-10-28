import {
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_ALREADY_APPLIED,
  useCreateOneTimeFormApplicationMutation,
} from '@/api/one-time-form/oneTimeForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getApplicationErrorMessage } from '../payment/utils/applicationErrorMessage';
import { clearApplicationSession } from '../utils/applicationDraft';
import { buildFreeApplicationRequest } from '../utils/buildFreeApplicationRequest';
import { readUtm } from '../utils/utmStorage';
import type { ApplicationFormRequest } from './useApplicationForm';

/**
 * 무료 폼 "제출하기"(계약 11.2-6). U3 성공이나 이미 신청함이면 완료 화면으로 replace 하고,
 * 그 밖의 실패는 문구를 남기고 머문다. 요청 중에는 isPending 으로 버튼을 막는다.
 */
const useFreeFormSubmit = (slug: string) => {
  const router = useRouter();
  const createApplication = useCreateOneTimeFormApplicationMutation(slug);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = (request: ApplicationFormRequest) => {
    setErrorMessage(null);
    const goToComplete = () => router.replace(`/form/${slug}/complete`);
    createApplication.mutate(
      buildFreeApplicationRequest(request, readUtm(slug)),
      {
        onSuccess: () => {
          clearApplicationSession(slug);
          goToComplete();
        },
        onError: (error) => {
          if (
            getOneTimeFormErrorCode(error) === ONE_TIME_FORM_ALREADY_APPLIED
          ) {
            goToComplete();
            return;
          }
          setErrorMessage(getApplicationErrorMessage(error));
        },
      },
    );
  };

  return { submit, isPending: createApplication.isPending, errorMessage };
};

export default useFreeFormSubmit;
