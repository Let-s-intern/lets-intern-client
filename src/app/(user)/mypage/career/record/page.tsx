'use client';

import {
  useGetUserCareerQuery,
  usePatchUserCareerMutation,
  usePostUserCareerMutation,
} from '@/api/career';
import { UserCareerType } from '@/api/careerSchema';
import CareerHeader from '@components/common/mypage/career/CareerHeader';
import CareerItem from '@components/common/mypage/career/CareerItem';
import CareerList from '@components/common/mypage/career/CareerList';
import {
  DEFAULT_CAREER,
  PAGE_SIZE,
} from '@components/common/mypage/career/constants';
import NoCareerView from '@components/common/mypage/career/NoCareerView';
import { useState } from 'react';

const Career = () => {
  const [createMode, setCreateMode] = useState(false); // 신규 작성 모드
  const [editingId, setEditingId] = useState<number | null>(null); // 수정 중인 커리어 ID

  const createCareerMutation = usePostUserCareerMutation();
  const patchCareerMutation = usePatchUserCareerMutation();
  const { data } = useGetUserCareerQuery({
    page: 1,
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
};

export default Career;
