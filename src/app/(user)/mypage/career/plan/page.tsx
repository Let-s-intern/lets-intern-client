'use client';

import { JOB_CONDITIONS } from '@/utils/constants';
import CheckBox from '@components/common/ui/CheckBox';
import LineInput from '@components/common/ui/input/LineInput';
import OutlinedButton from '@components/ui/button/OutlinedButton';
import SolidButton from '@components/ui/button/SolidButton';
import { useState } from 'react';

interface CareerPlanValues {
  university: string;
  grade: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  wishIndustry: string;
  wishTargetCompany: string;
  jobConditions: string[];
}

export default function Page() {
  const [user, setUser] = useState<CareerPlanValues>({
    university: '',
    grade: '',
    major: '',
    wishJob: '',
    wishCompany: '',
    wishIndustry: '',
    wishTargetCompany: '',
    jobConditions: [],
  });

  const handleConditionToggle = (value: string) => {
    setUser((prev) => ({
      ...prev,
      jobConditions: prev.jobConditions.includes(value)
        ? prev.jobConditions.filter((v) => v !== value)
        : [...prev.jobConditions, value],
    }));
  };

  const handleCancel = () => {
    console.log('cancel');
    /* TODO : 취소 로직  */
  };

  return (
    <div className="flex w-full flex-col">
      {user.university !== '' ? (
        <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
          <div className="flex flex-col text-center text-sm text-neutral-20">
            <p>아직 커리어 방향을 설정하지 않았어요.</p>
            <p>목표를 세우면, 그 길에 한걸음 더 가까워질 수 있어요.</p>
          </div>
          <OutlinedButton size="xs" className="w-fit">
            커리어 계획하기
          </OutlinedButton>
        </section>
      ) : (
        <section>
          <h1 className="mb-6 text-small18">기본 정보</h1>
          <div>
            <div className="mb-10 flex flex-col gap-4">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="university" className="text-xsmall16">
                  학교
                </label>
                <LineInput
                  id="university"
                  name="university"
                  placeholder="학교 이름을 입력해 주세요."
                  value={user.university}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="grade" className="text-xsmall16">
                  학년
                </label>
                <div className="relative">
                  <LineInput
                    id="grade"
                    name="grade"
                    placeholder="학년을 선택해 주세요."
                    value={user.grade}
                    readOnly
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="major" className="text-xsmall16">
                  전공
                </label>
                <LineInput
                  id="major"
                  name="major"
                  placeholder="전공을 입력해 주세요."
                  value={user.major}
                />
              </div>
            </div>
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="wishJob" className="text-xsmall16">
                  희망 직군
                </label>
                <div className="relative">
                  <LineInput
                    id="wishJob"
                    name="wishJob"
                    placeholder="희망 직군을 선택해 주세요."
                    value={user.wishJob}
                    readOnly
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="wishCompany" className="text-xsmall16">
                  희망 직무 (최대 3개)
                </label>
                <div className="relative">
                  <LineInput
                    id="wishCompany"
                    name="wishCompany"
                    placeholder="희망 직무를 선택해 주세요."
                    value={user.wishCompany}
                    readOnly
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="wishIndustry" className="text-xsmall16">
                  희망 산업 (최대 3개)
                </label>
                <div className="relative">
                  <LineInput
                    id="wishIndustry"
                    name="wishIndustry"
                    placeholder="희망 산업을 선택해 주세요."
                    value={user.wishIndustry}
                    readOnly
                  />
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M7.5 5L12.5 10L7.5 15"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label htmlFor="wishTargetCompany" className="text-xsmall16">
                  희망 기업
                </label>
                <LineInput
                  id="wishTargetCompany"
                  name="wishTargetCompany"
                  placeholder="희망 기업을 입력해주세요."
                  value={user.wishTargetCompany}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xsmall16">희망 구직 조건</span>
              <div className="flex flex-col gap-2">
                {JOB_CONDITIONS.map((option) => {
                  const isSelected = user.jobConditions.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleConditionToggle(option.value)}
                      className="flex w-full items-center gap-1 text-xsmall14"
                    >
                      <CheckBox checked={isSelected} width="w-6" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-12 flex gap-3">
            <OutlinedButton size="md" onClick={handleCancel} className="flex-1">
              취소하기
            </OutlinedButton>
            <SolidButton form="career-form" type="submit" className="flex-1">
              입력 완료
            </SolidButton>
          </div>
        </section>
      )}
    </div>
  );
}
