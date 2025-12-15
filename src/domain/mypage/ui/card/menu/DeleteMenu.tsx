import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { FiMinusCircle } from 'react-icons/fi';
import { MdMoreVert } from 'react-icons/md';
import { MypageApplication } from '../../../../../api/application';
import AlertModal from '../../../../../common/alert/AlertModal';
import axios from '../../../../../utils/axios';

interface DeleteMenuProps {
  className?: string;
  application: MypageApplication;
  refetch?: () => void;
}

const DeleteMenu = ({ className, application, refetch }: DeleteMenuProps) => {
  const queryClient = useQueryClient();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const deleteApplication = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/application/${application.id}`, {
        params: { type: application.programType?.toUpperCase() },
      });
      return res.data;
    },
    onSuccess: async () => {
      if (refetch) {
        window.location.reload();
      }
      await queryClient.invalidateQueries({ queryKey: ['application'] });
      setIsAlertModalOpen(false);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const handleDeleteMenuClick = () => {
    setIsDeleteMenuOpen(!isDeleteMenuOpen);
  };

  const handleDeleteButtonClick = () => {
    setIsAlertModalOpen(true);
  };

  const handleAlertCancel = () => {
    setIsAlertModalOpen(false);
  };

  const handleAlertConfirm = () => {
    deleteApplication.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsDeleteMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={clsx('relative flex items-center justify-center', className)}
    >
      <div
        onClick={handleDeleteMenuClick}
        className="cursor-pointer text-[1.125rem] text-neutral-45"
      >
        <MdMoreVert />
      </div>
      {isDeleteMenuOpen && (
        <div
          className="absolute -bottom-2 right-0 flex w-[6.5rem] translate-y-full cursor-pointer items-center gap-1 rounded-xs bg-white px-4 py-3 text-sm text-neutral-0 text-opacity-[60%] shadow-04"
          onClick={handleDeleteButtonClick}
        >
          <span>신청 취소</span>
          <span>
            <FiMinusCircle />
          </span>
        </div>
      )}
      {isAlertModalOpen && (
        <AlertModal
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertCancel}
          className="break-keep"
          title="프로그램 신청 취소"
        >
          신청한 프로그램을 취소하시면,
          <br />
          신청 시에 작성했던 정보가 모두 삭제됩니다.
          <br />
          그래도 취소하시겠습니까?
          <div className="mt-4 text-sm text-system-error">
            *결제금액 입금을 완료하신 경우,
            <br />
            자주 묻는 질문 내 환불 신청서를 제출해주세요!
          </div>
        </AlertModal>
      )}
    </div>
  );
};

export default DeleteMenu;
