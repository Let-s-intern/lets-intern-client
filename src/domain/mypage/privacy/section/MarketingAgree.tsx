import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import clsx from 'clsx';
import axios from '../../../../utils/axios';

const MarketingAgree = () => {
  const queryClient = useQueryClient();

  const [isAgree, setIsAgree] = useState<boolean>(false);
  const [isSameEmail, setIsSameEmail] = useState<boolean>(false);

  useQuery({
    queryKey: ['user', '_marketing-agree'],
    queryFn: async () => {
      const res = await axios.get('/user');
      setIsAgree(res.data.data.marketingAgree);
      return res.data;
    },
  });

  const editMyInfo = useMutation({
    mutationFn: async ({ value }: { value: boolean }) => {
      const res = await axios.patch('/user', { marketingAgree: value });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const handleIsAgreeCheck = () => {
    editMyInfo.mutate({ value: !isAgree });
  };

  return (
    <div className="flex items-center justify-between rounded-md bg-primary-10 px-5 py-4">
      <div>
        <h1 className="text-lg font-semibold text-neutral-0 text-opacity-[88%]">
          마케팅 수신 동의
        </h1>
        <p className="text-sm text-neutral-0 text-opacity-[52%]">
          할인, 이벤트, 프로그램 개설 및 추천 등<br />
          유용한 정보를 알려주는 소식을 받을 수 있어요.
        </p>
      </div>
      <div>
        <div
          className={clsx(
            'flex h-[1.75rem] w-[3rem] cursor-pointer items-center rounded-full px-1',
            {
              'bg-primary-30': isAgree,
              'bg-white bg-opacity-[52%]': !isAgree,
            },
          )}
          onClick={handleIsAgreeCheck}
        >
          <div
            className={clsx('h-[1.25rem] w-[1.25rem] rounded-full bg-primary', {
              'translate-x-0': !isAgree,
              'translate-x-[1.25rem]': isAgree,
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketingAgree;
