'use client';

import channelService from '@/ChannelService';
import SectionSubHeader from '@/common/header/SectionSubHeader';
import Box from '@/domain/program/program-detail/Box';
import { ReactNode } from 'react';
import MainTitle from '../ui/MainTitle';

function Badge({ children }: { children?: ReactNode }) {
  return (
    <span className="absolute -top-5 left-4 z-10 -rotate-12 rounded-md bg-primary-90 px-4 py-1 text-medium22 text-white md:left-6">
      {children}
    </span>
  );
}

const PLAN_LIST = [
  {
    label: '추천 1',
    description: ['직무 탐색 중이라면?'],
    plan: '라이트 플랜',
  },
  {
    label: '추천 2',
    description: ['마케팅 직무 필수 서류 완성이', '필요하다면?'],
    plan: '베이직 플랜',
  },
  {
    label: '추천 3',
    description: ['현직자 피드백으로', '서류 합격률 높이고 싶다면?'],
    plan: '스탠다드 & 프리미엄 플랜',
  },
];

function MarketingPlanSection() {
  return (
    <section className="flex flex-col items-center px-5 py-20 md:px-0 md:pt-[120px]">
      <div className="flex w-full max-w-[1160px] flex-col items-center gap-10">
        <div className="md:gap-25 flex w-full flex-col items-center gap-20 text-center">
          <div className="flex w-full flex-col items-center gap-5 text-center md:gap-[42px]">
            <SectionSubHeader className="text-xsmall16 font-semibold text-neutral-45 md:text-small18">
              취준이 처음인 대학생부터 <br className="md:hidden" />
              이직 준비 중인 주니어 마케터까지!
            </SectionSubHeader>
            <MainTitle>
              <span>상황별 맞춤 플랜 추천드립니다!</span>
            </MainTitle>
          </div>
          <div className="flex w-full flex-col gap-[60px] md:flex-row md:gap-10">
            {PLAN_LIST.map((item) => (
              <div
                key={item.label}
                className="flex w-full flex-1 flex-col items-stretch gap-3"
              >
                <Box className="text-small16 relative flex max-h-[100px] flex-1 flex-col items-center justify-center rounded-md bg-primary-10 px-10 py-10 text-center font-medium md:max-h-[136px] md:text-small20">
                  <Badge>{item.label}</Badge>
                  {item.description.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </Box>
                <div className="text-small16 rounded-md bg-primary-90 px-5 pb-4 pt-3 font-bold text-white md:pb-6 md:pt-5 md:text-small20">
                  {item.plan}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-5 rounded-md bg-neutral-90 px-9 py-5 text-center md:flex-row md:justify-between md:px-10">
          <span className="text-xsmall16 tracking-[-0.096px] text-neutral-35">
            나에게 맞는 플랜이 뭔지 모르겠다면?
          </span>
          <button
            type="button"
            className="flex items-center justify-center gap-1 rounded-xxs border border-primary bg-white px-3 py-2 text-xsmall14 text-primary"
            onClick={() => channelService.showMessenger()}
          >
            <img src="/icons/kakao-circle.svg" alt="edit-icon" />
            렛츠커리어 채널톡 문의
          </button>
        </div>
      </div>
    </section>
  );
}

export default MarketingPlanSection;
