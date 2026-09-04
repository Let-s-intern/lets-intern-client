'use client';

import { useEffect } from 'react';

import type { LiveMentoringAttachmentType } from '@/api/live-mentoring/liveMentoringSchema';

interface Props {
  menteeName?: string;
  questionContent?: string | null;
  attachmentType?: LiveMentoringAttachmentType;
  attachmentUrl?: string | null;
  onClose: () => void;
}

/**
 * 멘토가 멘티의 제출물을 읽는 모달.
 *
 * 멘티용 `QuestionModal` 을 읽기 전용으로 재사용하지 않는다. 세 가지가 어긋난다 —
 * 질문 조회 API(`GET .../question`)는 신청자 본인만 통과시켜 멘토에게 401 을 주고,
 * 문구가 전부 멘티 시점("멘토에게 궁금한 점을 작성해 주세요")이며, 라디오·업로드
 * 버튼은 열람에 쓰이지 않는다.
 *
 * 대신 입장 조회 응답이 이미 들고 있는 값으로 그린다. 첨부 URL 은 **서버가 공유
 * 동의 여부를 보고 가려서** 내려주므로(`GetLiveMentoringEntryResponseDto.from`)
 * 화면에서 다시 판정하지 않는다 — 여기서 한 번 더 따지면 서버가 규칙을 바꿨을 때
 * 두 곳이 어긋난다.
 */
const MenteeSubmissionModal = ({
  menteeName,
  questionContent,
  attachmentType = 'NONE',
  attachmentUrl,
  onClose,
}: Props) => {
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

  const question = questionContent?.trim() ?? '';
  const hasAttachment = attachmentType !== 'NONE';

  return (
    <div
      className="bg-neutral-0/50 fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-mentoring-submission-title"
        onClick={(event) => event.stopPropagation()}
        className="bg-static-100 flex max-h-[90dvh] w-full flex-col gap-5 overflow-y-auto rounded-t-xl px-5 py-6 md:max-w-[720px] md:rounded-xl md:px-8"
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="live-mentoring-submission-title"
            className="text-small18 md:text-small20 text-neutral-0 font-bold"
          >
            {menteeName ? `${menteeName} 님의 제출물` : '멘티 제출물'}
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

        <div className="flex flex-col gap-1.5">
          <span className="text-xsmall14 text-neutral-0 font-medium">
            멘토링 질문
          </span>
          {question ? (
            <p className="bg-neutral-95 text-xsmall14 text-neutral-0 whitespace-pre-wrap rounded-sm px-4 py-3">
              {question}
            </p>
          ) : (
            <p className="bg-neutral-95 text-xsmall14 text-neutral-45 rounded-sm px-4 py-3">
              작성된 질문이 없습니다.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xsmall14 text-neutral-0 font-medium">
            전달 파일
          </span>
          {/*
            첨부가 있다고 링크까지 오는 것은 아니다 — 멘티가 공유에 동의하지 않으면
            서버가 attachmentType 만 주고 url 은 가린다. 그 상태에서 "없음"이라고
            적으면 멘티가 내지 않은 것으로 읽히므로 사유를 구분해서 적는다.
          */}
          {!hasAttachment ? (
            <p className="text-xsmall14 text-neutral-45">
              첨부한 파일이 없습니다.
            </p>
          ) : attachmentUrl ? (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xsmall14 text-primary font-medium underline"
            >
              {attachmentType === 'URL' ? '첨부 링크 열기' : '첨부 파일 열기'}
            </a>
          ) : (
            <p className="text-xsmall14 text-neutral-45">
              멘티가 자료 공유에 동의하지 않아 열람할 수 없습니다.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-small16 bg-primary text-static-100 min-h-[52px] w-full rounded-md font-semibold"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default MenteeSubmissionModal;
