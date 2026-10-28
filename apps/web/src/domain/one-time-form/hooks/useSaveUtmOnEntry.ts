import { useEffect } from 'react';
import { collectUtm, saveUtmOnce } from '../utils/utmStorage';

/** /form/[slug] 진입 시 한 번 UTM 과 referrer 를 보관한다(이미 있으면 그대로 둔다) */
const useSaveUtmOnEntry = (slug: string) => {
  useEffect(() => {
    saveUtmOnce(slug, collectUtm(window.location.search, document.referrer));
  }, [slug]);
};

export default useSaveUtmOnEntry;
