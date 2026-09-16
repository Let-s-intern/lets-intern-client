import { PassFormInput } from '@/domain/all-in-one-pass/types';
import { useQuery } from '@tanstack/react-query';
import { passDetailFixtures } from './mock/passDetailFixtures';
import { mockDelay } from './mock/passStore';

/**
 * 올인원패스 단건 상세 조회 훅 (수정 폼 프리필용).
 *
 * 현재는 mock 시드(./mock/passDetailFixtures)를 읽는다. 백엔드 스펙이 나오면
 * queryFn 본문만 axios 호출로 교체하면 된다.
 */

export const allInOnePassDetailQueryKey = 'allInOnePassDetail';

/** id 로 상세(폼 입력값)를 조회한다. 없으면 에러. */
export const useGetAllInOnePassDetailQuery = (id?: number) =>
  useQuery({
    queryKey: [allInOnePassDetailQueryKey, id],
    enabled: id != null,
    queryFn: () => {
      const detail = id != null ? passDetailFixtures[id] : undefined;
      if (!detail) {
        return Promise.reject(new Error('존재하지 않는 패스입니다.'));
      }
      // 원본 시드를 수정하지 않도록 깊은 복사본을 반환
      return mockDelay(structuredClone(detail) as PassFormInput);
    },
  });
