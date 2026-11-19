import { programAdminSchema } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import type { ProgramCategoryTargetType } from '../programCategoryApi';

/** /program/admin 이 다루는 유형. 나머지(멘토링·블로그·마그넷)는 id 를 직접 넣는다 */
const SEARCHABLE_TYPES = [
  'CHALLENGE',
  'LIVE',
  'VOD',
  'GUIDEBOOK',
  'MEMBERSHIP',
] as const;

export const isSearchableTargetType = (type: ProgramCategoryTargetType) =>
  (SEARCHABLE_TYPES as readonly string[]).includes(type);

export interface FoundProduct {
  id: number;
  title: string;
}

/**
 * 상품을 제목으로 찾는다. 키워드가 숫자뿐이면 id 일치도 함께 찾으므로,
 * 이미 고른 상품의 제목을 id 로 다시 찾을 때도 쓴다
 */
export const useProductSearch = (
  type: ProgramCategoryTargetType | '',
  keyword: string,
) =>
  useQuery({
    queryKey: ['programCategoryProductSearch', type, keyword],
    queryFn: async ({ signal }): Promise<FoundProduct[]> => {
      const res = await axios.get('/program/admin', {
        params: { keyword, type, page: 1, size: 20 },
        signal,
      });
      return programAdminSchema
        .parse(res.data.data)
        .programList.filter((p) => p.programInfo.programType === type)
        .map((p) => ({
          id: p.programInfo.id,
          title: p.programInfo.title ?? `제목 없음 (#${p.programInfo.id})`,
        }));
    },
    enabled:
      type !== '' && isSearchableTargetType(type) && keyword.trim() !== '',
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
