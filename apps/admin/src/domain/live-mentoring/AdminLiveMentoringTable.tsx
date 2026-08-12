import { useState } from 'react';
import { Button } from '@mui/material';

import {
  useAdminLiveMentoringListQuery,
  useCloseLiveMentoringOpeningMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringStatus } from '@/api/live-mentoring/liveMentoringSchema';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import ConfirmActionDialog, {
  type PendingAction,
} from './ui/ConfirmActionDialog';
import {
  CATEGORY_LABELS,
  CLOSE_REASON_LABELS,
  durationPricesLabel,
  formatDateTime,
  publicDetailUrl,
  STATUS_CLASSES,
  STATUS_FILTERS,
  STATUS_LABELS,
} from './constants';

const PAGE_SIZE = 20;

const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-neutral-40';
const bodyCellClass = 'px-4 py-3 text-sm text-neutral-10 align-top';

const errorMessage = (error: unknown): string => {
  const apiError = error as { code?: string; message?: string } | null;
  if (!apiError?.message) return '문제가 발생했습니다.';
  return apiError.code
    ? `${apiError.message} (${apiError.code})`
    : apiError.message;
};

/**
 * 관리자 라이브 멘토링 상품 목록.
 *
 * 승인은 멘토가 검토 제출 시 자가승인으로 처리되고, 서버가 같은 트랜잭션에서
 * 개설까지 만든다. 관리자는 별도로 승인·반려하지 않고 조회와 강제 종료만 한다.
 */
const AdminLiveMentoringTable = () => {
  const { snackbar } = useAdminSnackbar();
  const [status, setStatus] = useState<LiveMentoringStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const { data, isLoading, isError } = useAdminLiveMentoringListQuery({
    status,
    page,
    size: PAGE_SIZE,
  });

  const { mutate: closeOpening, isPending: isClosing } =
    useCloseLiveMentoringOpeningMutation();
  const isMutating = isClosing;

  const handleFilterChange = (next: LiveMentoringStatus | undefined) => {
    setStatus(next);
    setPage(1);
  };

  const runPendingAction = () => {
    if (!pendingAction) return;

    closeOpening(pendingAction.openingId, {
      onSuccess: () => {
        snackbar('개설을 종료했습니다.');
        setPendingAction(null);
      },
      onError: (error: unknown) => {
        snackbar(errorMessage(error));
        setPendingAction(null);
      },
    });
  };

  const rows = data?.liveMentoringList ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="상태 필터" className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = status === filter.value;
          return (
            <button
              key={filter.label}
              type="button"
              aria-pressed={active}
              onClick={() => handleFilterChange(filter.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary-10 text-primary'
                  : 'border-neutral-80 text-neutral-40'
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="border-neutral-80 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead className="border-neutral-80 bg-neutral-95 border-b">
            <tr>
              <th className={headerCellClass}>멘토</th>
              <th className={headerCellClass}>상품명</th>
              <th className={headerCellClass}>상태</th>
              <th className={headerCellClass}>타입</th>
              <th className={headerCellClass}>상세</th>
              <th className={headerCellClass}>현재 개설</th>
              <th className={headerCellClass}>최종 수정</th>
              <th className={headerCellClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isError ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  목록을 불러오지 못했습니다.
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  불러오는 중...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  해당 조건의 상품이 없습니다.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const opening = row.currentOpening;
                return (
                  <tr
                    key={row.liveMentoringId}
                    className="border-neutral-90 border-b last:border-b-0"
                  >
                    <td className={bodyCellClass}>
                      <div className="flex items-center gap-2">
                        {row.mentorProfileImage && (
                          <img
                            src={row.mentorProfileImage}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                        )}
                        <span className="whitespace-nowrap">
                          {row.mentorNickname ?? `멘토 #${row.mentorId}`}
                        </span>
                      </div>
                    </td>
                    <td className={`${bodyCellClass} break-keep`}>
                      <div className="flex flex-col gap-0.5">
                        <span>{row.title ?? '-'}</span>
                        {/* 승인 전에도 열린다 — 운영자가 실제 화면을 직접 확인할 수 있다. */}
                        <a
                          href={publicDetailUrl(row.mentorId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary w-fit text-xs underline"
                        >
                          공개 페이지 보기
                        </a>
                      </div>
                    </td>
                    <td className={bodyCellClass}>
                      <span
                        className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[row.status]}`}
                      >
                        {STATUS_LABELS[row.status]}
                      </span>
                    </td>
                    <td className={`${bodyCellClass} whitespace-nowrap`}>
                      {row.categories
                        .map((category) => CATEGORY_LABELS[category])
                        .join(' · ') || '-'}
                    </td>
                    <td className={`${bodyCellClass} whitespace-nowrap`}>
                      {row.hasDetailPage ? '있음' : '없음'}
                    </td>
                    <td className={`${bodyCellClass} whitespace-nowrap`}>
                      {opening ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-neutral-40 text-xs">
                            {durationPricesLabel(opening.durationPrices)}
                          </span>
                          {opening.closeReason && (
                            <span className="text-neutral-40 text-xs">
                              {CLOSE_REASON_LABELS[opening.closeReason]}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-40">없음</span>
                      )}
                    </td>
                    <td className={`${bodyCellClass} whitespace-nowrap`}>
                      {formatDateTime(row.lastModifiedDate)}
                    </td>
                    <td className={bodyCellClass}>
                      <div className="flex flex-wrap gap-2">
                        {opening?.status === 'OPEN' && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            disabled={isMutating}
                            onClick={() =>
                              setPendingAction({
                                type: 'close',
                                row,
                                openingId: opening.openingId,
                              })
                            }
                          >
                            개설 강제 종료
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data && data.pageInfo.totalPages > 1 && (
        <MuiPagination
          pageInfo={{ totalPages: data.pageInfo.totalPages }}
          page={page}
          onChange={(_, next) => setPage(next)}
        />
      )}

      <ConfirmActionDialog
        action={pendingAction}
        isPending={isMutating}
        onCancel={() => setPendingAction(null)}
        onConfirm={runPendingAction}
      />
    </div>
  );
};

export default AdminLiveMentoringTable;
