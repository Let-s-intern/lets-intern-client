'use client';

import { useSearchParams } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useUserProgramQuery } from '@/api/program';
import LoadingContainer from '@/common/loading/LoadingContainer';
import MuiPagination from '@/common/pagination/MuiPagination';
import EmptyCardList from '@/domain/program/programs/card/EmptyCardList';
import LetsconCard, {
  isLetsconCardVisible,
} from '@/domain/program/programs/card/LetsconCard';
import ProgramCard from '@/domain/program/programs/card/ProgramCard';
import { getProgramCardKey } from '@/domain/program/programs/card/programCardIdentity';
import FreeMagnetSection from '@/domain/program/section/FreeMagnetSection';
import { IPageable } from '@/types/interface';
import { PROGRAM_QUERY_KEY } from '@/utils/programConst';

const initialPageInfo = {
  pageNum: 0,
  pageSize: 0,
  totalElements: 0,
  totalPages: 0,
};

const ERROR_MESSAGE =
  "프로그램 조회 중 오류가 발생했습니다.\n새로고침 후에도 문제가 지속되면 아래 '채팅문의'를 통해 문의해주세요.";

const FIRST_SECTION_COUNT = 8;
const FIRST_SECTION_COUNT_MOBILE = 6;
interface ProgramGridProps {
  pageable: IPageable;
  setPageable: Dispatch<SetStateAction<IPageable>>;
  onResetFilter: () => void;
}

const ProgramGrid = ({
  pageable,
  setPageable,
  onResetFilter,
}: ProgramGridProps) => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);

  const {
    isSuccess,
    isFetching,
    isLoading,
    isError,
    data: programData,
  } = useUserProgramQuery({ pageable, searchParams });

  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setPageable((prev) => ({ ...prev, page }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (isLoading || isFetching) setLoading(true);
    setPageInfo(programData?.pageInfo || initialPageInfo);
  }, [isLoading, isFetching, setLoading, setPageInfo, programData?.pageInfo]);

  useEffect(() => {
    const LOADING_DELAY_MS = 300;
    if (loading) {
      const timer = setTimeout(() => setLoading(false), LOADING_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (isError) {
    return <p className="whitespace-pre-line text-center">{ERROR_MESSAGE}</p>;
  }

  if (loading || isLoading || isFetching) {
    return <LoadingContainer text="프로그램 조회 중" />;
  }

  if (isSuccess && programData && programData.programList.length < 1) {
    return <EmptyCardList onReset={onResetFilter} />;
  }

  // 렛츠콘 카드는 필터 없는 전체·모집 중 목록의 첫 페이지에만 붙인다
  const status = searchParams.get(PROGRAM_QUERY_KEY.STATUS) ?? '';
  const showLetscon =
    isLetsconCardVisible() &&
    pageable.page === 1 &&
    (status === '' || status === 'PROCEEDING') &&
    [
      PROGRAM_QUERY_KEY.TYPE,
      PROGRAM_QUERY_KEY.CLASSIFICATION,
      PROGRAM_QUERY_KEY.JOB_CATEGORY,
    ].every((key) => !searchParams.has(key));

  const programList = programData?.programList ?? [];
  // 렛츠콘 카드가 한 칸을 차지하므로 첫 구역을 한 칸 줄여 줄을 맞춘다
  const firstCount = showLetscon
    ? FIRST_SECTION_COUNT - 1
    : FIRST_SECTION_COUNT;
  const firstSection = programList.slice(0, firstCount);
  const secondSection = programList.slice(firstCount);

  return (
    <div className="flex flex-col gap-11">
      <section className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-11 xl:grid-cols-4">
        {showLetscon && <LetsconCard />}
        {firstSection.map((program) => (
          <ProgramCard
            key={getProgramCardKey(program.programInfo)}
            program={program}
          />
        ))}
      </section>

      {pageable.page === 1 && <FreeMagnetSection />}

      {secondSection.length > 0 && (
        <section className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4 md:gap-5">
          {secondSection.map((program) => (
            <ProgramCard
              key={getProgramCardKey(program.programInfo)}
              program={program}
            />
          ))}
        </section>
      )}

      <MuiPagination
        page={pageable.page}
        pageInfo={pageInfo}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default ProgramGrid;
