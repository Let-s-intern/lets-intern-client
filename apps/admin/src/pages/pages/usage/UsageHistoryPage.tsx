import { useAccessLogListQuery } from '@/api/accessLog';
import { PROGRAM_TYPE_OPTIONS } from '@/domain/admin/usage/constants/programType';
import UsageHistoryTable from '@/domain/admin/usage/ui/UsageHistoryTable';
import UsagePagination from '@/domain/admin/usage/ui/UsagePagination';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 유저 콘텐츠 이용 이력 조회 (LC-3201, PRD 7.3).
 *
 * 환불 실행 전에 운영자가 이용 여부를 확인하는 화면이다.
 * 화면은 환불 가부를 판정하지 않고 기록된 사실만 보여준다.
 *
 * 필터와 페이지를 URL 에 둔다. 운영이 조건을 잡아 놓고 새로고침하거나
 * 링크를 공유했을 때 같은 화면이 나와야 한다.
 */

const PAGE_SIZE = 20;

const parsePage = (value: string | null) => {
  const page = Number(value);
  return Number.isInteger(page) && page >= 0 ? page : 0;
};

const UsageHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const programType = searchParams.get('programType') ?? '';
  const userKeyword = searchParams.get('userKeyword') ?? '';
  const page = parsePage(searchParams.get('page'));

  // 입력 중에는 URL 을 건드리지 않는다. 타자마다 조회가 나가면 서버를 계속 때린다.
  const [keywordInput, setKeywordInput] = useState(userKeyword);

  // 뒤로 가기로 조건이 바뀌면 입력칸도 그 조건을 보여줘야 한다.
  useEffect(() => setKeywordInput(userKeyword), [userKeyword]);

  /** 조건이 바뀌면 항상 첫 페이지로 돌아간다. 3페이지를 보던 중이면 빈 결과가 나온다. */
  const updateFilter = (patch: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const changePage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(nextPage));
    setSearchParams(next, { replace: true });
  };

  const { data, isLoading, isError } = useAccessLogListQuery({
    programType: programType || undefined,
    userKeyword: userKeyword || undefined,
    page,
    size: PAGE_SIZE,
  });

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-4">이용 히스토리</h1>

      <p className="mb-4 text-sm text-neutral-500">
        결제 후 콘텐츠를 이용했는지 기록된 사실만 보여줍니다. 환불 가부는 규정에
        따라 판단해 주세요.
      </p>

      <form
        className="mb-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          updateFilter({ userKeyword: keywordInput.trim() });
        }}
      >
        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">프로그램 타입</span>
          <select
            className="rounded border border-neutral-300 px-2 py-1"
            value={programType}
            onChange={(e) => updateFilter({ programType: e.target.value })}
          >
            <option value="">전체</option>
            {PROGRAM_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-neutral-500">유저</span>
          <input
            className="rounded border border-neutral-300 px-2 py-1"
            placeholder="이름 또는 이메일"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="rounded border border-neutral-300 px-3 py-1 text-sm"
        >
          검색
        </button>
      </form>

      {isError ? (
        /* 못 읽은 것을 "이력 없음"으로 보이게 하지 않는다. 둘은 다르다(PRD 7.4). */
        <p className="py-10 text-center text-sm text-neutral-500">
          이용 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : (
        <>
          <UsageHistoryTable
            rows={data?.accessLogList ?? []}
            trackedFrom={data?.trackedFrom}
            isLoading={isLoading}
          />

          <UsagePagination
            page={page}
            totalPages={data?.pageInfo.totalPages ?? 0}
            onChange={changePage}
          />
        </>
      )}
    </div>
  );
};

export default UsageHistoryPage;
