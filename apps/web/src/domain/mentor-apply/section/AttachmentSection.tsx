import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { usePdfDocuments } from '../hooks/usePdfDocuments';
import { SNS_LINK_COUNT, type MentorApplyFormValues } from '../schema';
import FormField, { fieldErrorId } from '../ui/FormField';
import FormSection from '../ui/FormSection';
import TextInput from '../ui/TextInput';
import { documentLabel } from '../utils/isPdfDocument';

const SNS_INDEXES = Array.from({ length: SNS_LINK_COUNT }, (_, i) => i);

type AttachmentSource = 'upload' | 'document';

const SOURCE_OPTIONS: { value: AttachmentSource; label: string }[] = [
  { value: 'upload', label: '새 파일 올리기' },
  { value: 'document', label: '서류 정리에서 선택' },
];

export default function AttachmentSection() {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<MentorApplyFormValues>();
  const { isLoggedIn, documents } = usePdfDocuments();
  const [source, setSource] = useState<AttachmentSource>('upload');

  const snsError = errors.snsLinks?.find?.((e) => e?.message)?.message;

  /** 파일과 서류 정리 문서는 둘 중 하나만 보낸다. 고르지 않은 쪽은 비운다 */
  const changeSource = (next: AttachmentSource) => {
    setSource(next);
    if (next === 'document') {
      setValue('attachment', null, { shouldDirty: true });
      clearErrors('attachment');
    } else {
      setValue('userDocumentId', null, { shouldDirty: true });
    }
  };

  return (
    <FormSection title="첨부 (선택)">
      <FormField
        name="attachment"
        label="이력서 / 포트폴리오"
        htmlFor="attachment"
        hint="PDF, 10MB 이하"
        error={errors.attachment?.message}
      >
        {isLoggedIn ? (
          <div
            role="radiogroup"
            aria-label="첨부 방식"
            className="flex flex-wrap gap-2"
          >
            {SOURCE_OPTIONS.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="attachmentSource"
                  value={option.value}
                  checked={source === option.value}
                  onChange={() => changeSource(option.value)}
                  className="peer sr-only"
                />
                <span className="text-xsmall14 border-neutral-80 text-neutral-20 hover:border-neutral-60 peer-checked:border-primary peer-checked:bg-primary-10 peer-checked:text-primary peer-focus-visible:ring-primary-10 inline-block rounded-full border px-4 py-2 transition-colors peer-checked:font-semibold peer-focus-visible:ring-2">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        ) : null}

        {source === 'document' ? (
          <Controller
            control={control}
            name="userDocumentId"
            render={({ field }) =>
              !documents ? (
                <p className="text-xsmall14 text-neutral-40">
                  서류 정리 목록을 불러오는 중이에요.
                </p>
              ) : documents.length === 0 ? (
                <p className="text-xsmall14 text-neutral-40">
                  서류 정리에 저장된 PDF 문서가 없어요.
                </p>
              ) : (
                <ul
                  role="radiogroup"
                  aria-label="서류 정리 PDF"
                  className="border-neutral-80 divide-neutral-80 flex flex-col divide-y rounded-sm border"
                >
                  {documents.map((document) => (
                    <li key={document.userDocumentId}>
                      <label className="text-xsmall14 text-neutral-10 flex cursor-pointer items-center gap-2.5 px-4 py-3">
                        <input
                          type="radio"
                          name={field.name}
                          value={document.userDocumentId}
                          checked={field.value === document.userDocumentId}
                          onChange={() =>
                            field.onChange(document.userDocumentId)
                          }
                          onBlur={field.onBlur}
                          className="accent-primary h-4 w-4 shrink-0"
                        />
                        <span className="break-all">
                          {documentLabel(document)}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )
            }
          />
        ) : (
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
        )}
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
