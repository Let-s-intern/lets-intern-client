import { useAccessLogListQuery } from '@/api/accessLog';
import UsageFilterBar from '@/domain/admin/usage/ui/UsageFilterBar';
import UsageFilterChips from '@/domain/admin/usage/ui/UsageFilterChips';
import UsageHistoryTable from '@/domain/admin/usage/ui/UsageHistoryTable';
import UsagePagination from '@/domain/admin/usage/ui/UsagePagination';
import {
  describeUsageFilters,
  readUsageFilters,
  toAccessLogListParams,
  type UsageFilterKey,
} from '@/domain/admin/usage/utils/usageFilterParams';
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

/**
 * 페이지 번호는 **1 부터 시작한다.**
 *
 * 서버가 `spring.data.web.pageable.one-indexed-parameters: true` 로 떠 있어
 * `page=0` 과 `page=1` 이 **둘 다 첫 페이지**로 접힌다. 0 부터 세면 1페이지와 2페이지가
 * 같은 내용을 보여주는데, 에러가 없어 화면만 봐서는 알아채기 어렵다.
 *
 * 요청 직전에 `+1` 하지 않고 상태 자체를 1 부터 센다. 변환을 한 곳에 두면 다른 경로로
 * 이 API 를 부르는 사람이 그것을 빠뜨리고, 증상은 똑같이 조용하다.
 * 이 레포의 다른 어드민 목록도 1 부터 센다(`BlogRatingTable` 등).
 */
const FIRST_PAGE = 1;

const parsePage = (value: string | null) => {
  const page = Number(value);
  return Number.isInteger(page) && page >= FIRST_PAGE ? page : FIRST_PAGE;
};

const UsageHistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = readUsageFilters(searchParams);
  const page = parsePage(searchParams.get('page'));

  /** 조건이 바뀌면 항상 첫 페이지로 돌아간다. 3페이지를 보던 중이면 빈 결과가 나온다. */
  const updateFilter = (patch: Partial<Record<UsageFilterKey, string>>) => {
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

  const { data, isLoading, isError } = useAccessLogListQuery(
    toAccessLogListParams(filters, page, PAGE_SIZE),
  );

  const appliedFilters = describeUsageFilters(filters);
  const rows = data?.accessLogList ?? [];
  const isEmpty = !isLoading && !isError && rows.length === 0;

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-4">이용 히스토리</h1>

      <p className="text-neutral-40 mb-4 text-sm">
        결제 후 콘텐츠를 이용했는지 기록된 사실만 보여줍니다. 환불 가부는 규정에
        따라 판단해 주세요.
      </p>

      <UsageFilterBar filters={filters} onChange={updateFilter} />

      <UsageFilterChips
        chips={appliedFilters}
        onRemove={(chip) =>
          updateFilter(
            Object.fromEntries(chip.clears.map((key) => [key, ''])) as Partial<
              Record<UsageFilterKey, string>
            >,
          )
        }
      />

      {isError ? (
        /* 못 읽은 것을 "이력 없음"으로 보이게 하지 않는다. 둘은 다르다(PRD 7.4). */
        <p className="text-neutral-40 py-10 text-center text-sm">
          이용 이력을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      ) : (
        <>
          <UsageHistoryTable
            rows={rows}
            trackedFrom={data?.trackedFrom}
            isLoading={isLoading}
          />

          {/*
            0건일 때 걸려 있는 조건을 함께 적는다. "없습니다"로 끝내면 특히 `집계 이전` 을
            걸어 둔 채 본 빈 목록이 "미이용이 없다"로 읽히는데, 정반대의 결론이다.
          */}
          {isEmpty && appliedFilters.length > 0 && (
            <div className="text-neutral-40 mt-2 text-center text-sm">
              <p>아래 조건이 걸려 있습니다. 해제하면 더 많은 건이 보입니다.</p>
              <ul className="mt-1">
                {appliedFilters.map((chip) => (
                  <li key={chip.key}>{chip.label}</li>
                ))}
              </ul>
            </div>
          )}

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
