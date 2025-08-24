'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import MyPageKakaoChannel from '@components/common/mypage/privacy/section/MyPageKakaoChannel';
import BasicInfo from '../../../../components/common/mypage/privacy/section/BasicInfo';
import ChangePassword from '../../../../components/common/mypage/privacy/section/ChangePassword';
import MarketingAgree from '../../../../components/common/mypage/privacy/section/MarketingAgree';
import AlertModal from '../../../../components/ui/alert/AlertModal';
import useAuthStore from '../../../../store/useAuthStore';
import axios from '../../../../utils/axios';

const Privacy = () => {
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  return (
    <main className="flex w-full flex-col gap-16 px-5 pb-16 md:w-4/5">
      <BasicInfo />
      {/* <AccountInfo /> */}
      <ChangePassword />
      <div className="flex w-full flex-col gap-y-6">
        <MyPageKakaoChannel />
        <MarketingAgree />
      </div>
      <button
        className="mt-[24px] flex w-full items-center justify-center text-neutral-0/40"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        회원 탈퇴
      </button>
      {isDeleteModalOpen && (
        <AlertModal
          onConfirm={() => {
            tryDeleteUser();
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
          className="break-keep"
          title="회원 탈퇴"
        >
          정말로 탈퇴하시겠습니까?
          <div className="mt-4 text-sm text-system-error">
            탈퇴 시 복구가 불가능하며, 모든 정보가 삭제됩니다.
          </div>
        </AlertModal>
      )}
    </main>
  );
};

export default Privacy;