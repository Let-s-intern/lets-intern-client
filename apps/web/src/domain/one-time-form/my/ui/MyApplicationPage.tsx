'use client';

import {
  getOneTimeFormErrorCode,
  ONE_TIME_FORM_NOT_FOUND,
  useCancelOneTimeFormApplicationMutation,
  useMyOneTimeFormApplicationQuery,
  useOneTimeFormQuery,
} from '@/api/one-time-form/oneTimeForm';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { closeWindowOrGoHome } from '../../complete/utils/closeWindowOrGoHome';
import LoadErrorState from '../../ui/states/LoadErrorState';
import NotFoundState from '../../ui/states/NotFoundState';
import {
  buildLoginPath,
  isLoginRequiredError,
} from '../../utils/loginRequired';
import { resolveCancelError } from '../utils/cancelError';
import CancelCompleteScreen from './CancelCompleteScreen';
import CancelConfirmSheet from './CancelConfirmSheet';
import MyApplicationDetail from './MyApplicationDetail';
import {
  MyLoadingState,
  MyLoginRequiredState,
  NoApplicationState,
} from './MyApplicationStates';

interface MyApplicationPageProps {
  slug: string;
}

/**
 * 신청 확인·취소 페이지(계약 U2, 11.1, 시안 5절).
 * U1 은 비공개 폼을 404 로 숨기지만 U2 는 본인 신청을 준다. 그래서 U1 404 여도 로그인했으면 U2 를 보고,
 * 신청이 있으면 상품 카드 없이 그린다. U2 도 404 거나 신청이 없으면 없는 페이지로 본다.
 */
const MyApplicationPage = ({ slug }: MyApplicationPageProps) => {
  const router = useRouter();
  const formQuery = useOneTimeFormQuery(slug);
  const isAuthInitialized = useAuthStore((s) => s.isInitialized);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const myApplicationQuery = useMyOneTimeFormApplicationQuery(slug, {
    enabled: isLoggedIn,
  });

  const cancelMutation = useCancelOneTimeFormApplicationMutation(slug);
  const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false);
  const [isCancelDone, setIsCancelDone] = useState(false);
  const cancelError = cancelMutation.error
    ? resolveCancelError(cancelMutation.error)
    : null;

  const handleCancelRequest = () => {
    cancelMutation.reset();
    setIsCancelSheetOpen(true);
  };
  // 성공하면 훅이 U2 를 다시 불러 둔 뒤 완료 화면으로 바꾼다
  const handleCancelConfirm = (applicationId: number) =>
    cancelMutation.mutate(applicationId, {
      onSuccess: () => {
        setIsCancelSheetOpen(false);
        setIsCancelDone(true);
      },
      onError: (error) => {
        const action = resolveCancelError(error);
        if (action.type === 'LOGIN') {
          router.push(buildLoginPath(`/form/${slug}/my`));
        } else if (action.type === 'REFETCH') {
          myApplicationQuery.refetch();
        }
      },
    });
  const handleClose = () => closeWindowOrGoHome(window, () => router.push('/'));

  const isFormNotFound =
    getOneTimeFormErrorCode(formQuery.error) === ONE_TIME_FORM_NOT_FOUND;

  if (formQuery.isLoading) return <MyLoadingState />;
  if (formQuery.isError && !isFormNotFound) {
    return <LoadErrorState onRetry={() => formQuery.refetch()} />;
  }

  // 저장된 로그인 상태를 읽기 전에 로그인 화면이 깜빡이지 않게 기다린다
  if (!isAuthInitialized) return <MyLoadingState />;
  if (!isLoggedIn) return <MyLoginRequiredState slug={slug} />;

  if (myApplicationQuery.isLoading) return <MyLoadingState />;
  if (myApplicationQuery.isError) {
    if (isLoginRequiredError(myApplicationQuery.error)) {
      return <MyLoginRequiredState slug={slug} />;
    }
    return getOneTimeFormErrorCode(myApplicationQuery.error) ===
      ONE_TIME_FORM_NOT_FOUND ? (
      <NotFoundState />
    ) : (
      <LoadErrorState onRetry={() => myApplicationQuery.refetch()} />
    );
  }

  const application = myApplicationQuery.data;
  if (!application) {
    return isFormNotFound ? (
      <NotFoundState />
    ) : (
      <NoApplicationState slug={slug} />
    );
  }

  if (isCancelDone) {
    return (
      <CancelCompleteScreen application={application} onClose={handleClose} />
    );
  }

  return (
    <>
      <MyApplicationDetail
        form={formQuery.data?.form}
        application={application}
        onCancelRequest={handleCancelRequest}
        onClose={handleClose}
      />
      {isCancelSheetOpen ? (
        <CancelConfirmSheet
          payment={application.payment}
          isPending={cancelMutation.isPending}
          errorMessage={
            cancelError && cancelError.type !== 'LOGIN'
              ? cancelError.message
              : undefined
          }
          isConfirmBlocked={cancelError?.type === 'REFETCH'}
          onKeep={() => setIsCancelSheetOpen(false)}
          onConfirm={() => handleCancelConfirm(application.applicationId)}
        />
      ) : null}
    </>
  );
};

export default MyApplicationPage;
