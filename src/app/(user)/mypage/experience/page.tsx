'use client';

import {
  useGetAllUserExperienceQuery,
  usePostUserExperienceMutation,
} from '@/api/experience';
import { FilterDropdown } from '@components/common/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';
import { TableHeader } from '@components/common/table/DataTable';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Filters {
  category: string;
  type: string;
  year: string;
  competency: string;
}

const FILTER_OPTIONS = {
  experience: [
    { value: '전체', label: '전체' },
    { value: '프로젝트', label: '프로젝트' },
    { value: '동아리', label: '동아리' },
    { value: '학회', label: '학회' },
    { value: '교육', label: '교육' },
    { value: '공모전', label: '공모전' },
    { value: '기타', label: '기타' },
  ],
  type: [
    { value: '전체', label: '전체' },
    { value: '팀', label: '팀' },
    { value: '개인', label: '개인' },
  ],
  year: [
    { value: '전체', label: '전체' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
  ],
  competency: [
    { value: '전체', label: '전체' },
    { value: '데이터분석', label: '데이터 분석' },
    { value: '프론트엔드', label: '프론트엔드 개발' },
    { value: '백엔드', label: '백엔드 개발' },
    { value: 'UI/UX', label: 'UI/UX 설계' },
    { value: '마케팅', label: '마케팅' },
    { value: '기획', label: '기획' },
  ],
};

const Experience = () => {
  const [filters, setFilters] = useState({
    category: '전체',
    type: '전체',
    year: '전체',
    competency: '전체',
  });

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const { data: userExperienceData } = useGetAllUserExperienceQuery({
    page: 1,
    size: 10,
    sort: [],
  });

  // console.log('userExperienceData: ', userExperienceData);

  const { mutate: postUserExperience } = usePostUserExperienceMutation();

  // useEffect(() => {
  //   // 임시 데이터 추가
  //   postUserExperience({
  //     startDate: '2025-10-29',
  //     endDate: '2025-10-29',
  //     title: '제목',
  //     activityType: 'TEAM',
  //     experienceCategory: 'PROJECT',
  //     role: 'FE',
  //     situation: 'test',
  //     task: 'test',
  //     action: 'test',
  //     result: 'test',
  //     coreCompetency: 'test',
  //     customCategoryName: 'test',
  //     isAdminAdded: true,
  //   });
  // }, []);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const handleDrawerOpen = () => {
    // 드로어 열기 로직 구현
  };

  return (
    <section className="flex w-full flex-col gap-3 px-5 pb-20">
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-semibold">경험 정리 목록</h1>
        <SolidButton onClick={handleDrawerOpen}>경험 작성</SolidButton>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <FilterDropdown
            labelPrefix="경험 분류"
            options={FILTER_OPTIONS.experience}
            selectedValue={filters.category}
            onSelect={(value) => handleFilterChange('category', value)}
            width="min-w-[8.25rem]"
          />
          <FilterDropdown
            labelPrefix="팀·개인"
            options={FILTER_OPTIONS.type}
            selectedValue={filters.type}
            onSelect={(value) => handleFilterChange('type', value)}
            width="min-w-[7.5rem]"
          />
          <FilterDropdown
            labelPrefix="연도"
            options={FILTER_OPTIONS.year}
            selectedValue={filters.year}
            onSelect={(value) => handleFilterChange('year', value)}
            width="min-w-[6.5rem]"
          />
          <FilterDropdown
            labelPrefix="핵심 역량"
            options={FILTER_OPTIONS.competency}
            selectedValue={filters.competency}
            onSelect={(value) => handleFilterChange('competency', value)}
            width="min-w-[8.25rem]"
          />
        </div>
      </div>

      <div className="w-full">
        {/* 기본 테이블 사용 예시 */}
        {/* <DataTable
          headers={experienceTableHeaders}
          data={sampleExperienceData}
          selectedRowIds={selectedRowIds}
          onSelectionChange={setSelectedRowIds}
          className="rounded-lg border"
        /> */}
      </div>
    </section>
  );
};

export default Experience;

const experienceTableHeaders: TableHeader[] = [
  { key: 'experienceName', label: '경험 이름', width: '150px' },
  {
    key: 'experienceCategory',
    label: '경험 분류',
    width: '110px',
  },
  { key: 'organization', label: '기관', width: '150px' },
  {
    key: 'roleAndResponsibilities',
    label: '역할 및 담당 업무',
    width: '150px',
  },
  {
    key: 'teamOrIndividual',
    label: '팀·개인 여부',
    width: '100px',
  },
  { key: 'period', label: '기간', width: '140px' },
  {
    key: 'year',
    label: '연도',
    width: '80px',
  },
  { key: 'situation', label: 'Situation(상황)', width: '200px' },
  { key: 'task', label: 'Task(문제)', width: '200px' },
  { key: 'action', label: 'Action(행동)', width: '200px' },
  { key: 'result', label: 'Result(결과)', width: '200px' },
  { key: 'lessonsLearned', label: '느낀 점 / 배운 점', width: '150px' },
  {
    key: 'coreCompetencies',
    label: '핵심역량',
    width: '140px',
  },
  {
    key: 'deleteAction',
    label: '목록 삭제',
    width: '100px',
  },
];

export interface ExperienceData {
  id: string;
  experienceName: string;
  experienceCategory: string;
  organization: string;
  roleAndResponsibilities: string;
  teamOrIndividual: string;
  period: string;
  year: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  lessonsLearned: string;
  coreCompetencies: string[];
  deleteAction: string;
}

// TODO: props로 variant 등 추가 예정
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const SolidButton = ({ children, onClick }: SolidButtonProps) => {
  return (
    <button
      className="hover:bg-primary-15 flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary"
      onClick={onClick}
    >
      <Plus size={16} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};
