'use client';

import { useGetProgramAdminQuery } from '@/api/program';
import { MagnetProgramRecommendItem } from '@/domain/admin/blog/magnet/types';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ProgramStatusEnum } from '@/schema';
import { programStatusToText } from '@/utils/convert';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ChangeEvent, useMemo } from 'react';

const { PROCEEDING, PREV } = ProgramStatusEnum.enum;

// TODO: 백엔드에서 challengeType 필드가 admin program API에 추가되면 제목 추론 대신 직접 사용
const CTA_SUBTITLE_MAP: Record<string, string> = {
  경험정리: '취업 서류 준비의 기초·필수 코어가 될',
  이력서: '매력적인 이력서를 완성하는 1주일',
  자기소개서: '만능 답변으로 진짜 나를 드러내는',
  포트폴리오: '나의 경험을 200% 활용하여 제작하는',
  마케팅: '마케팅 현직자 멘토와 함께하는',
  대기업: '현직자와 함께 끝내는 공채준비',
};

function inferCtaSubtitle(title: string): string {
  for (const [keyword, subtitle] of Object.entries(CTA_SUBTITLE_MAP)) {
    if (title.includes(keyword)) return subtitle;
  }
  return '';
}

interface MagnetProgramRecommendSectionProps {
  programRecommend: MagnetProgramRecommendItem[];
  onChangeProgramRecommend: (items: MagnetProgramRecommendItem[]) => void;
}

const MagnetProgramRecommendSection = ({
  programRecommend,
  onChangeProgramRecommend,
}: MagnetProgramRecommendSectionProps) => {
  const { data } = useGetProgramAdminQuery({
    page: 1,
    size: 10000,
    type: 'CHALLENGE',
    status: [PROCEEDING, PREV],
  });

  const { menuItems, titleByValue } = useMemo(() => {
    const items: React.JSX.Element[] = [
      <MenuItem key="null" value="null">
        선택 안 함
      </MenuItem>,
    ];
    const titleMap = new Map<string, string>();

    data?.programList
      .filter(
        (p) =>
          p.programInfo.isVisible &&
          (p.programInfo.title ?? '').endsWith('챌린지'),
      )
      .forEach((p) => {
        const value = `CHALLENGE-${p.programInfo.id}`;
        const title = p.programInfo.title ?? '';
        titleMap.set(value, title);
        items.push(
          <MenuItem key={value} value={value}>
            {`[챌린지/${programStatusToText[p.programInfo.programStatusType]}] ${title}`}
          </MenuItem>,
        );
      });

    return { menuItems: items, titleByValue: titleMap };
  }, [data]);

  const handleChange = (
    e:
      | SelectChangeEvent<string | null>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const list = [...programRecommend];
    const item = { ...list[index], [e.target.name]: e.target.value };
    const notSelectProgram = e.target.value === 'null';

    if (e.target.name === 'id' && notSelectProgram) {
      item.id = null;
      delete item.ctaLink;
      delete item.ctaTitle;
    }

    if (e.target.name === 'id' && !notSelectProgram) {
      const title = titleByValue.get(e.target.value as string) ?? '';
      item.ctaTitle = inferCtaSubtitle(title);
    }

    onChangeProgramRecommend([
      ...list.slice(0, index),
      item,
      ...list.slice(index + 1),
    ]);
  };

  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2">
        <Heading2>프로그램 추천</Heading2>
        <span className="text-xsmall14 text-neutral-40">
          *노출된 프로그램 중 모집중, 모집예정인 프로그램만 불러옵니다.
        </span>
      </div>
      <div className="flex flex-col gap-5">
        {programRecommend.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <FormControl size="small">
              <InputLabel>프로그램 선택</InputLabel>
              <Select
                name="id"
                value={item.id ?? 'null'}
                fullWidth
                size="small"
                label="프로그램 선택"
                onChange={(e) => handleChange(e, index)}
              >
                {menuItems}
              </Select>
            </FormControl>
            <TextField
              size="small"
              value={item.ctaTitle ?? ''}
              label={'CTA 소제목' + (index + 1)}
              placeholder={'CTA 소제목' + (index + 1)}
              name="ctaTitle"
              fullWidth
              onChange={(e) => handleChange(e, index)}
            />
            {!item.id && (
              <TextField
                size="small"
                value={item.ctaLink ?? ''}
                label={'CTA 링크' + (index + 1)}
                placeholder={'CTA 링크' + (index + 1)}
                name="ctaLink"
                fullWidth
                onChange={(e) => handleChange(e, index)}
              />
            )}
          </div>
        ))}
        <span className="text-0.875 text-neutral-35">
          {
            "*CTA링크: 'latest:{text}'으로 설정하면, text를 제목에 포함하는 챌린지 상세페이지로 이동합니다. (예시) latest:인턴"
          }
        </span>
      </div>
    </div>
  );
};

export default MagnetProgramRecommendSection;
