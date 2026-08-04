import {
  AdminRefundHistoryParams,
  AdminRefundStatus,
  useAdminRefundHistoryQuery,
  UserRefundHistoryParams,
  useUserRefundHistoryQuery,
} from '@/api/adminRefund';
import RefundHistoryTable from '@/domain/admin/refund/ui/RefundHistoryTable';
import UserRefundTable from '@/domain/admin/refund/ui/UserRefundTable';
import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

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

type Tab = 'admin' | 'user';

const tabs: { id: Tab; label: string }[] = [
  { id: 'admin', label: '어드민 주도 환불' },
  { id: 'user', label: '유저 환불' },
];

function isTab(value: string | null): value is Tab {
  return value === 'admin' || value === 'user';
}

/**
 * 환불 이력.
 *
 * 프로그램별로 흩지 않고 한 화면에서 전체를 본다. "이번 달 예외 환불이 몇 건인가",
 * "한 담당자가 몰아서 처리했나" 같은 질문은 통합 조회로만 답할 수 있다.
 * 프로그램별 조회는 필터로 해결한다.
 *
 * 어드민 주도 환불과 유저 환불은 출처도 컬럼도 다르므로 탭으로 나눈다.
 */
const RefundHistoryPage = () => {
  // 탭 상태를 URL(?tab=)에 둔다. 새로고침해도 보던 탭이 유지된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: Tab = isTab(tabParam) ? tabParam : 'admin';

  const setActiveTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-4">환불 히스토리</h1>

      <nav className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'text-xsmall14 rounded-md border px-4 py-2',
              activeTab === tab.id
                ? 'border-neutral-0 bg-neutral-0 text-white'
                : 'border-neutral-80 text-neutral-40 bg-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'admin' ? <AdminRefundTab /> : <UserRefundTab />}
    </div>
  );
};

const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        className="rounded border border-neutral-300 px-3 py-1 disabled:text-neutral-300"
        onClick={() => onChange(Math.max(0, page - 1))}
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
        onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
        disabled={page >= totalPages - 1}
      >
        다음
      </button>
    </div>
  );
};

const PeriodFilter = ({
  onChange,
}: {
  onChange: (patch: { startDate?: string; endDate?: string }) => void;
}) => (
  <label className="text-sm">
    <span className="mb-1 block text-neutral-500">기간</span>
    <div className="flex items-center gap-1">
      <input
        type="date"
        className="rounded border border-neutral-300 px-2 py-1"
        onChange={(e) =>
          onChange({
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
          onChange({
            endDate: e.target.value ? `${e.target.value}T23:59:59` : undefined,
          })
        }
      />
    </div>
  </label>
);

const ProgramTypeFilter = ({
  onChange,
}: {
  onChange: (programType: string | undefined) => void;
}) => (
  <label className="text-sm">
    <span className="mb-1 block text-neutral-500">프로그램 타입</span>
    <select
      className="rounded border border-neutral-300 px-2 py-1"
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      {PROGRAM_TYPES.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  </label>
);

const KeywordFilter = ({
  onChange,
}: {
  onChange: (keyword: string | undefined) => void;
}) => (
  <label className="text-sm">
    <span className="mb-1 block text-neutral-500">참여자</span>
    <input
      className="rounded border border-neutral-300 px-2 py-1"
      placeholder="이름 또는 이메일"
      onChange={(e) => onChange(e.target.value || undefined)}
    />
  </label>
);

const AdminRefundTab = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<AdminRefundHistoryParams>({});

  const { data, isLoading } = useAdminRefundHistoryQuery({
    ...filters,
    page,
    size: PAGE_SIZE,
  });

  const updateFilter = (patch: AdminRefundHistoryParams) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  };

  return (
    <>
      <p className="mb-4 text-sm text-neutral-500">
        어드민에서 실행한 환불입니다. 사용자가 직접 신청한 환불은 유저 환불 탭에
        있습니다.
      </p>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <PeriodFilter onChange={updateFilter} />
        <ProgramTypeFilter
          onChange={(programType) => updateFilter({ programType })}
        />

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

        <KeywordFilter onChange={(keyword) => updateFilter({ keyword })} />

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

      <Pagination
        page={page}
        totalPages={data?.pageInfo.totalPages ?? 0}
        onChange={setPage}
      />
    </>
  );
};

const UserRefundTab = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<UserRefundHistoryParams>({});

  const { data, isLoading } = useUserRefundHistoryQuery({
    ...filters,
    page,
    size: PAGE_SIZE,
  });

  const updateFilter = (patch: UserRefundHistoryParams) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(0);
  };

  return (
    <>
      {/*
        배치 자동환불은 서버가 유저 환불과 구분할 단서가 없어 유저 환불로 분류된다.
        라벨만으로는 "유저가 직접 취소했다"로 읽히므로 여기서 밝힌다.
      */}
      <p className="mb-4 text-sm text-neutral-500">
        유저가 직접 신청한 환불입니다.
        <br />
        리포트 배치 자동환불과 수동 SQL 처리 건이 함께 표시됩니다.
      </p>

      {/* 담당자·상태 필터는 두지 않는다. 유저 환불에 존재하지 않는 값이다. */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <PeriodFilter onChange={updateFilter} />
        <ProgramTypeFilter
          onChange={(programType) => updateFilter({ programType })}
        />
        <KeywordFilter onChange={(keyword) => updateFilter({ keyword })} />
      </div>

      <UserRefundTable refunds={data?.refundList ?? []} isLoading={isLoading} />

      <Pagination
        page={page}
        totalPages={data?.pageInfo.totalPages ?? 0}
        onChange={setPage}
      />
    </>
  );
};

export default RefundHistoryPage;
