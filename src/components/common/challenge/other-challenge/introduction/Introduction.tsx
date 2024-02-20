import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';

import axios from '../../../../../utils/axios';
import { useParams } from 'react-router-dom';

interface Props {
  dashboard: any;
}

const Introduction = ({ dashboard }: Props) => {
  const params = useParams();
  const queryClient = useQueryClient();

  const [value, setValue] = useState(dashboard.introduction);
  const [isEditMode, setIsEditMode] = useState(false);

  const editIntroduction = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(
        `/application/${params.applicationId}/introduction`,
        {
          introduction: value,
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

  const handleIntroductionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    editIntroduction.mutate();
  };

  const handleEditCancel = (e: any) => {
    setIsEditMode(false);
    setValue('');
  };

  return (
    <div className="mt-3">
      {isEditMode ? (
        <form
          onSubmit={handleIntroductionEdit}
          className="flex flex-1 items-center gap-2"
        >
          <input
            type="text"
            value={value}
            className="flex-1 rounded-lg border border-[#A3A3A3] px-3 py-2 text-sm outline-none"
            id="introduction"
            autoComplete="off"
            name="introduction"
            onChange={(e) => setValue(e.target.value)}
          />
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
        <div className="flex items-center gap-1">
          <p>{dashboard.introduction}</p>
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

export default Introduction;
