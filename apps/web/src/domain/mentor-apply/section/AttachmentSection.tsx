import { Controller, useFormContext } from 'react-hook-form';

import { SNS_LINK_COUNT, type MentorApplyFormValues } from '../schema';
import FormField, { fieldErrorId } from '../ui/FormField';
import FormSection from '../ui/FormSection';
import TextInput from '../ui/TextInput';

const SNS_INDEXES = Array.from({ length: SNS_LINK_COUNT }, (_, i) => i);

export default function AttachmentSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();

  const snsError = errors.snsLinks?.find?.((e) => e?.message)?.message;

  return (
    <FormSection title="첨부 (선택)">
      <FormField
        name="attachment"
        label="이력서 / 포트폴리오"
        htmlFor="attachment"
        hint="PDF, 10MB 이하"
        error={errors.attachment?.message}
      >
        <Controller
          control={control}
          name="attachment"
          render={({ field }) => (
            <input
              id="attachment"
              type="file"
              accept="application/pdf"
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              aria-invalid={errors.attachment ? true : false}
              aria-describedby={
                errors.attachment ? fieldErrorId('attachment') : undefined
              }
              className="text-xsmall14 text-neutral-30 file:rounded-xxs file:bg-neutral-90 file:text-xsmall14 file:text-neutral-20 hover:file:bg-neutral-85 block w-full file:mr-4 file:border-0 file:px-4 file:py-2 file:font-semibold"
            />
          )}
        />
      </FormField>

      <FormField
        name="snsLinks"
        label="SNS"
        hint="LinkedIn, 인스타그램, 블로그 등 최대 3개"
        error={snsError}
      >
        <div className="flex flex-col gap-2">
          {SNS_INDEXES.map((i) => (
            <TextInput
              key={i}
              type="url"
              placeholder="https://"
              aria-label={`SNS ${i + 1}`}
              invalid={!!errors.snsLinks?.[i]}
              errorId={fieldErrorId('snsLinks')}
              {...register(`snsLinks.${i}`)}
            />
          ))}
        </div>
      </FormField>
    </FormSection>
  );
}
