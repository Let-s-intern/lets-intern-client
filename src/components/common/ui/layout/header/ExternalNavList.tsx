import GlobalNavItem from './GlobalNavItem';

interface Props {
  isNextRouter: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean | undefined;
}

function ExternalNavList({ isNextRouter, isLoggedIn, isAdmin }: Props) {
  return (
    <div className="flex items-center gap-1">
      <GlobalNavItem
        className="notice_gnb text-xsmall16 font-normal text-neutral-30"
        href="https://letscareer.oopy.io"
        isNextRouter={isNextRouter}
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
        isNextRouter={isNextRouter}
        target="_blank"
        rel="noopener noreferrer"
      >
        자주 묻는 질문
      </GlobalNavItem>
      {isLoggedIn && isAdmin && (
        <GlobalNavItem
          className="q&a_gnb ml-4 text-xsmall16 font-normal text-neutral-30"
          href="/admin"
          isNextRouter={isNextRouter}
          force
        >
          관리자 페이지
        </GlobalNavItem>
      )}
    </div>
  );
}

export default ExternalNavList;
