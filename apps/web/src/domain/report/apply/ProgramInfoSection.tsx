'use client';

import React from 'react';
import { FormControl, RadioGroup } from '@mui/material';

import { OptionFormRadioControlLabel } from '@/common/ControlLabel';
import { getReportThumbnail } from '@/domain/mypage/credit/ui/CreditListItem';
import ProgramCard from '@/domain/report/ui/card/ProgramCard';
import Heading2 from '@/domain/report/ui/heading/Heading2';
import Tooltip from '@/domain/report/ui/Tooltip';
import useReportProgramInfo from '@/hooks/useReportProgramInfo';

import { CallOut } from './CallOut';

export const ProgramInfoSection = ({
  onChangeRadio,
}: {
  onChangeRadio?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
  ) => void;
}) => {
  const { title, product, option, reportType } = useReportProgramInfo();

  const tooltipContent = {
    description:
      '진단 완료까지 48시간 소요됩니다.\n다만, 신청자가 많을 경우 플랜에 따라 소요 시간이 달라질 수 있습니다.',
    list: [
      '베이직 플랜: 2일 이내',
      '프리미엄 플랜: 3일 이내',
      '현직자 피드백 옵션: 최대 5일 이내',
    ],
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-1">
        <Heading2>프로그램 정보</Heading2>
        <Tooltip alt="프로그램 도움말 아이콘">
          <p className="whitespace-pre-line">{tooltipContent.description}</p>
          <br />
          <ul className="list-disc pl-4">
            {tooltipContent.list.map((item) => {
              const label = item.split(':')[0];
              const value = ': ' + item.split(':')[1];
              return (
                <li key={label}>
                  <span className="font-semibold">{label}</span>
                  {value}
                </li>
              );
            })}
          </ul>
        </Tooltip>
      </div>
      <ProgramCard
        imgSrc={getReportThumbnail(reportType ?? null)}
        imgAlt="서류 진단서 프로그램 썸네일"
        title={title ?? ''}
        content={[
          {
            label: '상품',
            text: product,
          },
          {
            label: '옵션',
            text: option,
          },
        ]}
      />
      <div className="mt-10">
        <CallOut
          className="bg-primary-5 mb-6"
          header="📄 진단을 위한 서류를 제출해주세요"
          body="서류 제출 순으로 진단이 시작됩니다. 빠른 진단을 원하신다면 제출을 서둘러주세요."
        />
        <FormControl fullWidth>
          <RadioGroup
            defaultValue="true"
            name="radio-buttons-group"
            onChange={onChangeRadio}
          >
            <div className="flex flex-col gap-1">
              <OptionFormRadioControlLabel
                label="지금 제출할래요."
                value="true"
              />
              <OptionFormRadioControlLabel
                label="결제 후 나중에 제출할래요."
                value="false"
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>
    </section>
  );
};
