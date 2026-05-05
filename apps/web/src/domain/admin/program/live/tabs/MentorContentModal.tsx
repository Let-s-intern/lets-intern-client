'use client';

import { useGetLiveMentorContentQuery } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';

interface MentorContentModalProps {
  liveId: number;
  password: string;
  onClose: () => void;
}

/**
 * PRD-서면라이브 분리 §5.4 — 멘토 전달 내용 미리보기 모달.
 *
 * `useGetLiveMentorContentQuery` 의 응답은 `mentorNotificationSchema` 로 파싱되며,
 * `liveMentorVo` (제목/멘토명/줌링크/시간) + `questionList`/`motivateList`/`reviewList`
 * 가 들어온다. 멘토에게 발송되는 텍스트를 그대로 보여주므로 XSS 위험을 피하기 위해
 * `<pre className="whitespace-pre-wrap">` 으로 평문 렌더한다 (HTML injection 금지).
 */
const MentorContentModal = ({
  liveId,
  password,
  onClose,
}: MentorContentModalProps) => {
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading, isError, error } = useGetLiveMentorContentQuery({
    liveId,
    password,
    enabled: Boolean(password) && Number.isFinite(liveId) && liveId > 0,
  });

  const handleCopy = async () => {
    if (!data) return;
    const text = stringifyMentorContent(data);
    try {
      await window.navigator.clipboard.writeText(text);
      snackbar('멘토 전달 내용을 복사했습니다.');
    } catch {
      snackbar('복사에 실패했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="멘토 전달 내용"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-[640px] max-w-[90vw] overflow-hidden rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-neutral-80 flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-medium16 text-neutral-0 font-semibold">
            멘토 전달 내용 미리보기
          </h2>
          <button
            type="button"
            className="text-xsmall14 text-neutral-30"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="max-h-[60vh] overflow-auto px-6 py-4">
          {isLoading ? (
            <div className="text-xsmall14 text-neutral-40 py-10 text-center">
              불러오는 중...
            </div>
          ) : isError ? (
            <div className="text-xsmall14 text-system-error py-10 text-center">
              멘토 전달 내용을 불러오지 못했습니다.
              {error instanceof Error ? ` (${error.message})` : null}
            </div>
          ) : data ? (
            <pre className="text-xsmall14 text-neutral-10 whitespace-pre-wrap break-words font-sans">
              {stringifyMentorContent(data)}
            </pre>
          ) : null}
        </div>

        <footer className="border-neutral-80 flex items-center justify-end gap-2 border-t px-6 py-3">
          <button
            type="button"
            className="border-neutral-70 text-xsmall14 rounded border px-3 py-1.5"
            onClick={handleCopy}
            disabled={!data}
          >
            복사
          </button>
          <button
            type="button"
            className="bg-primary text-xsmall14 rounded px-3 py-1.5 text-white"
            onClick={onClose}
          >
            닫기
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MentorContentModal;

type MentorContent = ReturnType<
  typeof import('@/schema').mentorNotificationSchema.parse
>;

/**
 * 안전한 평문 직렬화. XSS 방지를 위해 절대 HTML 로 렌더하지 않는다.
 */
function stringifyMentorContent(data: MentorContent): string {
  const lines: string[] = [];
  const vo = data.liveMentorVo;

  lines.push('[프로그램 정보]');
  if (vo.title) lines.push(`- 제목: ${vo.title}`);
  if (vo.mentorName) lines.push(`- 멘토: ${vo.mentorName}`);
  if (vo.participationCount != null)
    lines.push(`- 참여자 수: ${vo.participationCount}`);
  if (vo.zoomLink) lines.push(`- 줌 링크: ${vo.zoomLink}`);
  if (vo.zoomPassword) lines.push(`- 줌 비밀번호: ${vo.zoomPassword}`);
  if (vo.place) lines.push(`- 장소: ${vo.place}`);
  if (vo.startDate)
    lines.push(`- 시작: ${formatDate(vo.startDate)}`);
  if (vo.endDate) lines.push(`- 종료: ${formatDate(vo.endDate)}`);

  if (data.questionList.length > 0) {
    lines.push('', '[질문]');
    data.questionList.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  }
  if (data.motivateList.length > 0) {
    lines.push('', '[지원 동기]');
    data.motivateList.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
  }
  if (data.reviewList.length > 0) {
    lines.push('', '[리뷰]');
    data.reviewList.forEach((r, i) =>
      lines.push(
        `${i + 1}. [${r.questionType ?? '-'}] ${r.answer ?? ''}`,
      ),
    );
  }

  return lines.join('\n');
}

function formatDate(d: ReturnType<typeof dayjs> | null): string {
  if (!d) return '-';
  return d.format('YYYY-MM-DD HH:mm');
}
