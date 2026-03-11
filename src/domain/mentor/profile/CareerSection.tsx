'use client';

import { useState } from 'react';

import {
  useGetUserCareerQuery,
  usePostUserCareerMutation,
  usePatchUserCareerMutation,
} from '@/api/career/career';
import { UserCareerType } from '@/api/career/careerSchema';
import CareerHeader from '@/domain/mypage/career/CareerHeader';
import CareerItem from '@/domain/mypage/career/CareerItem';
import CareerList from '@/domain/mypage/career/CareerList';
import { DEFAULT_CAREER, PAGE_SIZE } from '@/domain/mypage/career/constants';
import NoCareerView from '@/domain/mypage/career/NoCareerView';

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
      <section>
        <h2 className="text-lg font-semibold">경력사항</h2>
        <div className="py-4 text-sm text-gray-400">로딩 중...</div>
      </section>
    );
  }

  return (
    <>
      {isEmpty && !createMode ? (
        <NoCareerView handleCreateNew={handleCreateBtnClick} />
      ) : (
        <section className="flex w-full flex-col gap-3">
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
        </section>
      )}
    </>
  );
}
