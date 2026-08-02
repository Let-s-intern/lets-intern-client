/**
 * 임시 코드 — 관리자용 목록 API 가 붙으면 **이 파일을 통째로 삭제**할 것.
 *
 * ── 왜 있는가 ────────────────────────────────────────────────
 * 승인·반려·강제 종료 세 API 는 모두 path parameter 로 식별자를 받는데,
 * 관리자가 그 식별자를 얻을 목록 API 가 서버에 없다
 * (`LiveMentoringV1AdminController` 에 `@GetMapping` 이 하나도 없다).
 * 공개 목록(`GET /live-mentoring`)은 `APPROVED` + `OPEN` + 신청 기간 내로 거르므로
 * 정작 관리자가 봐야 하는 검토 대기 상품과 기간 만료 미종료 개설이 전부 빠진다.
 *
 * 그래서 **멘토를 골라 식별자를 해석하는** 영역을 임시로 둔다.
 * 어드민에 이미 있는 멘토 목록(`useAdminUserMentorListQuery`)에서 멘토를 고르고,
 * 공개 상세(`GET /live-mentoring/mentors/{mentorId}`)로 상품·개설 ID 를 얻는다.
 * 이 경로가 성립하는 이유는 `useLiveMentoringByMentorQuery` 주석에 적어 두었다.
 *
 * ── 그래도 남는 한계 (숨기지 말 것) ───────────────────────────
 * 1. **검토 대기 상품을 "발견" 할 수 없다.** 멘토를 하나씩 확인해야 한다.
 *    누가 제출했는지는 이 화면 밖에서 알아야 한다.
 * 2. 공개 상세 응답에 상품 상태가 없어 **승인 가능 여부를 미리 알 수 없다.**
 *    눌러야 409 로 알게 된다.
 * 두 한계 모두 아래 안내 문구에 그대로 적는다. 쓸 만해 보이는데 실제로는
 * 대상을 못 찾는 상황이 제일 나쁘다.
 *
 * ── 언제 지우는가 (해제 조건) ─────────────────────────────────
 * 관리자용 상품 목록 API(`GET /api/v1/admin/live-mentoring?status=&page=&size=`)와
 * 그 응답의 `currentOpening` 이 실서버에 배포되면 즉시.
 * 요청 문서는 `.claude/tasks/memos/be-request-라이브멘토링-관리자개설목록-*.md`.
 *
 * ── 무엇을 지우는가 (제거 대상) ───────────────────────────────
 * 1. 이 파일 (`domain/live-mentoring/ManualActionPanel.tsx`)
 * 2. `domain/live-mentoring/PendingListTable.tsx` — 데이터 소스가 없다는 안내와
 *    빈 표 뼈대. 실제 목록 표로 갈아끼운다.
 * 3. `AdminLiveMentoringPage.tsx` 의 패널 렌더와 import.
 *    탭 구성(`Tabs`)과 `Heading` 은 목록 화면에서도 그대로 쓰므로 남긴다.
 * 4. `__tests__/ManualActionPanel.test.tsx` — 파일 전체.
 *    단 '확인 절차 없이는 요청하지 않는다', '서버 오류 코드를 그대로 노출한다',
 *    '이미 종료된 개설의 재요청을 성공으로 다룬다' 세 케이스는 목록 기반 액션에도
 *    그대로 필요하므로 새 표 테스트로 옮길 만하다.
 * 5. `api/live-mentoring/liveMentoring.ts` 의 `useLiveMentoringByMentorQuery` 와
 *    `mentorLiveMentoringSchema` — 식별자 해석은 목록 API 가 대신하므로 함께 지운다.
 * 6. `domain/live-mentoring/liveMentoringActionError.ts` 는 **남긴다** —
 *    목록 기반 액션도 같은 오류 코드를 그대로 노출해야 한다.
 * 7. `api/live-mentoring/liveMentoring.ts` 의 mutation 3종도 **남긴다** — 계약은 그대로다.
 */

import { useMemo, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import {
  useApproveLiveMentoringMutation,
  useCloseLiveMentoringOpeningMutation,
  useLiveMentoringByMentorQuery,
  useRejectLiveMentoringMutation,
} from '@/api/live-mentoring/liveMentoring';
import { useAdminUserMentorListQuery } from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { liveMentoringActionErrorMessage } from './liveMentoringActionError';

// 메인 web 으로 이동하는 외부 링크의 호스트. 미설정 시 admin 자기 자신의 origin 으로 fallback.
const WEB_URL = (import.meta.env.VITE_WEB_URL ?? '').replace(/\/$/, '');

/** 멘토 목록은 페이징 없이 한 번에 받는다 — 기존 `AdminMentorPage` 와 같은 방식. */
const MENTOR_PAGE_SIZE = 1000;

const buttonClassName =
  'text-xsmall14 rounded border border-neutral-70 px-3 py-2 disabled:opacity-40';

const ManualActionPanel = () => {
  const [keyword, setKeyword] = useState('');
  const [mentorId, setMentorId] = useState<number | null>(null);
  const { snackbar } = useAdminSnackbar();

  const { data: mentorData } = useAdminUserMentorListQuery({
    page: 1,
    size: MENTOR_PAGE_SIZE,
  });
  const mentors = useMemo(() => mentorData?.mentorList ?? [], [mentorData]);

  const filtered = useMemo(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return mentors;
    return mentors.filter((mentor) =>
      `${mentor.name ?? ''} ${mentor.nickname ?? ''}`
        .toLowerCase()
        .includes(trimmed),
    );
  }, [mentors, keyword]);

  const selectedMentor = mentors.find((mentor) => mentor.id === mentorId);
  const mentorLabel = selectedMentor
    ? `${selectedMentor.name}${selectedMentor.nickname ? ` (${selectedMentor.nickname})` : ''}`
    : '';

  const {
    data: resolved,
    isLoading,
    isError,
    error: resolveError,
  } = useLiveMentoringByMentorQuery(mentorId);

  const approve = useApproveLiveMentoringMutation();
  const reject = useRejectLiveMentoringMutation();
  const closeOpening = useCloseLiveMentoringOpeningMutation();
  const pending =
    approve.isPending || reject.isPending || closeOpening.isPending;

  const handleOpenDetail = () => {
    if (!resolved) return;
    window.open(
      `${WEB_URL}/live-mentoring/${resolved.liveMentoringId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const runProductAction = async (
    action: '승인' | '반려',
    mutateAsync: (id: number) => Promise<void>,
  ) => {
    if (!resolved) return;
    // 되돌리는 API 가 없다. 대상을 이름과 상품명으로 다시 확인시킨다.
    if (
      !window.confirm(
        `${mentorLabel} 멘토의 "${resolved.title}" 을(를) ${action}하시겠습니까?`,
      )
    ) {
      return;
    }

    try {
      await mutateAsync(resolved.liveMentoringId);
      snackbar(`${mentorLabel} 멘토의 상품을 ${action}했습니다.`);
    } catch (error) {
      snackbar(liveMentoringActionErrorMessage(action, error));
    }
  };

  const handleCloseOpening = async () => {
    if (!resolved?.openingId) return;
    // 되돌릴 수 없는 동작이다.
    if (
      !window.confirm(
        `${mentorLabel} 멘토의 "${resolved.title}" 개설을 강제 종료하시겠습니까?\n종료한 개설은 다시 열 수 없습니다.`,
      )
    ) {
      return;
    }

    try {
      await closeOpening.mutateAsync(resolved.openingId);
      // 이미 CLOSED 인 개설의 재요청도 서버가 성공으로 끝낸다 — 실패로 다루지 않는다.
      snackbar(`${mentorLabel} 멘토의 개설을 종료했습니다.`);
    } catch (error) {
      snackbar(liveMentoringActionErrorMessage('강제 종료', error));
    }
  };

  return (
    <Accordion
      defaultExpanded
      disableGutters
      className="mb-4 border border-dashed border-orange-400 shadow-none"
    >
      <AccordionSummary expandIcon={<IoIosArrowDown />}>
        <span className="text-xsmall14 font-semibold">
          임시 영역 — 멘토를 골라 승인·반려·강제 종료
        </span>
      </AccordionSummary>
      <AccordionDetails>
        <p className="text-xxsmall12 text-neutral-40 mb-3 leading-relaxed">
          관리자용 목록 조회 API 가 아직 없어 멘토를 하나씩 골라 확인합니다.{' '}
          <b>검토 대기 상품을 찾아내는 용도로는 쓸 수 없습니다</b> — 누가
          제출했는지는 이 화면 밖에서 알아야 합니다. 상품 상태도 조회되지 않아
          승인 가능 여부는 눌러봐야 알 수 있습니다.
        </p>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            aria-label="멘토 검색"
            className="text-xsmall14 border-neutral-70 w-48 rounded border px-3 py-2"
            placeholder="이름·닉네임 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            aria-label="멘토 선택"
            className="text-xsmall14 border-neutral-70 w-64 rounded border px-3 py-2"
            value={mentorId ?? ''}
            onChange={(e) =>
              setMentorId(e.target.value ? Number(e.target.value) : null)
            }
          >
            <option value="">멘토를 선택하세요</option>
            {filtered.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name}
                {mentor.nickname ? ` (${mentor.nickname})` : ''}
              </option>
            ))}
          </select>
        </div>

        {mentorId !== null && isLoading && (
          <p className="text-xsmall14 text-neutral-40">상품을 불러오는 중...</p>
        )}

        {mentorId !== null && !isLoading && isError && (
          <p role="alert" className="text-xsmall14 text-system-error">
            {liveMentoringActionErrorMessage('상품 조회', resolveError)}
          </p>
        )}

        {mentorId !== null && !isLoading && !isError && resolved === null && (
          <p className="text-xsmall14 text-neutral-40">
            이 멘토는 아직 상세 페이지를 저장하지 않았습니다. 상세를 저장해야
            검토를 제출할 수 있으므로 승인 대상이 아닙니다.
          </p>
        )}

        {resolved && (
          <div className="flex flex-col gap-3">
            <dl className="text-xsmall14 text-neutral-20 flex flex-wrap gap-x-6 gap-y-1">
              <div className="flex gap-1">
                <dt className="text-neutral-40">상품명</dt>
                <dd className="font-medium">{resolved.title}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-neutral-40">상품 ID</dt>
                <dd>{resolved.liveMentoringId}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-neutral-40">현재 개설</dt>
                <dd>
                  {resolved.openingId === null
                    ? '없음'
                    : `개설 ID ${resolved.openingId}`}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={buttonClassName}
                onClick={handleOpenDetail}
              >
                상세 보기
              </button>
              <button
                type="button"
                className={buttonClassName}
                disabled={pending}
                onClick={() => runProductAction('승인', approve.mutateAsync)}
              >
                승인
              </button>
              <button
                type="button"
                className={buttonClassName}
                disabled={pending}
                onClick={() => runProductAction('반려', reject.mutateAsync)}
              >
                반려
              </button>
              <button
                type="button"
                className={buttonClassName}
                disabled={pending || resolved.openingId === null}
                onClick={handleCloseOpening}
              >
                강제 종료
              </button>
            </div>
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ManualActionPanel;
