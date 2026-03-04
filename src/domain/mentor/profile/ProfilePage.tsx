'use client';

import { useCallback, useEffect, useState } from 'react';

import { useUserQuery } from '@/api/user/user';
import BasicInfo, { BasicInfoFormData } from './BasicInfo';
import CareerSection, { Career } from './CareerSection';
import Introduction from './Introduction';

const INITIAL_FORM_DATA: BasicInfoFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  sns: '',
  email: '',
};

export default function ProfilePage() {
  const { data: user } = useUserQuery();

  const [formData, setFormData] = useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [introduction, setIntroduction] = useState('');
  const [careers, setCareers] = useState<Career[]>([
    {
      company: '',
      field: '',
      position: '',
      department: '',
      startDate: '',
      endDate: '',
    },
  ]);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.name ?? '',
      email: user.email ?? '',
      phoneNum: user.phoneNum ?? '',
    }));
  }, [user]);

  const handleSave = useCallback(() => {
    alert('프로필 저장 기능은 준비 중입니다');
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="mb-1 text-2xl font-bold">Profile</h1>
      <hr className="mb-8 border-gray-300" />

      <div className="flex flex-col gap-10">
        <BasicInfo formData={formData} onChange={setFormData} />
        <Introduction value={introduction} onChange={setIntroduction} />
        <CareerSection careers={careers} onChange={setCareers} />
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={handleSave}
          className="rounded bg-gray-200 px-16 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
