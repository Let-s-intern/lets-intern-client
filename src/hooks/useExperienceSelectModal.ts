import {
  useSearchUserExperiencesQuery,
  useUserExperienceFiltersQuery,
} from '@/api/userExperience';
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
  // 모든 페이지에서 선택된 경험 데이터를 저장하는 Map (id -> ExperienceData)
  const [selectedExperiencesMap, setSelectedExperiencesMap] = useState<
    Map<string, ExperienceData>
  >(new Map());

  // 필터 옵션 조회
  const { data: filterOptions } = useUserExperienceFiltersQuery();

  // API 검색 요청 생성
  const searchRequest = useMemo(() => {
    const request: {
      filter: {
        experienceCategories?: string[];
        activityTypes?: string[];
        years?: number[];
        coreCompetencies?: string[];
      };
      pageable: {
        page: number;
        size: number;
      };
    } = {
      filter: {},
      pageable: {
        page: currentPage - 1, // API는 0부터 시작
        size: pageSize,
      },
    };

    if (filters.category !== '전체') {
      const categoryApiValue = labelToExperienceCategory[filters.category];
      if (categoryApiValue) {
        request.filter.experienceCategories = [categoryApiValue];
      }
    }

    if (filters.type !== '전체') {
      const typeApiValue = labelToActivityType[filters.type];
      if (typeApiValue) {
        request.filter.activityTypes = [typeApiValue];
      }
    }

    if (filters.year !== '전체') {
      request.filter.years = [parseInt(filters.year)];
    }

    if (filters.competency !== '전체') {
      request.filter.coreCompetencies = [filters.competency];
    }

    return request;
  }, [filters, currentPage, pageSize]);

  // 경험 데이터 검색
  const { data: searchResponse, isLoading } = useSearchUserExperiencesQuery(
    searchRequest,
    isOpen,
  );

  // API 응답을 ExperienceData로 변환
  const experiences = useMemo(() => {
    if (!searchResponse?.userExperiences) {
      return [];
    }
    return searchResponse.userExperiences.map(
      convertUserExperienceToExperienceData,
    );
  }, [searchResponse]);

  // selectedRowIds와 현재 페이지 experiences 변경 시 Map 업데이트
  useEffect(() => {
    if (!experiences.length) return;

    setSelectedExperiencesMap((prevMap) => {
      const newMap = new Map(prevMap);

      // 현재 페이지의 모든 경험을 순회
      experiences.forEach((exp) => {
        const expId = String(exp.id);
        const isSelected = selectedRowIds.has(expId);

        if (isSelected) {
          // 선택된 경우 Map에 추가/업데이트
          newMap.set(expId, exp);
        } else {
          // 선택 해제된 경우 Map에서 제거
          newMap.delete(expId);
        }
      });

      return newMap;
    });
  }, [experiences, selectedRowIds]);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 모달이 닫힐 때 선택 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedRowIds(new Set());
      setSelectedExperiencesMap(new Map());
    }
  }, [isOpen]);

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
    // Map의 모든 값들을 배열로 변환
    const allSelectedExperiences = Array.from(selectedExperiencesMap.values());
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
      selectedCount: selectedExperiencesMap.size,
    },
    handleComplete,
  };
};
