import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import clsx from 'clsx';

interface Props {
  dailyMission: any;
}

const DailyMissionSubmitSection = ({ dailyMission }: Props) => {
  const queryClient = useQueryClient();

  const [linkValue, setLinkValue] = useState(
    dailyMission.attended ? dailyMission.attendanceLink : '',
  );

  const submitMissionLink = useMutation({
    mutationFn: async (linkValue: string) => {
      const res = await axios.post(`/attendance/${dailyMission.id}`, {
        link: linkValue,
      });
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMissionLink.mutate(linkValue);
  };

  return (
    <form onSubmit={handleMissionLinkSubmit}>
      <h3 className="text-lg font-semibold">미션 제출하기</h3>
      {!dailyMission.attended && (
        <p className="mt-1 text-sm">
          링크 제대로 확인해 주세요. 카톡으로 공유해야 미션 제출 인정됩니다.
        </p>
      )}
      <div className="mt-4 flex items-stretch gap-4">
        <label
          htmlFor="link"
          className="flex items-center font-semibold text-[#626262]"
        >
          링크
        </label>
        <input
          type="text"
          className={clsx(
            'flex-1 cursor-text rounded-lg border border-[#A3A3A3] bg-[#F6F8FB] px-3 py-2 text-sm outline-none',
            {
              'text-neutral-400': dailyMission.attended,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={(e) => setLinkValue(e.target.value)}
          value={linkValue}
          disabled={dailyMission.attended}
        />
        <button
          className="rounded bg-[#7D7D7D] px-5 font-medium text-white"
          onClick={() => {
            if (linkValue) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: linkValue,
                rel: 'noopenner noreferrer',
              }).click();
            }
          }}
        >
          링크 확인
        </button>
      </div>
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold"
          disabled={dailyMission.attended}
        >
          {dailyMission.attendanceLink ? '제출 완료' : '제출'}
        </button>
      </div>
    </form>
  );
};

export default DailyMissionSubmitSection;
