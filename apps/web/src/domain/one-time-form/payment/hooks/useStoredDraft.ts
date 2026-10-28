import { useEffect, useState } from 'react';
import { readDraft, type OneTimeFormDraft } from '../../utils/applicationDraft';

/**
 * 결제 단계가 쓰는 보관 입력값. sessionStorage 는 브라우저에만 있으므로 마운트 뒤에 읽는다.
 * 읽기 전에는 undefined, 없거나 깨졌으면 null.
 */
const useStoredDraft = (slug: string) => {
  const [draft, setDraft] = useState<OneTimeFormDraft | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setDraft(readDraft(slug));
  }, [slug]);

  return draft;
};

export default useStoredDraft;
