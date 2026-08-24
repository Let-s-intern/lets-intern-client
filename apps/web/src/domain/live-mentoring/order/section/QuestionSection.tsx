'use client';

import { useRef, useState } from 'react';

import { uploadFileForId } from '@/api/file';
import {
  QUESTION_CONTENT_MAX,
  QUESTION_URL_MAX,
  type QuestionInput,
} from '../types';

/** 시안 `2-0` 의 "(pdf, doc, docx 형식 지원)". */
const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

interface QuestionSectionProps {
  value: QuestionInput;
  onChange: (next: QuestionInput) => void;
}

/**
 * 멘토에게 궁금한 점 (시안 `2-0` · `2-1`).
 *
 * `나중에 작성하기` 를 켜면 질문·첨부·전달 동의가 **통째로 접힌다**(시안 `2-1`).
 * 감추는 것이 아니라 렌더하지 않는다 — 접힌 채 남아 있는 입력값이 그대로 신청에
 * 실려 가면 사용자가 쓴 적 없는 질문이 멘토에게 간다. 값은 `deferred` 를 켤 때
 * 함께 비운다.
 *
 * 첨부는 파일과 URL 중 하나다. `attachmentType` 이 그 배타성을 그대로 나타내므로
 * 별도 플래그를 두지 않는다.
 */
const QuestionSection = ({ value, onChange }: QuestionSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const patch = (partial: Partial<QuestionInput>) =>
    onChange({ ...value, ...partial });

  const handleDeferredChange = (deferred: boolean) => {
    if (!deferred) {
      patch({ deferred: false });
      return;
    }
    // 접을 때 값을 함께 비운다. 남겨 두면 쓴 적 없는 질문이 신청에 실린다.
    setFileName(null);
    setUploadError(null);
    onChange({
      deferred: true,
      content: '',
      attachmentType: 'NONE',
      fileId: null,
      url: '',
      mentorShareAgreed: false,
    });
  };

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      // `LIVE_MENTORING` 은 Push 2 의 2.1 에서 zod enum 에 넣었다. 없으면 여기서 터진다.
      const fileId = await uploadFileForId({ file, type: 'LIVE_MENTORING' });
      setFileName(file.name);
      patch({ attachmentType: 'FILE', fileId, url: '' });
    } catch {
      setFileName(null);
      setUploadError('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xsmall16 text-neutral-0 font-semibold">
        멘토에게 궁금한 점을 작성해 주세요
      </h2>

      <label className="text-xsmall14 text-neutral-30 flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={value.deferred}
          onChange={(event) => handleDeferredChange(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        나중에 작성하기
      </label>

      {!value.deferred && (
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-xsmall14 text-neutral-0 font-medium">
              멘토링 질문 작성
            </span>
            <p className="text-xxsmall12 text-neutral-45">
              * 멘토에게 미리 전달할 질문을 작성해 주세요. 함께 보면 좋을 파일이
              있다면 링크로 첨부할 수 있으며, 멘토링 예약 시간 24시간 전까지
              수정할 수 있어요.
            </p>
            <textarea
              aria-label="멘토링 질문 작성"
              value={value.content}
              maxLength={QUESTION_CONTENT_MAX}
              onChange={(event) => patch({ content: event.target.value })}
              placeholder="멘토링에서 꼭 물어보고 싶은 점을 작성해 주세요."
              rows={5}
              className="bg-neutral-95 text-xsmall14 text-neutral-0 resize-none rounded-sm px-4 py-3"
            />
            <span className="text-xxsmall12 text-neutral-45 self-end">
              {value.content.length}/{QUESTION_CONTENT_MAX}
            </span>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-xsmall14 text-neutral-0 mb-2 font-medium">
              전달 파일
            </legend>

            <label className="text-xsmall14 text-neutral-0 flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="live-mentoring-attachment"
                checked={value.attachmentType === 'FILE'}
                onChange={() =>
                  patch({ attachmentType: 'FILE', url: '' })
                }
                className="accent-primary h-4 w-4"
              />
              파일 첨부{' '}
              <span className="text-neutral-45">
                (pdf, doc, docx 형식 지원)
              </span>
            </label>

            <div className="flex items-center gap-3 pl-6">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                className="hidden"
                onChange={(event) => handleFileSelect(event.target.files?.[0])}
              />
              <button
                type="button"
                disabled={value.attachmentType !== 'FILE' || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="border-neutral-80 text-xsmall14 text-neutral-20 disabled:text-neutral-60 rounded-sm border px-3 py-2 disabled:cursor-default"
              >
                {isUploading ? '업로드 중…' : '파일 업로드'}
              </button>
              {fileName && (
                <span className="text-xxsmall12 text-neutral-40">
                  {fileName}
                </span>
              )}
              {uploadError && (
                <span className="text-xxsmall12 text-system-error">
                  {uploadError}
                </span>
              )}
            </div>

            <label className="text-xsmall14 text-neutral-0 flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="live-mentoring-attachment"
                checked={value.attachmentType === 'URL'}
                onChange={() => {
                  setFileName(null);
                  patch({ attachmentType: 'URL', fileId: null });
                }}
                className="accent-primary h-4 w-4"
              />
              URL
            </label>

            <input
              type="url"
              aria-label="첨부 URL"
              value={value.url}
              maxLength={QUESTION_URL_MAX}
              disabled={value.attachmentType !== 'URL'}
              onChange={(event) => patch({ url: event.target.value })}
              placeholder="https://"
              className="border-neutral-80 text-xsmall14 text-neutral-0 disabled:bg-neutral-95 ml-6 rounded-sm border px-4 py-2.5 disabled:cursor-default"
            />
          </fieldset>

          <label className="text-xsmall14 text-neutral-30 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={value.mentorShareAgreed}
              onChange={(event) =>
                patch({ mentorShareAgreed: event.target.checked })
              }
              className="accent-primary h-4 w-4"
            />
            첨부한 파일이 멘토링 진행을 위해 멘토에게 전달되는 데 동의합니다.
          </label>
        </div>
      )}
    </section>
  );
};

export default QuestionSection;
