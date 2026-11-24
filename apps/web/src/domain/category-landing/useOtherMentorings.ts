import type { ProgramCategoryTarget } from '@/api/program-category/programCategory';
import { liveMentoringOpeningListSchema } from '@/api/live-mentoring/liveMentoringSchema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

/** 멘토링 섹션 뒤에 이어 붙일 전체 멘토링 수 상한. 서버 기본 최대 쪽 크기 안에서 한 번에 받는다 */
const ALL_SIZE = 100;

/**
 * 열린 1:1 LIVE 멘토링 전체를 랜딩 카드 모양으로 받는다.
 * 랜딩 멘토링 섹션은 이 카테고리에 연결된 멘토링을 앞에, 나머지 멘토링을 뒤에 둔다
 */
export const useAllMentoringTargets = (enabled: boolean) =>
  useQuery({
    queryKey: ['landingAllMentorings'],
    queryFn: async (): Promise<ProgramCategoryTarget[]> => {
      const res = await axios.get('/live-mentoring', {
        params: { page: 1, size: ALL_SIZE, sortType: 'LATEST' },
      });
      return liveMentoringOpeningListSchema
        .parse(res.data.data)
        .openingList.map((opening) => ({
          targetType: 'LIVE_MENTORING',
          targetId: opening.liveMentoringId,
          title: opening.title ?? `${opening.mentorNickname ?? ''} 멘토링`,
          thumbnail: opening.thumbnail ?? opening.mentorProfileImage,
          mentorId: opening.mentorId,
          price: opening.minimumPrice,
          durations: opening.durations,
          mentorCompany: opening.representativeCareer?.company,
          mentorJob: opening.representativeCareer?.job,
          categoryIds: [],
        }));
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

/**
 * 연결된 멘토링을 앞에 두고, 아직 없는 멘토링을 뒤에 붙인다.
 * 랜딩 응답은 멘토링 상태를 보지 않아 비노출 멘토링도 오므로, 열린 멘토링 목록(all)에 있는 것만 남긴다
 */
export const appendOtherMentorings = (
  related: ProgramCategoryTarget[],
  all: ProgramCategoryTarget[],
) => {
  const openIds = new Set(all.map((t) => t.targetId));
  const openRelated = related.filter((t) => openIds.has(t.targetId));
  const seen = new Set(openRelated.map((t) => t.targetId));
  return [...openRelated, ...all.filter((t) => !seen.has(t.targetId))];
};
