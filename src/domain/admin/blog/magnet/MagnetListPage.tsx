'use client';

import ActionButton from '@/domain/admin/ui/button/ActionButton';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useCallback, useMemo, useState } from 'react';
import MagnetCreateModal from './MagnetCreateModal';
import MagnetFilter from './MagnetFilter';
import MagnetTable from './MagnetTable';
import {
  createMagnet,
  deleteMagnet,
  filterMagnetData,
  MagnetListResponse,
  toggleMagnetVisibility,
} from './mock';
import { CreateMagnetReqBody, MagnetFilterValues } from './types';

const INITIAL_FILTER: MagnetFilterValues = {
  magnetId: '',
  type: '',
  titleKeyword: '',
};

interface MagnetListPageProps {
  initialData: MagnetListResponse;
}

const MagnetListPage = ({ initialData }: MagnetListPageProps) => {
  const [filterValues, setFilterValues] =
    useState<MagnetFilterValues>(INITIAL_FILTER);
  const [appliedFilter, setAppliedFilter] =
    useState<MagnetFilterValues>(INITIAL_FILTER);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // TODO: refreshKey는 목 데이터용. React Query 전환 시 invalidateQueries로 교체
  const [refreshKey, setRefreshKey] = useState(0);

  // TODO: API 준비 후 React Query로 교체. 필터 없으면 서버 데이터(initialData) 사용
  const data = useMemo(() => {
    const isFilterActive =
      appliedFilter.magnetId ||
      appliedFilter.type ||
      appliedFilter.titleKeyword;

    if (!isFilterActive && refreshKey === 0) return initialData;

    return filterMagnetData(initialData.magnetList, {
      magnetId: appliedFilter.magnetId,
      type: appliedFilter.type,
      titleKeyword: appliedFilter.titleKeyword,
    });
  }, [initialData, appliedFilter, refreshKey]);

  const handleSearch = () => {
    setAppliedFilter(filterValues);
  };

  const handleShowAll = () => {
    setFilterValues(INITIAL_FILTER);
    setAppliedFilter(INITIAL_FILTER);
  };

  const handleCreate = (body: CreateMagnetReqBody) => {
    // TODO: API 준비 후 useCreateMagnetMutation으로 교체
    createMagnet(body);
    setIsCreateModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleToggleVisibility = useCallback(
    (id: number, isVisible: boolean) => {
      toggleMagnetVisibility(id, isVisible);
      setRefreshKey((k) => k + 1);
    },
    [],
  );

  const handleDelete = useCallback((id: number) => {
    const confirmed = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmed) return;
    deleteMagnet(id);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <div className="mx-6 mb-40 mt-6">
        <Header>
          <Heading>마그넷 관리/등록</Heading>
        </Header>

        <MagnetFilter
          values={filterValues}
          onChange={setFilterValues}
          onSearch={handleSearch}
          onShowAll={handleShowAll}
        />

        <div className="my-4 flex items-center justify-end gap-2">
          <ActionButton
            type="button"
            bgColor="gray"
            width="8rem"
            to="/admin/blog/magnet/0/form/common"
          >
            공통 신청폼 등록
          </ActionButton>
          <ActionButton
            type="button"
            bgColor="blue"
            width="6rem"
            onClick={() => setIsCreateModalOpen(true)}
          >
            마그넷 등록
          </ActionButton>
        </div>

        <main>
          <MagnetTable
            data={data}
            onToggleVisibility={handleToggleVisibility}
            onDelete={handleDelete}
          />
        </main>
      </div>

      <MagnetCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />
    </>
  );
};

export default MagnetListPage;
