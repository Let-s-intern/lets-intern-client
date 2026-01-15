import {
  useSearchUserExperiencesQuery,
  useUserExperienceFiltersQuery,
} from '@/api/userExperience';
import {
  convertUserExperienceToExperienceData,
  ExperienceData,
  isUserExperienceComplete,
  labelToActivityType,
  labelToExperienceCategory,
} from '@/domain/challenge/my-challenge/section/mission-submit-list-form/data';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface Filters {
  category: string;
  activityType: string;
  year: string;
  competency: string[];
}

interface UseExperienceSelectModalOptions {
  isOpen: boolean;
  pageSize?: number;
  initialSelectedExperienceIds?: number[];
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
  activityType: '전체',
  year: '전체',
  competency: [],
};

const DEFAULT_PAGE_SIZE = 5;

export const useExperienceSelectModal = ({
  isOpen,
  pageSize = DEFAULT_PAGE_SIZE,
  initialSelectedExperienceIds,
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

  // 모든 데이터를 가져오기 위한 요청 (필터링 전 전체 데이터)
  const allDataRequest = useMemo(() => {
    const request: {
      experienceCategories?: string[];
      activityTypes?: string[];
      years?: number[];
      coreCompetencies?: string[];
      sortType?: 'LATEST' | 'OLDEST' | 'RECENTLY_EDITED';
      page: number;
      size: number;
    } = {
      page: 1,
      size: 1000, // 충분히 큰 값으로 모든 데이터 가져오기
      sortType: 'LATEST' as const,
    };

    if (filters.category !== '전체') {
      const categoryApiValue = labelToExperienceCategory[filters.category];
      if (categoryApiValue) {
        request.experienceCategories = [categoryApiValue];
      }
    }

    if (filters.activityType !== '전체') {
      const typeApiValue = labelToActivityType[filters.activityType];
      if (typeApiValue) {
        request.activityTypes = [typeApiValue];
      }
    }

    if (filters.year !== '전체') {
      request.years = [parseInt(filters.year)];
    }

    if (filters.competency.length > 0) {
      request.coreCompetencies = filters.competency;
    }

    return request;
  }, [filters]);

  // 모든 경험 데이터 검색 (필터링 전)
  const { data: allSearchResponse, isLoading } = useSearchUserExperiencesQuery(
    allDataRequest,
    isOpen,
  );

  // 필터링된 모든 경험 데이터 (클라이언트 필터링 적용)
  const allFilteredExperiences = useMemo(() => {
    if (!allSearchResponse?.userExperiences) {
      return [];
    }

    const filtered = allSearchResponse.userExperiences.filter(
      isUserExperienceComplete,
    );

    return filtered.map(convertUserExperienceToExperienceData);
  }, [allSearchResponse]);

  // 필터링된 결과를 페이지네이션하여 현재 페이지의 데이터만 추출
  const experiences = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allFilteredExperiences.slice(startIndex, endIndex);
  }, [allFilteredExperiences, currentPage, pageSize]);

  // 필터링된 결과의 총 개수와 페이지 수
  const filteredTotalElements = allFilteredExperiences.length;
  const filteredTotalPages = Math.ceil(filteredTotalElements / pageSize);

  // selectedRowIds와 현재 페이지 experiences 변경 시 Map 업데이트
  useEffect(() => {
    if (!experiences.length) return;

    setSelectedExperiencesMap((prevMap) => {
      const newMap = new Map(prevMap);

      // 현재 페이지의 모든 경험을 순회
      experiences.forEach((exp) => {
        // originalId를 String으로 변환하여 ID로 사용 (DataTable과 일치)
        const expId = String(exp.originalId);
        const isSelected = selectedRowIds.has(expId);

        if (isSelected) {
          // 선택된 경우 Map에 추가/업데이트
          newMap.set(expId, exp);
        }
        // 선택 해제된 경우는 onSelectionChange에서 처리하므로 여기서는 제거하지 않음
        // 다른 페이지에서 선택한 항목이 Map에서 제거되지 않도록 보장
      });

      return newMap;
    });
  }, [experiences, selectedRowIds]);

  // selectedRowIds에서 제거된 항목을 Map에서도 제거
  useEffect(() => {
    setSelectedExperiencesMap((prevMap) => {
      const newMap = new Map(prevMap);
      let hasChanges = false;

      // Map에 있지만 selectedRowIds에 없는 항목 제거
      newMap.forEach((_, expId) => {
        if (!selectedRowIds.has(expId)) {
          newMap.delete(expId);
          hasChanges = true;
        }
      });

      return hasChanges ? newMap : prevMap;
    });
  }, [selectedRowIds]);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 모달이 열릴 때 초기 선택 상태 설정
  useEffect(() => {
    if (!isOpen || !initialSelectedExperienceIds?.length) {
      return;
    }

    // 경험 데이터가 로드되지 않았으면 대기
    if (!allFilteredExperiences.length) {
      return;
    }

    // initialSelectedExperienceIds에 해당하는 경험들을 찾아서 선택 상태로 설정
    const initialSelectedIds = new Set<string>();
    const initialSelectedMap = new Map<string, ExperienceData>();

    allFilteredExperiences.forEach((exp) => {
      if (initialSelectedExperienceIds.includes(exp.originalId)) {
        const expId = String(exp.originalId);
        initialSelectedIds.add(expId);
        initialSelectedMap.set(expId, exp);
      }
    });

    setSelectedRowIds(initialSelectedIds);
    setSelectedExperiencesMap(initialSelectedMap);
  }, [isOpen, initialSelectedExperienceIds, allFilteredExperiences]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    },
    [],
  );

  const handleComplete = (
    onSelectComplete: (selectedExperiences: ExperienceData[]) => void,
    onClose: () => void,
  ) => {
    // Map의 모든 값들을 배열로 변환
    const allSelectedExperiences = Array.from(selectedExperiencesMap.values());
    onSelectComplete(allSelectedExperiences);
    onClose();
  };

  const pagination = useMemo(
    () => ({
      currentPage,
      totalElements: filteredTotalElements,
      totalPages: filteredTotalPages,
      handlePageChange,
    }),
    [currentPage, filteredTotalElements, filteredTotalPages, handlePageChange],
  );

  return {
    filters: {
      value: filters,
      onChange: setFilters,
      options: filterOptions,
    },
    pagination,
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
