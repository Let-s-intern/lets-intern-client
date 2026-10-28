import { useAdminMentorApplicationDetailQuery } from '@/api/mentor-application/mentorApplication';
import {
  CONTACT_METHOD_LABEL,
  JOB_FIELD_LABEL,
  MENTOR_APPLICATION_STATUS_LABEL,
  MENTORING_TYPE_LABEL,
  type AdminMentorApplicationDetail,
} from '@/api/mentor-application/mentorApplicationSchema';
import dayjs from '@/lib/dayjs';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState, type ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { formatPhoneNum } from '../utils/formatPhoneNum';
import MentorApplicationMemo from './MentorApplicationMemo';

const DATE_TIME_FORMAT = 'YYYY.MM.DD HH:mm';
const UNSAVED_MEMO_MESSAGE = '저장하지 않은 운영 메모가 있습니다. 닫을까요?';

interface Props {
  applicationId: number;
  onClose: () => void;
}

export default function MentorApplicationDialog({
  applicationId,
  onClose,
}: Props) {
  const { data: application, isLoading } =
    useAdminMentorApplicationDetailQuery(applicationId);

  // null 이면 손대지 않은 상태. 저장된 메모를 그대로 보여준다
  const [memoDraft, setMemoDraft] = useState<string | null>(null);
  const savedMemo = application?.adminMemo ?? '';
  const memo = memoDraft ?? savedMemo;
  const isMemoDirty = memo !== savedMemo;

  const handleClose = () => {
    if (isMemoDirty && !window.confirm(UNSAVED_MEMO_MESSAGE)) return;
    onClose();
  };

  return (
    <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="border-neutral-80 border-b">
        {application ? `${application.name}님 신청서` : '신청서'}
      </DialogTitle>
      <IconButton
        aria-label="닫기"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 10, top: 12 }}
      >
        <IoCloseOutline size={20} />
      </IconButton>
      <DialogContent>
        {isLoading ? (
          <p className="text-xsmall14 text-neutral-40 py-10 text-center">
            불러오는 중...
          </p>
        ) : application ? (
          <ApplicationDetail
            application={application}
            memo={
              <MentorApplicationMemo
                applicationId={applicationId}
                value={memo}
                isDirty={isMemoDirty}
                onChange={setMemoDraft}
                onSaved={() => setMemoDraft(null)}
              />
            }
          />
        ) : (
          <p className="text-xsmall14 text-neutral-40 py-10 text-center">
            신청서를 불러오지 못했습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ApplicationDetail({
  application,
  memo,
}: {
  application: AdminMentorApplicationDetail;
  memo: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 pt-4">
      <div className="flex flex-col gap-1">
        <p className="text-small18 text-neutral-0 font-semibold">
          {application.name}
        </p>
        <p className="text-xsmall14 text-neutral-30">
          {application.company} · {application.jobTitle} ·{' '}
          {application.yearsOfExperience}년차
        </p>
        <p className="text-xsmall14 text-neutral-40">
          {formatPhoneNum(application.phoneNum)} · {application.email} ·{' '}
          {dayjs(application.submittedAt).format(DATE_TIME_FORMAT)} 신청
        </p>
        <p className="text-xsmall14 text-neutral-40">
          신청 현황 {MENTOR_APPLICATION_STATUS_LABEL[application.status]}
          {application.expectedReplyDate
            ? ` · 예상 회신일 ${dayjs(application.expectedReplyDate).format('YYYY.MM.DD')}`
            : ''}
        </p>
      </div>

      {memo}

      <Section title="선호 연락 수단">
        {application.preferredContactMethods
          .map((method) => CONTACT_METHOD_LABEL[method])
          .join(', ')}
      </Section>

      <Section title="멘토링 가능 직무 분야">
        <Chips labels={application.jobFields.map((f) => JOB_FIELD_LABEL[f])} />
      </Section>

      <Section title="가능한 멘토링 형태">
        <Chips
          labels={application.mentoringTypes.map(
            (type) => MENTORING_TYPE_LABEL[type],
          )}
        />
      </Section>

      <Section title="이력 소개">
        <p className="whitespace-pre-wrap">{application.introduction || '-'}</p>
      </Section>

      <Section title="전하고 싶은 말씀">
        <p className="whitespace-pre-wrap">{application.motivation || '-'}</p>
      </Section>

      <Section title="첨부 · 링크">
        <div className="flex flex-col gap-1">
          {application.attachmentUrl ? (
            <a
              href={application.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline transition hover:text-blue-300"
            >
              {application.attachmentName || '이력서 · 포트폴리오'} PDF 열기
            </a>
          ) : (
            <span className="text-neutral-40">첨부 없음</span>
          )}
          {application.snsLinks.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-blue-500 underline transition hover:text-blue-300"
            >
              {link}
            </a>
          ))}
        </div>
      </Section>

      <Section title="기타">
        <p>
          개인정보 수집 동의{' '}
          {application.privacyAgreedAt
            ? dayjs(application.privacyAgreedAt).format(DATE_TIME_FORMAT)
            : '-'}
        </p>
        <p>
          {application.userId
            ? `회원 연결 (userId ${application.userId})`
            : '비회원 신청'}
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xsmall14 text-neutral-0 font-semibold">{title}</h3>
      <div className="text-xsmall14 text-neutral-30">{children}</div>
    </div>
  );
}

function Chips({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="border-neutral-80 text-xsmall14 text-neutral-30 rounded-full border px-3 py-1.5"
        >
          {label}
        </span>
      ))}
    </div>
  );
}
