import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { usePdfDocuments } from '../hooks/usePdfDocuments';
import { SNS_LINK_COUNT, type MentorApplyFormValues } from '../schema';
import FormField, { fieldErrorId } from '../ui/FormField';
import FormSection from '../ui/FormSection';
import { chipClassName } from '../ui/styles';
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
                <span className={chipClassName}>{option.label}</span>
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
                <p className="text-sm text-zinc-500">
                  서류 정리 목록을 불러오는 중이에요.
                </p>
              ) : documents.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  서류 정리에 저장된 PDF 문서가 없어요.
                </p>
              ) : (
                <ul
                  role="radiogroup"
                  aria-label="서류 정리 PDF"
                  className="flex flex-col divide-y divide-zinc-200 rounded-[8px] border border-zinc-300"
                >
                  {documents.map((document) => (
                    <li key={document.userDocumentId}>
                      <label className="flex cursor-pointer items-center gap-2.5 px-4 py-3 text-sm text-zinc-700">
                        <input
                          type="radio"
                          name={field.name}
                          value={document.userDocumentId}
                          checked={field.value === document.userDocumentId}
                          onChange={() =>
                            field.onChange(document.userDocumentId)
                          }
                          onBlur={field.onBlur}
                          className="size-4 shrink-0 accent-[#4d55f5]"
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
            render={({ field }) => {
              const file = field.value as File | null;
              return (
                <div className="flex flex-col gap-2">
                  {/* 기본 파일 입력은 숨기고, 아래 label 을 버튼처럼 보인다. 포커스 링은 형제 div 가 받는다 */}
                  <input
                    id="attachment"
                    type="file"
                    accept="application/pdf"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    // 같은 파일을 지웠다가 다시 골라도 change 가 일어나게 비운다
                    onClick={(e) => {
                      e.currentTarget.value = '';
                    }}
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] ?? null)
                    }
                    aria-invalid={errors.attachment ? true : false}
                    aria-describedby={
                      errors.attachment ? fieldErrorId('attachment') : undefined
                    }
                    className="peer sr-only"
                  />
                  {/* 시안의 기본 파일 입력처럼 [파일 선택] 버튼 옆에 파일 이름을 둔다 */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 peer-focus-visible:[&>label]:ring-2 peer-focus-visible:[&>label]:ring-[#dfe1fe]">
                    <label
                      htmlFor="attachment"
                      className="cursor-pointer rounded-[6px] bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
                    >
                      파일 선택
                    </label>
                    <span className="min-w-0 break-all text-sm text-zinc-600">
                      {file ? file.name : '선택된 파일 없음'}
                    </span>
                    {file ? (
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(null);
                          clearErrors('attachment');
                        }}
                        aria-label={`${file.name} 첨부 삭제`}
                        className="shrink-0 text-sm font-semibold text-zinc-500 transition-colors hover:text-zinc-700"
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            }}
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
