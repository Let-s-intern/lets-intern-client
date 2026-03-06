'use client';

import { useCallback, useEffect, useState } from 'react';

import { usePatchUser, useUserQuery } from '@/api/user/user';
import { useGetUserCareerQuery } from '@/api/career/career';
import BasicInfo, { type BasicInfoFormData } from './BasicInfo';
import CareerSection from './CareerSection';
import Introduction from './Introduction';

const INITIAL_FORM_DATA: BasicInfoFormData = {
  name: '',
  nickname: '',
  phoneNum: '',
  sns: '',
  email: '',
  profileImgUrl: '',
};

export default function ProfilePage() {
  const { data: user } = useUserQuery();
  const { data: careerData } = useGetUserCareerQuery({ page: 0, size: 100 });

  const [formData, setFormData] = useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [introduction, setIntroduction] = useState('');

  const { mutate: patchUser, isPending } = usePatchUser(
    () => alert('프로필이 저장되었습니다.'),
    () => alert('저장에 실패했습니다.'),
  );

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      name: user.name ?? '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      phoneNum: user.phoneNum ?? '',
      sns: user.sns ?? '',
      profileImgUrl: user.profileImgUrl ?? '',
    }));
    setIntroduction(user.introduction ?? '');
  }, [user]);

  const handleSave = useCallback(() => {
    patchUser({
      name: formData.name || undefined,
      nickname: formData.nickname || null,
      phoneNum: formData.phoneNum || undefined,
      sns: formData.sns || null,
      email: formData.email || undefined,
      introduction: introduction || null,
      profileImgUrl: formData.profileImgUrl || null,
    });
  }, [formData, introduction, patchUser]);

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <h1 className="mb-1 text-2xl font-bold">프로필</h1>
      <hr className="mb-8 border-gray-300" />

      <div className="flex flex-col gap-10">
        <BasicInfo formData={formData} onChange={setFormData} />
        <Introduction value={introduction} onChange={setIntroduction} />
        <CareerSection />
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded bg-gray-200 px-16 py-3 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
}
