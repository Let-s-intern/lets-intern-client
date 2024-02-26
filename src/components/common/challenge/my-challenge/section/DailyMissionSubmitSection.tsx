import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import axios from '../../../../../utils/axios';
import clsx from 'clsx';

interface Props {
  dailyMission: any;
}

const DailyMissionSubmitSection = ({ dailyMission }: Props) => {
  const queryClient = useQueryClient();

  const [value, setValue] = useState(
    dailyMission.attended ? dailyMission.attendanceLink : '',
  );
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(
    dailyMission.attended,
  );
  const [isStartedHttp, setIsStartedHttp] = useState(false);

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

  const handleMissionLinkChanged = (e: any) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    if (inputValue.startsWith('https://') || inputValue.startsWith('http://')) {
      setIsStartedHttp(true);
    } else {
      setIsStartedHttp(false);
      setIsLinkChecked(false);
    }
    const expression =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const regex = new RegExp(expression);
    if (regex.test(e.target.value)) {
      setIsValidLinkValue(true);
    } else {
      setIsValidLinkValue(false);
      setIsLinkChecked(false);
    }
  };

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMissionLink.mutate(value);
  };

  return (
    <form onSubmit={handleMissionLinkSubmit}>
      <h3 className="text-lg font-semibold">미션 제출하기</h3>
      <p className="mt-1 text-sm">
        {!dailyMission.attended
          ? '링크를 제대로 확인해 주세요. 카톡으로 공유해야 미션 제출이 인정됩니다.'
          : '미션 제출이 완료되었습니다.'}
      </p>
      {dailyMission.comments && (
        <div className="mt-4 rounded-md border border-gray-300 bg-[#F2F2F2] px-8 py-6 text-sm">
          {dailyMission.comments}
        </div>
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
              'border-red-500':
                !isValidLinkValue && value && !dailyMission.attended,
              'border-primary':
                isValidLinkValue && value && !dailyMission.attended,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={handleMissionLinkChanged}
          value={value}
          disabled={dailyMission.attended}
        />
        <button
          type="button"
          className="rounded bg-primary px-5 font-medium text-white disabled:bg-[#c7c7c7]"
          onClick={() => {
            if (value) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: value,
                rel: 'noopenner noreferrer',
              }).click();
              setIsLinkChecked(true);
            }
          }}
          disabled={(!value && !dailyMission.attended) || !isValidLinkValue}
        >
          링크 확인
        </button>
      </div>
      {value &&
        !dailyMission.attended &&
        (isLinkChecked ? (
          <div className="ml-12 mt-1 text-xs font-medium text-primary">
            링크 확인을 완료하셨습니다. 링크가 올바르다면 제출 버튼을
            눌러주세요.
          </div>
        ) : !isValidLinkValue ? (
          <div className="ml-12 mt-1 text-xs font-medium text-red-500">
            URL 형식이 올바르지 않습니다.
            {!isStartedHttp && <> (https:// 또는 http://로 시작해야 합니다.)</>}
          </div>
        ) : (
          <div className="ml-12 mt-1 text-xs font-medium text-primary">
            URL을 올바르게 입력하셨습니다. 링크 확인을 진행해주세요.
          </div>
        ))}
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold disabled:bg-gray-50 disabled:text-gray-600"
          disabled={dailyMission.attended || !value || !isLinkChecked}
        >
          {dailyMission.attendanceLink ? '제출 완료' : '제출'}
        </button>
      </div>
    </form>
  );
};

export default DailyMissionSubmitSection;
