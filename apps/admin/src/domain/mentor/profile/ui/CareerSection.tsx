import { useState } from 'react';

import {
  useGetUserCareerQuery,
  usePostUserCareerMutation,
  usePatchUserCareerMutation,
} from '@/api/career/career';
import { UserCareerType } from '@/api/career/careerSchema';
import CareerHeader from '@/common/career/CareerHeader';
import CareerItem from '@/common/career/CareerItem';
import CareerList from '@/common/career/CareerList';
import { DEFAULT_CAREER, PAGE_SIZE } from '@/common/career/constants';
import NoCareerView from '@/common/career/NoCareerView';

export default function CareerSection() {
  const [createMode, setCreateMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const createCareerMutation = usePostUserCareerMutation();
  const patchCareerMutation = usePatchUserCareerMutation();
  const { data, isLoading } = useGetUserCareerQuery({
    page: 0,
    size: PAGE_SIZE,
  });

  const { userCareers } = data ?? {};

  const handleCloseForm = () => {
    setCreateMode(false);
    setEditingId(null);
  };

  const handleSubmitForm = async (career: UserCareerType) => {
    const formData = new FormData();
    const requestDto = new Blob([JSON.stringify(career)], {
      type: 'application/json',
    });
    formData.append('requestDto', requestDto);

    if (editingId === null) {
      await createCareerMutation.mutateAsync(formData);
    } else {
      await patchCareerMutation.mutateAsync({
        careerId: editingId,
        careerData: formData,
      });
    }

    handleCloseForm();
  };

  const handleCreateBtnClick = () => {
    setCreateMode(true);
    setEditingId(null);
  };

  const handleEditBtnClick = (id: number) => {
    setCreateMode(false);
    setEditingId(id);
  };

  const isEmpty = userCareers?.length === 0;

  if (isLoading) {
    return (
      <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
        <h2 className="text-base font-semibold text-gray-900">경력사항</h2>
        <div className="py-4 text-sm text-gray-400">로딩 중...</div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
      {isEmpty && !createMode ? (
        <NoCareerView handleCreateNew={handleCreateBtnClick} />
      ) : (
        <div className="flex w-full flex-col gap-3">
          <CareerHeader
            showCreateButton={editingId === null && !createMode}
            handleCreateBtnClick={handleCreateBtnClick}
          />

          {createMode && (
            <CareerItem
              career={DEFAULT_CAREER}
              writeMode
              handleCancel={handleCloseForm}
              handleSubmit={handleSubmitForm}
              handleEdit={handleEditBtnClick}
            />
          )}

          <CareerList
            editingId={editingId}
            handleCancel={handleCloseForm}
            handleSubmit={handleSubmitForm}
            handleEdit={handleEditBtnClick}
          />
        </div>
      )}
    </section>
  );
}
