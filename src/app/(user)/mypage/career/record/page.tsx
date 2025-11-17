'use client';

import { UserCareerType } from '@/api/careerSchema';
import CareerItem from '@components/common/mypage/career/CareerItem';
import OutlinedButton from '@components/common/mypage/experience/OutlinedButton';
import SolidButton from '@components/common/mypage/experience/SolidButton';
import { Plus } from 'lucide-react';

import { useState } from 'react';

const initialCareer: UserCareerType = {
  company: '',
  position: '',
  employeeType: null,
  employeeTypeOther: '',
  startDate: '',
  endDate: '',
};

const Career = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [careers, setCareers] = useState<UserCareerType[]>([]);

  const handleCancel = () => {
    setCareers((prev) => prev.slice(1)); // 추후 제거
    setEditingId(null);
  };

  const handleSubmit = (career: UserCareerType) => {
    setCareers((prev) => prev.slice(1)); // 추후 제거
    // TODO: API 연동 예정 (생성 후 재조회)
    setCareers((prev) => [career, ...prev]);
    setEditingId(null);
  };

  const handleCreateNew = () => {
    const randomId = crypto.randomUUID();
    setCareers((prev) => [{ ...initialCareer, id: randomId }, ...prev]);
    setEditingId(randomId);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  return (
    <div className="flex w-full flex-col items-center">
      {careers.length === 0 ? (
        // 커리어가 없을 때
        <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
          <div className="flex flex-col items-center text-sm text-neutral-20">
            <p>아직 등록된 커리어가 없어요.</p>
            <p>지금까지의 경력을 기록해두면, 서류 준비가 훨씬 쉬워져요.</p>
          </div>
          <OutlinedButton onClick={handleCreateNew} className="w-fit">
            커리어 기록하기
          </OutlinedButton>
        </section>
      ) : (
        // 커리어가 하나 이상 있을 때
        <section className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <header className="text-lg font-medium">
              커리어 기록(경력사항)
            </header>
            {editingId === null && (
              <SolidButton icon={<Plus size={16} />} onClick={handleCreateNew}>
                경력 정보 추가
              </SolidButton>
            )}
          </div>
          {careers.map((career) => (
            <CareerItem
              key={career.id}
              career={career}
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
