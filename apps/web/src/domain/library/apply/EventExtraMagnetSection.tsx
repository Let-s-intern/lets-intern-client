'use client';

import {
  useGetMyMagnetListQuery,
  useGetUserMagnetListQuery,
} from '@/api/magnet/magnet';
import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
import CheckBox from '@/common/box/CheckBox';
import {
  libraryApplyEventExtraComputed,
  libraryApplyEventExtraQueries,
  libraryApplyEventExtraSkipped,
} from '@/utils/log';
import { useEffect, useMemo, useRef } from 'react';

// TODO(추상화): 최종 목표는 다른 library 섹션처럼 AsyncBoundary + useSuspenseQuery 통일이다.
// 단, 이 컴포넌트의 Sentry 로깅 계약("로딩 완료 시점에 1회만 emit")이 두 쿼리의 isLoading
// 전환에 묶여 있고 EventExtraMagnetSection.test.tsx 가 isLoading 을 mock 하므로, 전환 시
// 로깅 로직·테스트를 함께 재작성해야 한다. 별도 작업으로 분리(현재는 useQuery 유지).
const EXTRA_MAGNET_PAGE_SIZE = 100;

interface EventExtraMagnetSectionProps {
  selectedMagnetIds: number[];
  onSelectedMagnetIdsChange: (ids: number[]) => void;
}

const EventExtraMagnetSection = ({
  selectedMagnetIds,
  onSelectedMagnetIdsChange,
}: EventExtraMagnetSectionProps) => {
  const { data: candidateData, isLoading: isCandidateLoading } =
    useGetUserMagnetListQuery({
      typeList: [...LIBRARY_VISIBLE_MAGNET_TYPES],
      pageable: { page: 1, size: EXTRA_MAGNET_PAGE_SIZE },
    });

  const { data: appliedData, isLoading: isAppliedLoading } =
    useGetMyMagnetListQuery({
      typeList: [...LIBRARY_VISIBLE_MAGNET_TYPES],
      pageable: { page: 1, size: EXTRA_MAGNET_PAGE_SIZE },
    });

  const candidateCount = candidateData?.magnetList.length ?? null;
  const appliedCount = appliedData?.magnetList.length ?? null;

  // 로딩 완료 시점에 1회만 emit (docstring 계약). loading 변화마다 emit 되어
  // Sentry Logs 가 노이즈로 가득 차는 것을 방지.
  const queriesEmittedRef = useRef(false);
  useEffect(() => {
    if (queriesEmittedRef.current) return;
    if (isCandidateLoading || isAppliedLoading) return;
    queriesEmittedRef.current = true;
    libraryApplyEventExtraQueries({
      candidateLoading: isCandidateLoading,
      appliedLoading: isAppliedLoading,
      candidateCount,
      appliedCount,
    });
  }, [isCandidateLoading, isAppliedLoading, candidateCount, appliedCount]);

  const availableMagnets = useMemo(() => {
    if (!candidateData) return [];
    const appliedIds = new Set(
      (appliedData?.magnetList ?? []).map((m) => m.magnetId),
    );

    // 🔧 MOCK (비활성): BE 가 빈 답변(`magnetAnswerList: []`) 신청을 거부하는 경우의 임시 fallback.
    //   - 활성화 조건: 스테이징/운영에서 거부 케이스가 실제로 확인된 경우에만.
    //   - 동작: 거부된 magnetId 를 localStorage 에 누적 저장하여 다음 진입 시 후보군에서 제외.
    //   - 정식 해결: BE 응답에 "필수 답변 보유" 플래그 노출, 또는 빈 답변 신청 허용 정책 합의.
    //   - 검증 후 불필요시 본 블록 통째 제거. (TODO: 2.4 메모 참조 — be-request-magnet-batch-application.md)
    //
    // const rejectedIds = new Set<number>(
    //   JSON.parse(
    //     typeof window !== 'undefined'
    //       ? (window.localStorage.getItem('rejected-extra-magnet-ids') ?? '[]')
    //       : '[]',
    //   ) as number[],
    // );
    // return candidateData.magnetList.filter(
    //   (m) => !appliedIds.has(m.magnetId) && !rejectedIds.has(m.magnetId),
    // );

    return candidateData.magnetList.filter((m) => !appliedIds.has(m.magnetId));
  }, [candidateData, appliedData]);

  const isReady = !isCandidateLoading && !isAppliedLoading;
  const availableCount = availableMagnets.length;

  useEffect(() => {
    if (!isReady) return;
    libraryApplyEventExtraComputed({
      candidateCount: candidateData?.magnetList.length ?? 0,
      appliedCount: appliedData?.magnetList.length ?? 0,
      availableCount,
    });
  }, [isReady, candidateData, appliedData, availableCount]);

  useEffect(() => {
    if (!isReady) {
      libraryApplyEventExtraSkipped('loading');
      return;
    }
    if (availableCount === 0) {
      libraryApplyEventExtraSkipped('empty');
    }
  }, [isReady, availableCount]);

  if (isCandidateLoading || isAppliedLoading) return null;
  if (availableMagnets.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-semibold">
          함께 받아볼 자료집
        </span>
        <span className="text-xsmall12 md:text-xsmall14 text-neutral-40">
          관심 있는 자료집을 선택하면 이번 신청과 함께 받아볼 수 있어요.
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {availableMagnets.map((magnet) => {
          const isSelected = selectedMagnetIds.includes(magnet.magnetId);
          return (
            <button
              key={magnet.magnetId}
              type="button"
              onClick={() => {
                const newIds = isSelected
                  ? selectedMagnetIds.filter((id) => id !== magnet.magnetId)
                  : [...selectedMagnetIds, magnet.magnetId];
                onSelectedMagnetIdsChange(newIds);
              }}
              className="text-xsmall14 flex w-full items-center gap-1"
            >
              <CheckBox checked={isSelected} width="w-6" showCheckIcon />
              <span className="text-xsmall14 md:text-xsmall16">
                {magnet.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventExtraMagnetSection;
