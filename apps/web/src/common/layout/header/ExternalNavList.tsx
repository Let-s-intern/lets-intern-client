import { buildCrossAppUrl } from '@/common/utils/crossAppUrl';
import GlobalNavItem from './GlobalNavItem';

interface Props {
  isLoggedIn: boolean;
  isAdmin: boolean | undefined;
}

function ExternalNavList({ isLoggedIn, isAdmin }: Props) {
  const adminHref = buildCrossAppUrl(process.env.NEXT_PUBLIC_ADMIN_URL, '/');
  return (
    <div className="hidden items-center gap-1 md:flex">
      <GlobalNavItem
        className="notice_gnb text-xsmall16 font-normal text-neutral-30"
        href="https://letscareer.oopy.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        공지사항
      </GlobalNavItem>
      <span className="text-neutral-30" aria-hidden="true">
        ·
      </span>
      <GlobalNavItem
        className="q&a_gnb text-xsmall16 font-normal text-neutral-30"
        href="https://letscareer.oopy.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        자주 묻는 질문
      </GlobalNavItem>
      {isLoggedIn && isAdmin && (
        <GlobalNavItem
          className="ml-4 inline-block text-xsmall16 font-normal text-neutral-30"
          href={adminHref}
        >
          관리자 페이지
        </GlobalNavItem>
      )}
    </div>
  );
}

export default ExternalNavList;
