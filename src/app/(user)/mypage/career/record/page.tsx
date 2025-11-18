'use client';

import {
  useGetUserCareerQuery,
  usePatchUserCareerMutation,
  usePostUserCareerMutation,
} from '@/api/career';
import { UserCareerType } from '@/api/careerSchema';
import {
  convertCareerApiToUiFormat,
  convertCareerUiToApiFormat,
} from '@/utils/career';
import CareerItem from '@components/common/mypage/career/CareerItem';
import NoCareerView from '@components/common/mypage/career/NoCareerView';
import SolidButton from '@components/ui/button/SolidButton';
import { Plus } from 'lucide-react';

import { useState } from 'react';

const initialCareer: UserCareerType = {
  company: '',
  job: '',
  employmentType: null,
  employmentTypeOther: '',
  startDate: '',
  endDate: '',
};

const PAGE_SIZE = 10;

const Career = () => {
  const [createMode, setCreateMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data } = useGetUserCareerQuery({
    page: 1,
    size: PAGE_SIZE,
  });

  const { userCareers, pageInfo } = data ?? {};

  const createCareerMutation = usePostUserCareerMutation();
  const patchCareerMutation = usePatchUserCareerMutation();

  const handleCancel = () => {
    setCreateMode(false);
    setEditingId(null);
  };

  const handleSubmit = async (career: UserCareerType) => {
    const formData = new FormData();
    const careerReq = convertCareerUiToApiFormat(career);

    const requestDto = new Blob([JSON.stringify(careerReq)], {
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

    setCreateMode(false);
    setEditingId(null);
  };

  const handleCreateNew = () => {
    setCreateMode(true);
    setEditingId(null);
  };

  const handleEdit = (id: number) => {
    setCreateMode(false);
    setEditingId(id);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {userCareers?.length === 0 ? (
        // 커리어가 없을 때
        <NoCareerView handleCreateNew={handleCreateNew} />
      ) : (
        // 커리어가 하나 이상 있을 때
        <section className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <header className="text-lg font-medium">
              커리어 기록(경력사항)
            </header>
            {editingId === null && !createMode && (
              <SolidButton
                variant="secondary"
                size="xs"
                icon={<Plus size={16} />}
                onClick={handleCreateNew}
              >
                경력 정보 추가
              </SolidButton>
            )}
          </div>

          {createMode && (
            <CareerItem
              career={initialCareer}
              writeMode={true}
              handleCancel={handleCancel}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
            />
          )}

          {userCareers?.map((career) => (
            <CareerItem
              key={career.id}
              career={convertCareerApiToUiFormat(career)}
              writeMode={editingId === career.id}
              handleCancel={handleCancel}
              handleSubmit={handleSubmit}
              handleEdit={handleEdit}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Career;
