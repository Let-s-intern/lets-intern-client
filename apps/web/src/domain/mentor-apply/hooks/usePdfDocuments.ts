import { userDocumentListQueryOptions } from '@/api/user/user';
import useAuthStore from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';

import { isPdfDocument } from '../utils/isPdfDocument';

/** 서류 정리의 PDF 문서. 비로그인이면 부르지 않는다 */
export function usePdfDocuments() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data: documents } = useQuery({
    ...userDocumentListQueryOptions,
    enabled: isLoggedIn,
    select: (data) => data.userDocumentList.filter(isPdfDocument),
  });

  return { isLoggedIn, documents };
}
