'use client';

import OutlinedButton from '@components/common/mypage/experience/OutlinedButton';
import SolidButton from '@components/common/mypage/experience/SolidButton';

import { useState } from 'react';

const Career = () => {
  // state 기반 작성 모드 관리 (추후 변경 가능)
  const [writeMode, setWriteMode] = useState(false);

  return (
    <div className="flex h-full w-full flex-col items-center gap-3">
      <div className="flex flex-col items-center text-sm text-neutral-20">
        <p>아직 등록된 커리어가 없어요.</p>
        <p>지금까지의 경력을 기록해두면, 서류 준비가 훨씬 쉬워져요.</p>
      </div>
      <OutlinedButton onClick={() => setWriteMode(true)}>
        커리어 기록하기
      </OutlinedButton>

      {writeMode && (
        <div className="flex h-full w-full flex-col gap-3 border-neutral-10">
          <header className="text-lg font-medium">커리어 기록(경력사항)</header>

          <form className="flex w-full flex-col gap-3 rounded-xs border border-neutral-80 p-5">
            {/* 기업 이름 */}
            <fieldset className="flex flex-col gap-1.5">
              <label
                htmlFor="career-company"
                className="font-medium text-neutral-20"
              >
                기업 이름
              </label>
              <input
                id="career-company"
                type="text"
                placeholder="예) 렛츠커리어"
                className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
              />
            </fieldset>

            {/* 직무 */}
            <fieldset className="flex flex-col gap-1.5">
              <label
                htmlFor="career-position"
                className="font-medium text-neutral-20"
              >
                직무
              </label>
              <input
                id="career-position"
                type="text"
                placeholder="예) 서비스 기획자"
                className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
              />
            </fieldset>

            {/* 고용 형태 */}
            <fieldset className="flex flex-col gap-1.5">
              <label
                htmlFor="career-employment-type"
                className="font-medium text-neutral-20"
              >
                고용 형태
              </label>
              <input
                id="career-employment-type"
                type="text"
                placeholder="고용 형태를 선택해 주세요."
                className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
              />
            </fieldset>

            {/* 근무 기간 */}
            <fieldset className="flex flex-col gap-1.5">
              <label
                htmlFor="career-period"
                className="font-medium text-neutral-20"
              >
                근무 기간
              </label>
              <input
                id="career-period"
                type="text"
                placeholder="근무 기간을 입력해 주세요."
                className="w-full rounded-xxs border border-neutral-80 px-3 py-2 text-neutral-0 placeholder:text-neutral-50 focus:border-primary focus:outline-none"
              />
            </fieldset>
          </form>

          {/* TODO: 추후 버튼 스타일 변경 */}
          <div className="flex w-full gap-2">
            <OutlinedButton
              onClick={() => setWriteMode(false)}
              className="flex-1"
            >
              취소하기
            </OutlinedButton>
            <SolidButton onClick={() => setWriteMode(false)} className="flex-1">
              입력 완료
            </SolidButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Career;
