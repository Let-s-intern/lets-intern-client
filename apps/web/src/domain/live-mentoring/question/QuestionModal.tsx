'use client';

import { useEffect, useRef, useState } from 'react';

import { uploadFileForId } from '@/api/file';
import {
  useLiveMentoringQuestionQuery,
  useUpdateLiveMentoringQuestionMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringAttachmentType } from '@/api/live-mentoring/liveMentoringSchema';
import {
  QUESTION_CONTENT_MAX,
  QUESTION_URL_MAX,
  type QuestionInput,
} from '../order/types';
import { validateQuestionInput } from '../order/utils';
import { readServerError } from '../utils/serverError';

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';

interface QuestionModalProps {
  applicationId: number;
  /** 참여 중·종료 카드에서 열면 읽기 전용이다. */
  readOnly?: boolean;
  onClose: () => void;
}

/**
 * 멘토링 질문 작성·수정·확인 모달 (시안 `3-1` · `3-2`).
 *
 * 세 모드를 한 컴포넌트로 둔다. 시안 두 장의 차이는 **버튼 라벨과 초기값뿐**이고,
 * 확인 모드는 거기에 입력이 잠기는 것만 더해진다.
 *
 * **수정 가능 여부는 서버 응답의 `editable` 을 그대로 쓴다.** 예약 시작 24시간 기준을
 * 화면에서 다시 계산하면 클라이언트와 서버의 시계 차이로 어긋나, 저장 버튼은 열려
 * 있는데 저장은 거부되는 상태가 생긴다.
 */
const QuestionModal = ({
  applicationId,
  readOnly = false,
  onClose,
}: QuestionModalProps) => {
  const { data: question, isLoading } =
    useLiveMentoringQuestionQuery(applicationId);
  const updateQuestion = useUpdateLiveMentoringQuestionMutation(applicationId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draft, setDraft] = useState<QuestionInput | null>(null);

  /*
    조회가 끝나면 그 값을 초기값으로 심는다. 이후 입력은 화면이 들고 있는다.

    `deferred` 는 false 로 시작한다. 이 모달에는 `나중에 작성하기` 토글이 없어서
    (시안 `3-1`·`3-2`) 여기서 저장한다는 것은 곧 질문을 쓴다는 뜻이다. 조회값의
    true 를 그대로 들고 있으면 빈 내용으로도 저장이 열려, 눌러도 아무것도 바뀌지
    않는 버튼이 된다 — 시안에서도 그 상태의 저장 버튼은 회색이다.
  */
  useEffect(() => {
    if (!question || draft) return;
    setDraft({
      deferred: false,
      content: question.content ?? '',
      attachmentType: question.attachmentType,
      fileId: question.fileId,
      url: question.attachmentUrl ?? '',
      mentorShareAgreed: question.mentorShareAgreed,
    });
  }, [question, draft]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const patch = (partial: Partial<QuestionInput>) =>
    setDraft((prev) => (prev ? { ...prev, ...partial } : prev));

  const handleFileSelect = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    setIsUploading(true);
    try {
      const fileId = await uploadFileForId({ file, type: 'LIVE_MENTORING' });
      setFileName(file.name);
      patch({ attachmentType: 'FILE', fileId, url: '' });
    } catch {
      setUploadError('파일 업로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  /*
    서버가 준 editable 이 최종 판정이다. readOnly 는 참여 중·종료 카드에서 열었을 때의
    화면 모드이고, 둘 중 하나라도 막으면 잠근다.
  */
  const canEdit = !readOnly && (question?.editable ?? false);
  const hasWrittenQuestion = Boolean(question && !question.deferred);
  const questionError = draft ? validateQuestionInput(draft) : null;
  /*
    본문이 비었다는 안내는 띄우지 않는다. 공용 문구가 `나중에 작성하기` 를 가리키는데
    이 모달에는 그 토글이 없어(결제 페이지에만 있다) 없는 것을 누르라는 말이 된다.
    시안 `3-1` 도 그 상태에서는 문구 없이 저장 버튼만 회색이다.
  */
  const shownQuestionError =
    draft && draft.content.trim().length === 0 ? null : questionError;
  const canSave =
    canEdit && questionError === null && !updateQuestion.isPending;

  const handleSave = () => {
    if (!draft || !canSave) return;
    setSaveError(null);
    updateQuestion.mutate(
      {
        deferred: false,
        content: draft.content,
        attachmentType: draft.attachmentType,
        fileId: draft.attachmentType === 'FILE' ? draft.fileId : null,
        url: draft.attachmentType === 'URL' ? draft.url : null,
        mentorShareAgreed: draft.mentorShareAgreed,
      },
      {
        onSuccess: onClose,
        onError: (error) =>
          setSaveError(
            readServerError(
              error,
              '저장하지 못했습니다. 잠시 후 다시 시도해 주세요.',
            ).message,
          ),
      },
    );
  };

  return (
    <div
      className="bg-neutral-0/50 fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        // 제목을 그대로 이름으로 삼는다. aria-label 을 따로 두면 안쪽
        // textarea 의 이름과 겹쳐 접근성 트리에서 구분되지 않는다.
        aria-labelledby="live-mentoring-question-title"
        onClick={(event) => event.stopPropagation()}
        className="bg-static-100 flex max-h-[90dvh] w-full flex-col gap-5 overflow-y-auto rounded-t-xl px-5 py-6 md:max-w-[720px] md:rounded-xl md:px-8"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="live-mentoring-question-title"
            className="text-small18 md:text-small20 text-neutral-0 font-bold"
          >
            멘토에게 궁금한 점을 작성해 주세요.
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="모달 닫기"
            className="text-neutral-40 shrink-0 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {isLoading || !draft ? (
          <p className="text-neutral-40 py-10 text-center">불러오는 중…</p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <span className="text-xsmall14 text-neutral-0 font-medium">
                멘토링 질문
              </span>
              <p className="text-xxsmall12 text-neutral-45">
                * 멘토에게 미리 전달할 질문을 작성해 주세요. 함께 보면 좋을
                파일이 있다면 첨부해주세요. 멘토링 예약 시간 24시간 전까지
                수정할 수 있어요.
              </p>
              <textarea
                aria-label="멘토링 질문"
                value={draft.content}
                maxLength={QUESTION_CONTENT_MAX}
                readOnly={!canEdit}
                onChange={(event) => patch({ content: event.target.value })}
                placeholder="멘토링에서 꼭 물어보고 싶은 점을 작성해 주세요."
                rows={6}
                className="bg-neutral-95 text-xsmall14 text-neutral-0 resize-none rounded-sm px-4 py-3"
              />
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-xsmall14 text-neutral-0 mb-2 font-medium">
                전달 파일
              </legend>

              <label className="text-xsmall14 text-neutral-0 flex items-center gap-2">
                <input
                  type="radio"
                  name="live-mentoring-question-attachment"
                  checked={draft.attachmentType === 'FILE'}
                  disabled={!canEdit}
                  onChange={() => patch({ attachmentType: 'FILE', url: '' })}
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
                  onChange={(event) =>
                    handleFileSelect(event.target.files?.[0])
                  }
                />
                <button
                  type="button"
                  disabled={
                    !canEdit || draft.attachmentType !== 'FILE' || isUploading
                  }
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

              <label className="text-xsmall14 text-neutral-0 flex items-center gap-2">
                <input
                  type="radio"
                  name="live-mentoring-question-attachment"
                  checked={draft.attachmentType === 'URL'}
                  disabled={!canEdit}
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
                value={draft.url}
                maxLength={QUESTION_URL_MAX}
                disabled={!canEdit || draft.attachmentType !== 'URL'}
                onChange={(event) => patch({ url: event.target.value })}
                placeholder="https://"
                className="border-neutral-80 text-xsmall14 text-neutral-0 disabled:bg-neutral-95 ml-6 rounded-sm border px-4 py-2.5 disabled:cursor-default"
              />
            </fieldset>

            <label className="text-xsmall14 text-neutral-30 flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.mentorShareAgreed}
                disabled={!canEdit}
                onChange={(event) =>
                  patch({ mentorShareAgreed: event.target.checked })
                }
                className="accent-primary h-4 w-4"
              />
              첨부한 파일이 멘토링 진행을 위해 멘토에게 전달되는 데 동의합니다.
            </label>

            {/*
              서버가 editable 을 false 로 준 경우다. 왜 못 고치는지 적어 두지 않으면
              버튼이 고장 난 것으로 읽힌다.
            */}
            {!canEdit && (
              <p className="text-xxsmall12 text-neutral-45">
                예약 시간 24시간 전이 지나 질문을 수정할 수 없습니다.
              </p>
            )}
            {canEdit && shownQuestionError && (
              <p className="text-xxsmall12 text-system-error">
                {shownQuestionError}
              </p>
            )}
            {saveError && (
              <p className="text-xxsmall12 text-system-error">{saveError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="border-primary text-primary text-xsmall16 flex-1 rounded-sm border py-3 font-medium"
              >
                {hasWrittenQuestion ? '수정 취소' : '닫기'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="bg-primary text-xsmall16 disabled:bg-neutral-80 disabled:text-neutral-40 flex-1 rounded-sm py-3 font-medium text-white"
              >
                {hasWrittenQuestion ? '수정하기' : '저장하기'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
