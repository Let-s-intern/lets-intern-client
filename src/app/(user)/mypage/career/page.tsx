'use client';

import { UserCareerType } from '@/api/careerSchema';
import CareerCard from '@components/common/mypage/career/CareerCard';
import CareerForm from '@components/common/mypage/career/CareerForm';
import OutlinedButton from '@components/common/mypage/experience/OutlinedButton';
import SolidButton from '@components/common/mypage/experience/SolidButton';
import { Plus } from 'lucide-react';

import { useState } from 'react';

const Career = () => {
  const [writeMode, setWriteMode] = useState(false);
  const [careers, setCareers] = useState<UserCareerType[]>([]);

  const handleCancel = () => {
    setWriteMode(false);
  };

  const handleSubmit = (career: UserCareerType) => {
    setCareers((prev) => [...prev, career]);
    setWriteMode(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-3">
      {careers.length === 0 ? (
        <>
          <div className="flex flex-col items-center text-sm text-neutral-20">
            <p>아직 등록된 커리어가 없어요.</p>
            <p>지금까지의 경력을 기록해두면, 서류 준비가 훨씬 쉬워져요.</p>
          </div>
          <OutlinedButton onClick={() => setWriteMode(true)}>
            커리어 기록하기
          </OutlinedButton>
        </>
      ) : (
        <section className="flex w-full flex-col gap-3">
          <div className="flex items-center justify-between">
            <header className="text-lg font-medium">
              커리어 기록(경력사항)
            </header>
            <SolidButton
              icon={<Plus size={16} />}
              onClick={() => setWriteMode(true)}
            >
              경력 정보 추가
            </SolidButton>
          </div>
          {careers.map((career, idx) => (
            <CareerCard key={idx} career={career} />
          ))}
        </section>
      )}

      {writeMode && (
        <section className="flex h-full w-full flex-col gap-3">
          <CareerForm handleCancel={handleCancel} handleSubmit={handleSubmit} />
        </section>
      )}
    </div>
  );
};

export default Career;
