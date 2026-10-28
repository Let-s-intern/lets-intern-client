import type { AdminOneTimeForm } from '@/api/one-time-form/oneTimeFormSchema';

import { buildApplyUrl, buildMyUrl } from '../utils/formLinks';
import { buildPopupCode } from '../utils/popupCode';
import LinkCopyRow from './LinkCopyRow';

// VITE_WEB_URL 미설정 시 웹 주소 없이 경로만 남는다(AdminSidebar 와 같은 기준)
const WEB_URL = import.meta.env.VITE_WEB_URL ?? '';

interface OneTimeFormLinkPanelProps {
  form: Pick<AdminOneTimeForm, 'slug' | 'isVisible'>;
  webBase?: string;
}

/** 링크 복사 세 가지(PRD 5·7절). 저장된 slug 기준이다 */
const OneTimeFormLinkPanel = ({
  form,
  webBase = WEB_URL,
}: OneTimeFormLinkPanelProps) => {
  const applyUrl = buildApplyUrl(webBase, form.slug);

  return (
    <section className="border-neutral-80 flex flex-col gap-5 rounded-md border p-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-small18 text-neutral-0 font-bold">링크 복사</h3>
        {!form.isVisible && (
          <p className="text-xsmall14 text-neutral-40">
            비공개 폼입니다. 공개로 저장해야 링크가 열립니다.
          </p>
        )}
      </div>
      <LinkCopyRow label="신청 URL" value={applyUrl} />
      <LinkCopyRow
        label="팝업용 코드"
        description="상세페이지 신청 버튼에 넣습니다. 상세페이지 주소의 utm_* 를 신청 URL 에 옮겨 붙여 팝업으로 엽니다."
        value={buildPopupCode(applyUrl)}
        isCode
      />
      <LinkCopyRow
        label="신청 확인·취소 URL"
        value={buildMyUrl(webBase, form.slug)}
      />
    </section>
  );
};

export default OneTimeFormLinkPanel;
