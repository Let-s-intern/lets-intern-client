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
 * 그래서 ID 를 손으로 입력해 액션만 실행하는 영역을 임시로 둔다.
 * **개발·QA 용이고 운영용이 아니다.** 관리자가 검토 대기 상품을 발견할 방법이 없다.
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
 * 3. `AdminLiveMentoringPage.tsx` 의 두 패널 렌더와 import.
 *    탭 구성(`Tabs`)과 `Heading` 은 목록 화면에서도 그대로 쓰므로 남긴다.
 * 4. `__tests__/ManualActionPanel.test.tsx` — 파일 전체.
 *    단 '확인 절차 없이는 요청하지 않는다', '서버 오류 코드를 그대로 노출한다',
 *    '이미 종료된 개설의 재요청을 성공으로 다룬다' 세 케이스는 목록 기반 액션에도
 *    그대로 필요하므로 새 표 테스트로 옮길 만하다.
 * 5. `domain/live-mentoring/liveMentoringActionError.ts` 는 **남긴다** —
 *    목록 기반 액션도 같은 오류 코드를 그대로 노출해야 한다.
 * 6. `api/live-mentoring/liveMentoring.ts` 의 mutation 3종도 **남긴다** — 계약은 그대로다.
 */

import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import {
  useApproveLiveMentoringMutation,
  useCloseLiveMentoringOpeningMutation,
  useRejectLiveMentoringMutation,
} from '@/api/live-mentoring/liveMentoring';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { liveMentoringActionErrorMessage } from './liveMentoringActionError';

// 메인 web 으로 이동하는 외부 링크의 호스트. 미설정 시 admin 자기 자신의 origin 으로 fallback.
const WEB_URL = (import.meta.env.VITE_WEB_URL ?? '').replace(/\/$/, '');

/** 입력값을 양의 정수 ID 로. 비어 있거나 정수가 아니면 null. */
const parseId = (value: string): number | null => {
  const trimmed = value.trim();
  if (!/^[0-9]+$/.test(trimmed)) return null;
  const id = Number(trimmed);
  return id > 0 ? id : null;
};

const inputClassName =
  'text-xsmall14 w-40 rounded border border-neutral-70 px-3 py-2';

const buttonClassName =
  'text-xsmall14 rounded border border-neutral-70 px-3 py-2 disabled:opacity-40';

/** 임시 영역 공통 껍데기. 목록이 아니라는 것이 한눈에 보이도록 점선 테두리 + 안내 문구를 고정한다. */
const TemporaryPanel = ({
  title,
  limitation,
  children,
}: {
  title: string;
  limitation: string;
  children: React.ReactNode;
}) => (
  <Accordion
    defaultExpanded
    disableGutters
    className="mb-4 border border-dashed border-orange-400 shadow-none"
  >
    <AccordionSummary expandIcon={<IoIosArrowDown />}>
      <span className="text-xsmall14 font-semibold">{title}</span>
    </AccordionSummary>
    <AccordionDetails>
      <p className="text-xxsmall12 text-neutral-40 mb-3 leading-relaxed">
        관리자용 목록 조회 API 가 아직 없어 ID 를 직접 입력해 액션만 실행합니다.{' '}
        {limitation}
      </p>
      {children}
    </AccordionDetails>
  </Accordion>
);

/** 상품 ID 직접 입력 → 상세 보기 / 승인 / 반려. */
export const ManualProductActionPanel = () => {
  const [value, setValue] = useState('');
  const { snackbar } = useAdminSnackbar();
  const approve = useApproveLiveMentoringMutation();
  const reject = useRejectLiveMentoringMutation();

  const liveMentoringId = parseId(value);
  const pending = approve.isPending || reject.isPending;

  const handleOpenDetail = () => {
    if (liveMentoringId === null) return;
    window.open(
      `${WEB_URL}/live-mentoring/${liveMentoringId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  const run = async (
    action: '승인' | '반려',
    mutateAsync: (id: number) => Promise<void>,
  ) => {
    if (liveMentoringId === null) return;
    // ID 를 잘못 입력하면 엉뚱한 멘토의 상품이 승인·반려된다. 되돌리는 API 가 없다.
    if (
      !window.confirm(
        `상품 ID ${liveMentoringId} 을(를) ${action}하시겠습니까?\nID 를 잘못 입력하면 다른 상품이 ${action}됩니다.`,
      )
    ) {
      return;
    }

    try {
      await mutateAsync(liveMentoringId);
      snackbar(`상품 ID ${liveMentoringId} 을(를) ${action}했습니다.`);
    } catch (error) {
      snackbar(liveMentoringActionErrorMessage(action, error));
    }
  };

  return (
    <TemporaryPanel
      title="임시 영역 — 상품 ID 직접 입력"
      limitation="검토 대기 상품을 찾는 용도로는 쓸 수 없습니다. 멘토에게 상품 ID 를 전달받아 입력하세요."
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="상품 ID"
          className={inputClassName}
          placeholder="상품 ID"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          className={buttonClassName}
          disabled={liveMentoringId === null}
          onClick={handleOpenDetail}
        >
          상세 보기
        </button>
        <button
          type="button"
          className={buttonClassName}
          disabled={liveMentoringId === null || pending}
          onClick={() => run('승인', approve.mutateAsync)}
        >
          승인
        </button>
        <button
          type="button"
          className={buttonClassName}
          disabled={liveMentoringId === null || pending}
          onClick={() => run('반려', reject.mutateAsync)}
        >
          반려
        </button>
      </div>
    </TemporaryPanel>
  );
};

/** 개설 ID 직접 입력 → 강제 종료. */
export const ManualOpeningActionPanel = () => {
  const [value, setValue] = useState('');
  const { snackbar } = useAdminSnackbar();
  const closeOpening = useCloseLiveMentoringOpeningMutation();

  const openingId = parseId(value);

  const handleClose = async () => {
    if (openingId === null) return;
    // 되돌릴 수 없는 동작이다.
    if (
      !window.confirm(
        `개설 ID ${openingId} 을(를) 강제 종료하시겠습니까?\n종료한 개설은 다시 열 수 없습니다.`,
      )
    ) {
      return;
    }

    try {
      await closeOpening.mutateAsync(openingId);
      // 이미 CLOSED 인 개설의 재요청도 서버가 성공으로 끝낸다 — 실패로 다루지 않는다.
      snackbar(`개설 ID ${openingId} 을(를) 종료했습니다.`);
    } catch (error) {
      snackbar(liveMentoringActionErrorMessage('강제 종료', error));
    }
  };

  return (
    <TemporaryPanel
      title="임시 영역 — 개설 ID 직접 입력"
      limitation="기간이 지났는데 아직 열려 있는 개설을 찾는 용도로는 쓸 수 없습니다. 멘토 오픈 현황의 개설 이력에서 ID 를 전달받아 입력하세요."
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          aria-label="개설 ID"
          className={inputClassName}
          placeholder="개설 ID"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="button"
          className={buttonClassName}
          disabled={openingId === null || closeOpening.isPending}
          onClick={handleClose}
        >
          강제 종료
        </button>
      </div>
    </TemporaryPanel>
  );
};
