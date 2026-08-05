import {
  AdminRefundHistoryParams,
  AdminRefundStatus,
  useAdminRefundHistoryQuery,
} from '@/api/adminRefund';
import RefundHistoryTable from '@/domain/admin/refund/ui/RefundHistoryTable';
import { useState } from 'react';

const PAGE_SIZE = 20;

const PROGRAM_TYPES = [
  { value: '', label: '전체' },
  { value: 'CHALLENGE', label: '챌린지' },
  { value: 'LIVE', label: '라이브' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD' },
];

const STATUSES: { value: '' | AdminRefundStatus; label: string }[] = [
  { value: '', label: '전체' },
  { value: 'SUCCESS', label: '성공' },
  { value: 'FAILED', label: '실패' },
];

/**
 * 어드민 주도 전액 환불 이력.
 *
 * 프로그램별로 흩지 않고 한 화면에서 전체를 본다. "이번 달 예외 환불이 몇 건인가",
 * "한 담당자가 몰아서 처리했나" 같은 질문은 통합 조회로만 답할 수 있다.
 * 프로그램별 조회는 필터로 해결한다.
 *
 * 유저가 스스로 한 환불은 기록되지 않는다.
 */
const RefundHistoryPage = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<AdminRefundHistoryParams>({});

  const { data, isLoading } = useAdminRefundHistoryQuery({
    ...filters,
    page,
    size: PAGE_SIZE,
  });

  const totalPages = data?.pageInfo.totalPages ?? 0;

  const updateFilter = (patch: AdminRefundHistoryParams) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-1">전액 환불 히스토리</h1>
      <p className="mb-4 text-sm text-neutral-500">
        어드민에서 실행한 전액 환불만 기록됩니다. 사용자가 직접 신청한 환불은
        포함되지 않습니다.
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">기간</span>
          <div className="flex items-center gap-1">
            <input
              type="date"
              className="rounded border border-neutral-300 px-2 py-1"
              onChange={(e) =>
                updateFilter({
                  startDate: e.target.value
                    ? `${e.target.value}T00:00:00`
                    : undefined,
                })
              }
            />
            <span>~</span>
            <input
              type="date"
              className="rounded border border-neutral-300 px-2 py-1"
              onChange={(e) =>
                updateFilter({
                  endDate: e.target.value
                    ? `${e.target.value}T23:59:59`
                    : undefined,
                })
              }
            />
          </div>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">프로그램 타입</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1"
            onChange={(e) =>
              updateFilter({ programType: e.target.value || undefined })
            }
          >
            {PROGRAM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">담당자</span>
          <input
            className="rounded border border-neutral-300 px-2 py-1"
            placeholder="이름 일부"
            onChange={(e) =>
              updateFilter({ managerName: e.target.value || undefined })
            }
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">참여자</span>
          <input
            className="rounded border border-neutral-300 px-2 py-1"
            placeholder="이름 또는 이메일"
            onChange={(e) =>
              updateFilter({ keyword: e.target.value || undefined })
            }
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">상태</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1"
            onChange={(e) =>
              updateFilter({
                status: (e.target.value || undefined) as
                  | AdminRefundStatus
                  | undefined,
              })
            }
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <RefundHistoryTable
        logs={data?.refundLogList ?? []}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
          >
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
            onClick={() =>
              setPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={page >= totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default RefundHistoryPage;
