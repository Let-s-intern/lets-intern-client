import { useMutation } from '@tanstack/react-query';
import AccountInfo from '../../../components/common/mypage/privacy/section/AccountInfo';
import BasicInfo from '../../../components/common/mypage/privacy/section/BasicInfo';
import ChangePassword from '../../../components/common/mypage/privacy/section/ChangePassword';
import MarketingAgree from '../../../components/common/mypage/privacy/section/MarketingAgree';
import axios from '../../../utils/axios';
import useAuthStore from '../../../store/useAuthStore';
import UserDeleteModal from '../../../components/common/mypage/ui/modal/UserDeleteModal';
import { useState } from 'react';

const Privacy = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { logout } = useAuthStore();
  const { mutate: tryDeleteUser } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete('/user');
      return res.data;
    },
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      alert('회원 탈퇴에 실패했습니다.');
      console.error(error);
    },
  });

  return (
    <main className="flex w-full flex-col gap-16 pb-16 md:w-4/5">
      <BasicInfo />
      <AccountInfo />
      <ChangePassword />
      <MarketingAgree />
      <button
        className="mt-[24px] flex w-full items-center justify-center text-neutral-0/40"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        회원 탈퇴
      </button>
      {isDeleteModalOpen && <UserDeleteModal toggle={() => setIsDeleteModalOpen(false)} />}

    </main>
    
  );
};

export default Privacy;
