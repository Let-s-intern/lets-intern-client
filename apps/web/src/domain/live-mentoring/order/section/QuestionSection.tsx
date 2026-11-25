'use client';

import { useRef } from 'react';

import { useFileAttachments } from '../hooks/useFileAttachments';
import {
  MAX_ATTACHMENT_FILES,
  QUESTION_CONTENT_MAX,
  QUESTION_URL_MAX,
  type QuestionInput,
} from '../types';

/** 시안 `2-0` 의 "(pdf, doc, docx 형식 지원)". */
const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

interface QuestionSectionProps {
  value: QuestionInput;
  onChange: (next: QuestionInput) => void;
  /**
   * 질문을 나중에 낼 수 있는지. 예약이 48시간 안이면 낼 시간이 없어 막힌다.
   * 서버가 같은 규칙으로 거부하므로 여기서 미리 잠가 400 을 만나지 않게 한다.
   */
  deferralAllowed: boolean;
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
const QuestionSection = ({
  value,
  onChange,
  deferralAllowed,
}: QuestionSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patch = (partial: Partial<QuestionInput>) =>
    onChange({ ...value, ...partial });

  const { isUploading, message, upload, remove, clearMessage } =
    useFileAttachments({
      files: value.files,
      onChange: (files) => patch({ attachmentType: 'FILE', files, url: '' }),
    });

  const handleDeferredChange = (deferred: boolean) => {
    // disabled 만으로 막지 않는다. 그 속성이 빠지는 날 조용히 뚫린다.
    if (deferred && !deferralAllowed) return;
    if (!deferred) {
      patch({ deferred: false });
      return;
    }
    // 접을 때 값을 함께 비운다. 남겨 두면 쓴 적 없는 질문이 신청에 실린다.
    clearMessage();
    onChange({
      deferred: true,
      content: '',
      attachmentType: 'NONE',
      files: [],
      url: '',
      mentorShareAgreed: false,
    });
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xsmall16 font-semibold text-neutral-0">
        멘토에게 궁금한 점을 작성해 주세요
      </h2>

      {/*
        고를 수 없을 때도 체크박스를 남긴다. 없애면 다른 날짜에서는 있던 선택지가
        사라져, 왜 못 쓰는지 알 수 없다. 이유를 함께 적는다.
      */}
      <div className="flex flex-col gap-1">
        <label
          className={`flex items-center gap-2 text-xsmall14 ${
            deferralAllowed
              ? 'cursor-pointer text-neutral-30'
              : 'cursor-not-allowed text-neutral-60'
          }`}
        >
          <input
            type="checkbox"
            checked={value.deferred}
            disabled={!deferralAllowed}
            onChange={(event) => handleDeferredChange(event.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          나중에 작성하기
        </label>
        {!deferralAllowed && (
          <p className="pl-6 text-xxsmall12 text-neutral-45">
            멘토링 시작까지 48시간이 남지 않아 지금 작성해야 해요. 결제 후 3시간
            동안 수정할 수 있어요.
          </p>
        )}
      </div>

      {!value.deferred && (
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-xsmall14 font-medium text-neutral-0">
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
              className="resize-none rounded-sm bg-neutral-95 px-4 py-3 text-xsmall14 text-neutral-0"
            />
            <span className="self-end text-xxsmall12 text-neutral-45">
              {value.content.length}/{QUESTION_CONTENT_MAX}
            </span>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-xsmall14 font-medium text-neutral-0">
              전달 파일
            </legend>

            <label className="flex cursor-pointer items-center gap-2 text-xsmall14 text-neutral-0">
              <input
                type="radio"
                name="live-mentoring-attachment"
                checked={value.attachmentType === 'FILE'}
                onChange={() => patch({ attachmentType: 'FILE', url: '' })}
                className="h-4 w-4 accent-primary"
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
                multiple
                className="hidden"
                onChange={(event) => {
                  upload(Array.from(event.target.files ?? []));
                  // 같은 파일을 지웠다가 다시 고를 수 있게 비운다.
                  event.target.value = '';
                }}
              />
              <button
                type="button"
                disabled={value.attachmentType !== 'FILE' || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-sm border border-neutral-80 px-3 py-2 text-xsmall14 text-neutral-20 disabled:cursor-default disabled:text-neutral-60"
              >
                {isUploading ? '업로드 중…' : '파일 업로드'}
              </button>
              <span className="text-xxsmall12 text-neutral-45">
                {value.files.length}/{MAX_ATTACHMENT_FILES}
              </span>
              {message && (
                <span className="text-xxsmall12 text-system-error">
                  {message}
                </span>
              )}
            </div>
            {value.files.length > 0 && (
              <ul className="flex flex-col gap-1 pl-6">
                {value.files.map((file) => (
                  <li
                    key={file.fileId}
                    className="flex items-center gap-2 text-xxsmall12 text-neutral-40"
                  >
                    <span>{file.fileName}</span>
                    <button
                      type="button"
                      aria-label={`${file.fileName} 삭제`}
                      onClick={() => remove(file.fileId)}
                      className="text-neutral-45 underline"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-xsmall14 text-neutral-0">
              <input
                type="radio"
                name="live-mentoring-attachment"
                checked={value.attachmentType === 'URL'}
                onChange={() => {
                  clearMessage();
                  patch({ attachmentType: 'URL', files: [] });
                }}
                className="h-4 w-4 accent-primary"
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
              className="ml-6 rounded-sm border border-neutral-80 px-4 py-2.5 text-xsmall14 text-neutral-0 disabled:cursor-default disabled:bg-neutral-95"
            />
          </fieldset>

          <label className="flex cursor-pointer items-center gap-2 text-xsmall14 text-neutral-30">
            <input
              type="checkbox"
              checked={value.mentorShareAgreed}
              onChange={(event) =>
                patch({ mentorShareAgreed: event.target.checked })
              }
              className="h-4 w-4 accent-primary"
            />
            첨부한 파일이 멘토링 진행을 위해 멘토에게 전달되는 데 동의합니다.
          </label>
        </div>
      )}
    </section>
  );
};

export default QuestionSection;
