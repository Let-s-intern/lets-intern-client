'use client';

import { useGetProgramAdminQuery } from '@/api/program';
import { MagnetProgramRecommendItem } from '@/domain/admin/magnet/types';
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
const MAX_PROGRAM_FETCH_SIZE = 10000;

/** programClassification → CTA 소제목 기본값 */
const CTA_BY_CLASSIFICATION: Record<string, string> = {
  CAREER_SEARCH: '취업 서류 준비의 기초·필수 코어가 될',
  DOCUMENT_PREPARATION: '매력적인 이력서를 완성하는 1주일',
  MEETING_PREPARATION: '만능 답변으로 진짜 나를 드러내는',
  PASS: '나의 경험을 200% 활용하여 제작하는',
};

/** 제목 키워드 → CTA 소제목 (classification 매핑 실패 시 fallback) */
const CTA_BY_KEYWORD: Record<string, string> = {
  경험정리: '취업 서류 준비의 기초·필수 코어가 될',
  이력서: '매력적인 이력서를 완성하는 1주일',
  자기소개서: '만능 답변으로 진짜 나를 드러내는',
  포트폴리오: '나의 경험을 200% 활용하여 제작하는',
  마케팅: '마케팅 현직자 멘토와 함께하는',
  대기업: '현직자와 함께 끝내는 공채준비',
};

/** 미설정시 기본값으로 노출할 프로그램 (이력서/자소서/포트폴리오 3종) */
const DEFAULT_PROGRAM_KEYWORDS = ['이력서', '자기소개서', '포트폴리오'] as const;

function inferCtaSubtitle(
  classification: string | null | undefined,
  title: string,
): string {
  if (classification && CTA_BY_CLASSIFICATION[classification]) {
    return CTA_BY_CLASSIFICATION[classification];
  }
  for (const [keyword, subtitle] of Object.entries(CTA_BY_KEYWORD)) {
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
    size: MAX_PROGRAM_FETCH_SIZE,
    type: 'CHALLENGE',
    status: [PROCEEDING, PREV],
  });

  const challengeList = useMemo(
    () =>
      data?.programList.filter(
        (p) =>
          p.programInfo.isVisible &&
          (p.programInfo.title ?? '').endsWith('챌린지'),
      ) ?? [],
    [data],
  );

  const { menuItems, programInfoByValue } = useMemo(() => {
    const items: React.JSX.Element[] = [
      <MenuItem key="null" value="null">
        선택 안 함
      </MenuItem>,
    ];
    const infoMap = new Map<
      string,
      { title: string; classification: string | null }
    >();

    challengeList.forEach((p) => {
      const value = `CHALLENGE-${p.programInfo.id}`;
      const title = p.programInfo.title ?? '';
      const classification =
        p.classificationList?.[0]?.programClassification ?? null;
      infoMap.set(value, { title, classification });
      items.push(
        <MenuItem key={value} value={value}>
          {`[챌린지/${programStatusToText[p.programInfo.programStatusType]}] ${title}`}
        </MenuItem>,
      );
    });

    return { menuItems: items, programInfoByValue: infoMap };
  }, [challengeList]);

  /** 미설정 슬롯에 노출될 기본 프로그램 (이력서/자소서/포트폴리오 키워드 매칭) */
  const defaultPrograms = useMemo(() => {
    return DEFAULT_PROGRAM_KEYWORDS.map((keyword) => {
      const match = challengeList.find((p) =>
        (p.programInfo.title ?? '').includes(keyword),
      );
      if (!match) return null;
      const classification =
        match.classificationList?.[0]?.programClassification ?? null;
      return {
        title: match.programInfo.title ?? '',
        ctaTitle: inferCtaSubtitle(classification, match.programInfo.title ?? ''),
        ctaLink: `latest:${keyword}`,
      };
    }).filter(Boolean);
  }, [challengeList]);

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
      const info = programInfoByValue.get(e.target.value as string);
      item.ctaTitle = inferCtaSubtitle(
        info?.classification,
        info?.title ?? '',
      );
    }

    onChangeProgramRecommend([
      ...list.slice(0, index),
      item,
      ...list.slice(index + 1),
    ]);
  };

  /** 미설정 슬롯 순서대로 기본값 라벨 반환 */
  const getDefaultLabel = (index: number): string | null => {
    let defaultIndex = 0;
    for (let i = 0; i < index; i++) {
      if (!programRecommend[i].id) defaultIndex++;
    }
    const def = defaultPrograms[defaultIndex];
    if (!def) return null;
    return `${def.title} (CTA: ${def.ctaTitle}, 링크: ${def.ctaLink})`;
  };

  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2">
        <Heading2>프로그램 추천</Heading2>
        <span className="text-xsmall14 text-neutral-40">
          *노출된 프로그램 중 모집중, 모집예정인 프로그램만 불러옵니다.
        </span>
      </div>
      <p className="mb-2 text-xs text-gray-500">
        미설정 시 기본값으로 이력서/자기소개서/포트폴리오 챌린지가 자동
        노출됩니다.
      </p>
      <div className="flex flex-col gap-5">
        {programRecommend.map((item, index) => {
          const defaultLabel = !item.id ? getDefaultLabel(index) : null;
          return (
            <div
              key={`program-recommend-${index}`}
              className="flex flex-col gap-3"
            >
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
              {defaultLabel && (
                <p className="text-xs text-blue-500">
                  기본값: {defaultLabel}
                </p>
              )}
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
          );
        })}
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
