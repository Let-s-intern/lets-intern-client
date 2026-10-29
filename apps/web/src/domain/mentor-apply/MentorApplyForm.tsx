'use client';

import { useCreateMentorApplicationMutation } from '@/api/mentor-application/mentorApplication';
import { useEffect, useRef } from 'react';
import { FormProvider } from 'react-hook-form';

import { useMentorApplyForm } from './hooks/useMentorApplyForm';
import { usePrefillFromUser } from './hooks/usePrefillFromUser';
import AdditionalInfoSection from './section/AdditionalInfoSection';
import AttachmentSection from './section/AttachmentSection';
import BasicInfoSection from './section/BasicInfoSection';
import MentoringFieldSection from './section/MentoringFieldSection';
import PrivacyAgreementSection from './section/PrivacyAgreementSection';
import { primaryButtonClassName } from './ui/styles';
import { attachmentErrorMessage } from './utils/attachmentErrorMessage';
import { toMentorApplicationFormData } from './utils/toMentorApplicationFormData';

interface MentorApplyFormProps {
  onSubmitted: (applicationId: number) => void;
  /** 사용자가 고친 값이 있는지. 자동으로 채운 값은 치지 않는다 */
  onDirtyChange?: (dirty: boolean) => void;
}

/** 신청서 본문. 페이지·모달 어느 껍데기에 놓이는지 모르고 제출 결과만 알린다 */
export default function MentorApplyForm({
  onSubmitted,
  onDirtyChange,
}: MentorApplyFormProps) {
  const mutation = useCreateMentorApplicationMutation();
  const { form, onSubmit } = useMentorApplyForm((values) => {
    mutation.mutate(toMentorApplicationFormData(values), {
      onSuccess: ({ applicationId }) => {
        window.dataLayer?.push({
          event: 'mentor_apply_submit',
          application_id: applicationId,
        });
        onSubmitted(applicationId);
      },
      onError: (error) => {
        const message = attachmentErrorMessage(error);
        if (!message) return;
        form.setError('attachment', { message });
        document
          .querySelector('[data-field="attachment"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
    });
  });
  const isAttachmentError = !!attachmentErrorMessage(mutation.error);
  usePrefillFromUser(form);

  // 신청 시작은 사용자가 처음 입력한 순간 한 번만 남긴다. 자동 채우기는 DOM 이벤트가 없어 치지 않는다
  const startedRef = useRef(false);
  const handleFirstInput = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    window.dataLayer?.push({ event: 'mentor_apply_start' });
  };

  const { isDirty } = form.formState;
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={onSubmit}
        onChange={handleFirstInput}
        className="flex flex-col gap-12 break-keep"
      >
        <BasicInfoSection />
        <MentoringFieldSection />
        <AdditionalInfoSection />
        <AttachmentSection />
        <PrivacyAgreementSection />

        <div className="flex flex-col gap-3">
          {mutation.isError && !isAttachmentError ? (
            <p
              role="alert"
              className="rounded-[8px] bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              제출에 실패했어요. 잠시 후 다시 시도해 주세요.
            </p>
          ) : null}
          <p className="text-sm text-zinc-500">
            제출 후에는 수정할 수 없습니다. 내용을 다시 한번 확인해주세요.
          </p>
          <button
            type="submit"
            disabled={mutation.isPending}
            className={`${primaryButtonClassName} w-full py-3.5`}
          >
            {mutation.isPending ? '제출 중…' : '신청서 제출하기'}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
