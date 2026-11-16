// 패스 ONLY 자료집. 유형 칩(전체 + 데이터 유형) 필터 + 카드 목록.
'use client';

import HybridLink from '@/common/HybridLink';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { CategoryChips } from '@letscareer/ui';
import { useState } from 'react';
import { useGetPassLibrary, type LibraryItem } from '../../api/materials';

const ALL = 'ALL';

// introduction(JSON)을 설명/부가설명으로 파싱. JSON 아니면(구버전 평문) 전체를 설명으로.
const parseIntro = (introduction: string) => {
  try {
    const parsed = JSON.parse(introduction);
    if (parsed && typeof parsed === 'object' && 'summary' in parsed) {
      return {
        summary: String(parsed.summary ?? ''),
        bullets: Array.isArray(parsed.bullets)
          ? (parsed.bullets as string[])
          : [],
      };
    }
  } catch {
    // noop
  }
  return { summary: introduction, bullets: [] as string[] };
};

// 자료집 카드 1장. 카드 전체 클릭 = link 새 탭.
const MaterialCard = ({ material }: { material: LibraryItem }) => {
  const { summary, bullets } = parseIntro(material.introduction ?? '');

  return (
    <HybridLink
      href={material.link ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-md border border-neutral-80 p-4"
    >
      <div className="flex flex-col gap-2 md:gap-3">
        <span className="text-xxsmall12 font-medium text-primary-dark">
          {material.type}
        </span>
        <div className="flex flex-col gap-1.5 md:gap-2">
          <h3 className="text-xsmall16 font-semibold text-neutral-0 md:text-small18">
            {material.title}
          </h3>
          {summary && (
            <p className="text-xxsmall12 text-neutral-35 md:text-xsmall14">
              {summary}
            </p>
          )}

          {bullets.length > 0 && (
            <div className="flex flex-col gap-1.5 rounded-sm bg-primary-5 px-2 py-2.5">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-1">
                  <img
                    src="/icons/check-primary-dark.svg"
                    alt=""
                    className="shrink-0"
                  />
                  <span className="text-xxsmall12 text-neutral-35">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <span className="self-end text-xxsmall12 text-primary-dark transition-transform duration-200 group-hover:translate-x-0.5 md:text-xsmall14">
        자료 보기 →
      </span>
    </HybridLink>
  );
};

const MaterialsView = ({ applicationId }: { applicationId: number }) => {
  const [selected, setSelected] = useState<string>(ALL);
  const { data, isLoading, isError } = useGetPassLibrary(applicationId);
  const typeList = data?.typeList ?? [];
  const libraryList = data?.libraryList ?? [];

  const options = [
    { value: ALL, label: '전체' },
    ...typeList.map((type) => ({ value: type, label: type })),
  ];
  const filtered =
    selected === ALL
      ? libraryList
      : libraryList.filter((m) => m.type === selected);

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <CategoryChips
        options={options}
        selected={selected}
        onChange={setSelected}
        className="sticky top-[84px] z-10 -mx-5 border-b border-neutral-80 bg-white px-5 py-4 md:static md:mx-0 md:border-none md:bg-transparent md:px-0 md:py-0"
        activeClassName="bg-primary text-white"
      />

      {isLoading ? (
        <LoadingContainer className="py-20" />
      ) : isError ? (
        <p className="py-20 text-center text-xsmall14 text-neutral-40">
          목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : filtered.length === 0 ? (
        <div className="flex h-52 w-full items-center justify-center rounded-sm bg-neutral-95">
          <p className="text-xsmall14 text-neutral-40">
            등록된 자료집이 없어요.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-5">
          {filtered.map((material) => (
            <MaterialCard
              key={material.membershipBenefitId}
              material={material}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsView;
