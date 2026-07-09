'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import MyPageKakaoChannel from '@/domain/mypage/privacy/section/MyPageKakaoChannel';
import { DangerConfirmDialog } from '@letscareer/ui';
import BasicInfo from '../../../../domain/mypage/privacy/section/BasicInfo';
import ChangePassword from '../../../../domain/mypage/privacy/section/ChangePassword';
import MarketingAgree from '../../../../domain/mypage/privacy/section/MarketingAgree';
import useAuthStore from '../../../../store/useAuthStore';
import axios from '../../../../utils/axios';

const PrivacyContent = () => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { logout } = useAuthStore();
  const { mutate: tryDeleteUser } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete('/user');
      return res.data;
    },
    onSuccess: () => {
      logout();
      router.push('/');
    },
    onError: (error) => {
      alert('회원 탈퇴에 실패했습니다.');
      console.error(error);
    },
  });

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    tryDeleteUser();
  };

  return (
    <main className="flex w-full flex-col gap-16 md:w-4/5">
      <BasicInfo />
      {/* <AccountInfo /> */}
      <ChangePassword />
      <div className="flex w-full flex-col gap-y-6">
        <MyPageKakaoChannel />
        <MarketingAgree />
      </div>
      <button
        className="text-neutral-0/40 mt-[24px] flex w-full items-center justify-center"
        onClick={handleDeleteClick}
      >
        회원 탈퇴
      </button>
      <DangerConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="회원 탈퇴 하시겠어요?"
        description="탈퇴 시 계정 및 활동 내역이 복구되지 않습니다."
        confirmLabel="탈퇴"
        requireTypedConfirmation="회원탈퇴"
        onConfirm={handleConfirm}
      />
    </main>
  );
};

const Privacy = () => {
  return (
    <AsyncBoundary>
      <PrivacyContent />
    </AsyncBoundary>
  );
};

export default Privacy;
