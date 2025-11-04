import { useGetAllUserExperienceQuery } from '@/api/experience';
import {
  ActivityType,
  CategoryType,
  ExperienceFiltersReq,
  Pageable,
} from '@/api/experienceSchema';
import { useUserExperienceFiltersQuery } from '@/api/userExperience';
import {
  convertUserExperienceToExperienceData,
  ExperienceData,
  labelToActivityType,
  labelToExperienceCategory,
} from '@/components/common/challenge/my-challenge/section/mission-submit-list-form/data';
import { useEffect, useMemo, useState } from 'react';

interface Filters {
  category: string;
  type: string;
  year: string;
  competency: string;
}

interface UseExperienceSelectModalOptions {
  isOpen: boolean;
  pageSize?: number;
}

interface UseExperienceSelectModalReturn {
  filters: {
    value: Filters;
    onChange: (filters: Filters) => void;
    options: ReturnType<typeof useUserExperienceFiltersQuery>['data'];
  };
  pagination: {
    currentPage: number;
    totalElements: number;
    totalPages: number;
    handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  };
  data: {
    experiences: ExperienceData[];
    isLoading: boolean;
  };
  selection: {
    selectedRowIds: Set<string>;
    setSelectedRowIds: React.Dispatch<React.SetStateAction<Set<string>>>;
    selectedCount: number;
  };
  handleComplete: (
    onSelectComplete: (selectedExperiences: ExperienceData[]) => void,
    onClose: () => void,
  ) => void;
}

const INITIAL_FILTERS: Filters = {
  category: '전체',
  type: '전체',
  year: '전체',
  competency: '전체',
};

const DEFAULT_PAGE_SIZE = 5;

export const useExperienceSelectModal = ({
  isOpen,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseExperienceSelectModalOptions): UseExperienceSelectModalReturn => {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // 필터 옵션 조회
  const { data: filterOptions } = useUserExperienceFiltersQuery();

  // API 필터 요청 생성
  const experienceFilter = useMemo<ExperienceFiltersReq>(() => {
    const filter: ExperienceFiltersReq = {
      experienceCategories: [],
      activityTypes: [],
      years: [],
      coreCompetencies: [],
    };

    if (filters.category !== '전체') {
      const categoryApiValue = labelToExperienceCategory[filters.category];
      if (categoryApiValue) {
        filter.experienceCategories = [categoryApiValue as CategoryType];
      }
    }

    if (filters.type !== '전체') {
      const typeApiValue = labelToActivityType[filters.type];
      if (typeApiValue) {
        filter.activityTypes = [typeApiValue as ActivityType];
      }
    }

    if (filters.year !== '전체') {
      filter.years = [parseInt(filters.year)];
    }

    if (filters.competency !== '전체') {
      filter.coreCompetencies = [filters.competency];
    }

    return filter;
  }, [filters]);

  // 페이지네이션 요청 생성
  const pageable = useMemo<Pageable>(() => {
    return {
      page: currentPage - 1, // API는 0부터 시작
      size: pageSize,
    };
  }, [currentPage, pageSize]);

  // 경험 데이터 검색
  const { data: searchResponse, isLoading } = useGetAllUserExperienceQuery(
    experienceFilter,
    pageable,
    { enabled: isOpen },
  );

  // API 응답을 ExperienceData로 변환
  const experiences = useMemo(() => {
    if (!searchResponse?.userExperiences) {
      return [];
    }
    return searchResponse.userExperiences.map((exp) =>
      convertUserExperienceToExperienceData(
        exp as Parameters<typeof convertUserExperienceToExperienceData>[0],
      ),
    );
  }, [searchResponse]);

  // 전체 선택된 경험 데이터 (현재 페이지 기준)
  const allSelectedExperiences = useMemo(() => {
    if (!searchResponse?.userExperiences) {
      return [];
    }
    return searchResponse.userExperiences
      .filter((exp) => selectedRowIds.has(String(exp.id)))
      .map((exp) =>
        convertUserExperienceToExperienceData(
          exp as Parameters<typeof convertUserExperienceToExperienceData>[0],
        ),
      );
  }, [searchResponse, selectedRowIds]);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handleComplete = (
    onSelectComplete: (selectedExperiences: ExperienceData[]) => void,
    onClose: () => void,
  ) => {
    onSelectComplete(allSelectedExperiences);
    onClose();
  };

  return {
    filters: {
      value: filters,
      onChange: setFilters,
      options: filterOptions,
    },
    pagination: {
      currentPage,
      totalElements: searchResponse?.totalElements ?? 0,
      totalPages: searchResponse?.totalPages ?? 0,
      handlePageChange,
    },
    data: {
      experiences,
      isLoading,
    },
    selection: {
      selectedRowIds,
      setSelectedRowIds,
      selectedCount: selectedRowIds.size,
    },
    handleComplete,
  };
};
