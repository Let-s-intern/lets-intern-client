'use client';

import { useCreateMentorApplicationMutation } from '@/api/mentor-application/mentorApplication';
import { FormProvider } from 'react-hook-form';

import { useMentorApplyForm } from './hooks/useMentorApplyForm';
import { usePrefillFromUser } from './hooks/usePrefillFromUser';
import AdditionalInfoSection from './section/AdditionalInfoSection';
import AttachmentSection from './section/AttachmentSection';
import BasicInfoSection from './section/BasicInfoSection';
import MentoringFieldSection from './section/MentoringFieldSection';
import PrivacyAgreementSection from './section/PrivacyAgreementSection';
import { attachmentErrorMessage } from './utils/attachmentErrorMessage';
import { toMentorApplicationFormData } from './utils/toMentorApplicationFormData';

interface MentorApplyFormProps {
  onSubmitted: (applicationId: number) => void;
}

/** 신청서 본문. 페이지·모달 어느 껍데기에 놓이는지 모르고 제출 결과만 알린다 */
export default function MentorApplyForm({ onSubmitted }: MentorApplyFormProps) {
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

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-12">
        <BasicInfoSection />
        <MentoringFieldSection />
        <AdditionalInfoSection />
        <AttachmentSection />
        <PrivacyAgreementSection />

        <div className="flex flex-col gap-3">
          <p className="text-xsmall14 text-neutral-40">
            제출 후에는 수정할 수 없습니다. 내용을 다시 한번 확인해주세요.
          </p>
          {mutation.isError && !isAttachmentError ? (
            <p role="alert" className="text-xsmall14 text-requirement">
              제출에 실패했어요. 잠시 후 다시 시도해 주세요.
            </p>
          ) : null}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-primary text-xsmall16 text-static-100 hover:bg-primary-hover w-full rounded-sm py-3.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            신청서 제출하기
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
