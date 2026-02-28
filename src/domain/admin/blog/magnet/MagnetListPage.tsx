'use client';

import {
  useCreateMagnetMutation,
  useDeleteMagnetMutation,
  useGetMagnetListQuery,
} from '@/api/magnet/magnet';
import ActionButton from '@/domain/admin/ui/button/ActionButton';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import MagnetCreateModal from './MagnetCreateModal';
import MagnetFilter from './MagnetFilter';
import MagnetTable from './MagnetTable';
import { toggleMagnetVisibility } from './mock';
import { CreateMagnetReqBody, MagnetFilterValues, MagnetTypeKey } from './types';

const INITIAL_FILTER: MagnetFilterValues = {
  magnetId: '',
  type: '',
  titleKeyword: '',
};

const MagnetListPage = () => {
  const [filterValues, setFilterValues] =
    useState<MagnetFilterValues>(INITIAL_FILTER);
  const [appliedFilter, setAppliedFilter] =
    useState<MagnetFilterValues>(INITIAL_FILTER);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: createMagnetMutate } = useCreateMagnetMutation();
  const { mutate: deleteMagnet } = useDeleteMagnetMutation();

  // React Query로 마그넷 목록 조회 (타입/키워드 필터는 서버에서 처리)
  const { data: queryData } = useGetMagnetListQuery({
    typeList: appliedFilter.type
      ? [appliedFilter.type as MagnetTypeKey]
      : undefined,
    keyword: appliedFilter.titleKeyword || undefined,
  });

  // magnetId 필터는 API 미지원 → 클라이언트 사이드 필터링
  const data = useMemo(() => {
    if (!queryData) return { magnetList: [] };
    if (!appliedFilter.magnetId) return queryData;

    const ids = appliedFilter.magnetId
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      magnetList: queryData.magnetList.filter((m) =>
        ids.includes(String(m.magnetId)),
      ),
    };
  }, [queryData, appliedFilter.magnetId]);

  const handleSearch = () => {
    setAppliedFilter(filterValues);
  };

  const handleShowAll = () => {
    setFilterValues(INITIAL_FILTER);
    setAppliedFilter(INITIAL_FILTER);
  };

  const invalidateMagnetList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['MagnetListQueryKey'] });
  }, [queryClient]);

  const handleCreate = (body: CreateMagnetReqBody) => {
    createMagnetMutate(body);
    setIsCreateModalOpen(false);
  };

  const handleToggleVisibility = useCallback(
    (id: number, isVisible: boolean) => {
      // TODO: API 준비 후 mutation으로 교체
      toggleMagnetVisibility(id, isVisible);
      invalidateMagnetList();
    },
    [invalidateMagnetList],
  );

  const handleDelete = useCallback(
    (id: number) => {
      const confirmed = window.confirm('정말로 삭제하시겠습니까?');
      if (!confirmed) return;
      deleteMagnet(id);
    },
    [deleteMagnet],
  );

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
