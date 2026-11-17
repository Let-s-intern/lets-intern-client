import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import type { LiveMentoringAttachmentType } from '@/api/live-mentoring/liveMentoringSchema';

/** 멘티 제출 내역. 예약 상세(`LiveMentoringDetailBody`)와 참여자 표가 같은 값으로 그린다. */
export interface MenteeSubmissionValue {
  questionDeferred?: boolean | null;
  questionContent?: string | null;
  attachmentType?: LiveMentoringAttachmentType | null;
  attachmentUrl?: string | null;
  mentorShareAgreed?: boolean | null;
}

/** 사전 질문 문구. 미룬 신청과 아직 안 쓴 신청은 다른 상태라 다르게 적는다. */
export const questionText = (value: MenteeSubmissionValue): string => {
  if (value.questionContent) return value.questionContent;
  if (value.questionDeferred) {
    return '멘티가 사전 질문을 나중에 보내겠다고 선택했습니다.';
  }
  return '작성한 사전 질문이 없습니다.';
};

const ATTACHMENT_TYPE_LABELS: Record<LiveMentoringAttachmentType, string> = {
  NONE: '첨부 없음',
  FILE: '파일',
  URL: '링크',
};

/** 제출 내역 요약. 참여자 표의 칸에 그대로 쓴다. */
export const submissionSummary = (value: MenteeSubmissionValue): string => {
  const question = value.questionContent
    ? '질문 있음'
    : value.questionDeferred
      ? '나중에 작성'
      : '질문 없음';
  const hasAttachment =
    value.attachmentType != null &&
    value.attachmentType !== 'NONE' &&
    Boolean(value.attachmentUrl);
  return hasAttachment
    ? `${question} · ${ATTACHMENT_TYPE_LABELS[value.attachmentType as LiveMentoringAttachmentType]} 첨부`
    : question;
};

/**
 * 질문, 첨부, 멘토 공유 동의를 한 덩어리로 보여준다.
 *
 * 어드민은 멘토 공유 동의와 상관없이 첨부를 본다. 운영이 대신 넣은 자료가 멘토에게
 * 보이는지 확인하려면 동의 여부를 함께 봐야 해서 같이 적는다.
 */
export const MenteeSubmissionContent = ({
  value,
}: {
  value: MenteeSubmissionValue;
}) => {
  const attachmentType = value.attachmentType ?? 'NONE';
  const hasAttachment =
    attachmentType !== 'NONE' && Boolean(value.attachmentUrl);

  return (
    <div className="flex flex-col gap-4 text-xsmall14">
      <div className="flex flex-col gap-1.5">
        <span className="text-xxsmall12 font-medium text-neutral-40">
          사전 질문
        </span>
        <p className="whitespace-pre-wrap leading-6 text-neutral-20">
          {questionText(value)}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xxsmall12 font-medium text-neutral-40">
          첨부 ({ATTACHMENT_TYPE_LABELS[attachmentType]})
        </span>
        {hasAttachment ? (
          <a
            href={value.attachmentUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-primary underline"
          >
            {attachmentType === 'FILE' ? '첨부 파일 열기' : value.attachmentUrl}
          </a>
        ) : (
          <span className="text-neutral-20">첨부한 자료가 없습니다.</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xxsmall12 font-medium text-neutral-40">
          멘토 공유 동의
        </span>
        <span className="text-neutral-20">
          {value.mentorShareAgreed
            ? '동의함 (멘토에게 첨부가 보입니다)'
            : '동의 안 함 (멘토에게 첨부가 보이지 않습니다)'}
        </span>
      </div>
    </div>
  );
};

/** 참여자 표에서 여는 제출 내역 창. */
export const MenteeSubmissionDialog = ({
  menteeName,
  value,
  onClose,
}: {
  menteeName: string;
  value: MenteeSubmissionValue;
  onClose: () => void;
}) => (
  <Dialog open onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{menteeName} 님 제출 내역</DialogTitle>
    <DialogContent>
      <MenteeSubmissionContent value={value} />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>닫기</Button>
    </DialogActions>
  </Dialog>
);
