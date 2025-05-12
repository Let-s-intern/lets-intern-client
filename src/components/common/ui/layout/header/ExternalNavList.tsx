import GlobalNavItem from './GlobalNavItem';

interface Props {
  isNextRouter: boolean;
}

function ExternalNavList({ isNextRouter }: Props) {
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
    </div>
  );
}

export default ExternalNavList;
