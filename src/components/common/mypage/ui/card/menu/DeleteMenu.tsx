import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MdMoreVert } from 'react-icons/md';
import { FiMinusCircle } from 'react-icons/fi';

import AlertModal from '../../../../../ui/alert/AlertModal';
import axios from '../../../../../../utils/axios';
import { ApplicationType } from '../../../../../../pages/common/mypage/Application';

interface DeleteMenuProps {
  className?: string;
  application: ApplicationType;
}

const DeleteMenu = ({ className, application }: DeleteMenuProps) => {
  const queryClient = useQueryClient();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isDeleteMenuOpen, setIsDeleteMenuOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const deleteApplication = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/application/${application.id}`, {
        params: { type: application.programType.toUpperCase() },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['application'] });
      setIsAlertModalOpen(false);
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
          title="프로그램 신청 취소"
        >
          정말로 신청을 취소하시겠습니까?
        </AlertModal>
      )}
    </div>
  );
};

export default DeleteMenu;
