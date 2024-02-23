import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useState } from 'react';
import axios from '../../../../../utils/axios';

interface Props {
  missionDetail: any;
}

const AbsentMissionSubmitMenu = ({ missionDetail }: Props) => {
  const [isAttended, setIsAttended] = useState(missionDetail.attended);
  const [value, setValue] = useState(missionDetail?.link || '');
  const [isLinkChecked, setIsLinkChecked] = useState(false);
  const [isValidLinkValue, setIsValidLinkValue] = useState(isAttended);
  const [isStartedHttp, setIsStartedHttp] = useState(false);

  const submitMissionLink = useMutation({
    mutationFn: async () => {
      let res;
      if (missionDetail.attendanceResult === 'WRONG') {
        res = await axios.patch(`/attendance/${missionDetail.attendanceId}`, {
          link: value,
        });
      } else {
        res = await axios.post(`/attendance/${missionDetail.id}`, {
          link: value,
        });
      }
      const data = res.data;
      return data;
    },
    onSuccess: () => {
      setIsAttended(true);
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
    const pattern = new RegExp(
      '^(https?:\\/\\/)([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*[^-\\.])?$',
    );
    if (pattern.test(e.target.value)) {
      setIsValidLinkValue(true);
    } else {
      setIsValidLinkValue(false);
      setIsLinkChecked(false);
    }
  };

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMissionLink.mutate();
  };

  return (
    <form onSubmit={handleMissionLinkSubmit} className="px-3">
      <h3 className="text-lg font-semibold">미션 제출하기</h3>
      <p className="mt-1 text-sm">
        {!isAttended
          ? '링크를 제대로 확인해 주세요. 카톡으로 공유해야 미션 제출이 인정됩니다.'
          : '미션 제출이 완료되었습니다.'}
      </p>

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
            'flex-1 cursor-text rounded-lg border border-[#A3A3A3] px-3 py-2 text-sm outline-none',
            {
              'text-neutral-400': isAttended,
              'border-red-500': !isValidLinkValue && value && !isAttended,
              'border-primary': isValidLinkValue && value && !isAttended,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={handleMissionLinkChanged}
          value={value}
          disabled={isAttended}
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
          disabled={(!value && !isAttended) || !isValidLinkValue}
        >
          링크 확인
        </button>
      </div>
      {value &&
        !isAttended &&
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
          disabled={isAttended || !value || !isLinkChecked}
        >
          {isAttended ? '제출 완료' : '제출'}
        </button>
      </div>
    </form>
  );
};

export default AbsentMissionSubmitMenu;
