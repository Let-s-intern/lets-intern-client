'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { usePatchUser, useUserQuery } from '@/api/user/user';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import mentorConfig from '../constants/config';
import BasicInfo, { type BasicInfoFormData } from './ui/BasicInfo';
import CareerSection from './ui/CareerSection';
import Introduction from './ui/Introduction';

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

  const [formData, setFormData] = useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [introduction, setIntroduction] = useState('');

  // 서버에서 받아온 원본 데이터를 저장
  const [savedFormData, setSavedFormData] =
    useState<BasicInfoFormData>(INITIAL_FORM_DATA);
  const [savedIntroduction, setSavedIntroduction] = useState('');

  const { mutate: patchUser, isPending } = usePatchUser(
    () => {
      // 저장 성공 시 원본 데이터 갱신
      setSavedFormData(formData);
      setSavedIntroduction(introduction);
      alert(mentorConfig.profile.saveSuccess);
    },
    () => alert(mentorConfig.profile.saveFail),
  );

  useEffect(() => {
    if (!user) return;
    const data: BasicInfoFormData = {
      name: user.name ?? '',
      nickname: user.nickname ?? '',
      email: user.email ?? '',
      phoneNum: user.phoneNum ?? '',
      sns: user.sns ?? '',
      profileImgUrl: user.profileImgUrl ?? '',
    };
    setFormData(data);
    setSavedFormData(data);

    const intro = user.introduction ?? '';
    setIntroduction(intro);
    setSavedIntroduction(intro);
  }, [user]);

  const hasUnsavedChanges = useMemo(() => {
    const isFormChanged =
      formData.name !== savedFormData.name ||
      formData.nickname !== savedFormData.nickname ||
      formData.phoneNum !== savedFormData.phoneNum ||
      formData.sns !== savedFormData.sns ||
      formData.email !== savedFormData.email ||
      formData.profileImgUrl !== savedFormData.profileImgUrl;
    const isIntroChanged = introduction !== savedIntroduction;
    return isFormChanged || isIntroChanged;
  }, [formData, savedFormData, introduction, savedIntroduction]);

  useUnsavedChangesWarning(
    hasUnsavedChanges,
    mentorConfig.profile.unsavedWarning,
  );

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
    <div className="mx-auto max-w-3xl px-0 py-4 md:px-8 md:py-8">
      <h1 className="mb-1 text-2xl font-bold">프로필</h1>
      <hr className="mb-8 border-gray-200" />

      <div className="flex flex-col gap-10">
        <BasicInfo formData={formData} onChange={setFormData} />
        <Introduction value={introduction} onChange={setIntroduction} />
        <CareerSection />
      </div>

      {/* Floating save button */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
          hasUnsavedChanges
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-primary px-16 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
}
