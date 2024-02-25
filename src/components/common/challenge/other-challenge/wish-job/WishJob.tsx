import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { wishJobToText } from '../../../../../utils/convert';
import axios from '../../../../../utils/axios';
import { MdEdit } from 'react-icons/md';

interface Props {
  dashboard: any;
  wishJobList: any;
}

const WishJob = ({ dashboard, wishJobList }: Props) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [value, setValue] = useState(dashboard.wishJob);

  const editWishJob = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/application/${params.applicationId}/challenge`,
        {
          wishJob: value,
        },
      );
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setIsEditMode(false);
    },
  });

  const handleWishJobEdit = (e: React.FormEvent) => {
    e.preventDefault();
    editWishJob.mutate();
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
    setValue(dashboard.wishJob);
  };

  const handleMenuItemClicked = (wishJob: string) => {
    setValue(wishJob);
    setIsMenuOpen(false);
  };

  return (
    <div className="mt-3">
      {isEditMode ? (
        <form className="flex items-center gap-3" onSubmit={handleWishJobEdit}>
          <div className="relative">
            <div
              className="flex min-w-[8rem] cursor-pointer items-center justify-between gap-2 rounded border border-[#9D9D9D] py-2 pl-3 pr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="text-sm font-medium">
                {wishJobToText[value] || '전체'}
              </span>
              <i>
                <IoMdArrowDropdown />
              </i>
            </div>
            {isMenuOpen && (
              <div className="absolute left-0 top-10 w-[10rem] rounded border border-[#9D9D9D] bg-white text-sm shadow-lg">
                <ul>
                  {wishJobList.map((wishJob: any) => (
                    <li
                      key={wishJob}
                      className="cursor-pointer px-3 py-2 transition-all hover:bg-neutral-200"
                      onClick={() => handleMenuItemClicked(wishJob)}
                    >
                      {wishJobToText[wishJob]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <button
              type="submit"
              className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white"
            >
              확인
            </button>
            <button
              type="button"
              className="rounded-lg bg-neutral-500 px-3 py-2 text-sm font-medium text-white"
              onClick={handleEditCancel}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-3 flex items-center gap-1">
          <span className="rounded-lg bg-[#D9D9D9] px-2 py-1 text-xs font-medium text-black">
            {wishJobToText[dashboard.wishJob]}
          </span>
          {dashboard.mine && (
            <i
              className="cursor-pointer text-xl"
              onClick={() => setIsEditMode(true)}
            >
              <MdEdit />
            </i>
          )}
        </div>
      )}
    </div>
  );
};

export default WishJob;
