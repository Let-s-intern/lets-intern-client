import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  missionDetail: any;
}

const AbsentMissionSubmitMenu = ({ missionDetail }: Props) => {
  const [value, setValue] = useState(missionDetail?.link || '');

  const handleMissionLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('재제출 기능은 현재 준비중입니다.');
  };

  return (
    <form onSubmit={handleMissionLinkSubmit} className="px-3">
      <h3 className="text-lg font-semibold">미션 제출하기</h3>
      <p className="mt-1 text-sm">
        {!missionDetail.attended
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
              'text-neutral-400': missionDetail.attended,
            },
          )}
          id="link"
          name="link"
          placeholder="제출할 링크를 입력해주세요."
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          disabled={missionDetail.attended}
        />
        <button
          type="button"
          className="rounded bg-[#7D7D7D] px-5 font-medium text-white disabled:bg-[#c7c7c7]"
          onClick={() => {
            if (value) {
              Object.assign(document.createElement('a'), {
                target: '_blank',
                href: value,
                rel: 'noopenner noreferrer',
              }).click();
            }
          }}
          disabled={!value && !missionDetail.attended}
        >
          링크 확인
        </button>
      </div>
      <div className="mt-6 text-right">
        <button
          type="submit"
          className="rounded border border-[#DCDCDC] bg-white px-5 py-2 text-center font-semibold disabled:bg-gray-50 disabled:text-gray-600"
          disabled={missionDetail.attended || !value}
        >
          {missionDetail.attendanceLink ? '제출 완료' : '제출'}
        </button>
      </div>
    </form>
  );
};

export default AbsentMissionSubmitMenu;
