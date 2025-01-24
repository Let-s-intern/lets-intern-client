import { useNavigate } from 'react-router-dom';

import { useControlScroll } from '@/hooks/useControlScroll';
import useHasScroll from '@/hooks/useHasScroll';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';
import BackHeader from '../ui/BackHeader';
import BaseButton from '../ui/button/BaseButton';

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  onSubmit?: () => void; // 리뷰 등록하기
}

/** 마이페이지 후기 작성(생성) 모달
 * [주의] 모바일에서는 모달처럼 안 보임 */
function ReviewModal({ children, disabled, onSubmit }: Props) {
  const navigate = useNavigate();

  const isDesktop = useMediaQuery('(min-width:768px)');
  const { scrollRef, hasScroll } = useHasScroll();
  useControlScroll(isDesktop); // 데스크탑(모달)에서는 body 스크롤 제어

  return (
    // 바탕
    <div className="mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center md:py-24">
      <main className="relative bg-white md:overflow-hidden md:rounded-ms">
        <div
          ref={scrollRef}
          className={twMerge(
            'w-full px-5 pb-8 md:h-full md:w-[45rem] md:overflow-y-auto md:pb-32 md:pl-12 md:pt-6',
            // 스크롤 너비를 padding에서 제외 (치우침 방지)
            hasScroll ? 'pr-8' : 'pr-12',
          )}
        >
          <div className="flex items-center justify-between">
            <BackHeader to="/mypage/review" hideBack={isDesktop}>
              후기 작성하기
            </BackHeader>
            {/* 데스크탑 전용 닫기 버튼 */}
            <img
              src="/icons/menu_close_md.svg"
              alt="close"
              className="hidden h-6 w-6 cursor-pointer md:block"
              onClick={() => navigate('/mypage/review')}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-8">
            {children}

            {/* 모바일 버튼 */}
            <BaseButton
              className="md:hidden"
              onClick={onSubmit}
              disabled={disabled}
            >
              등록하기
            </BaseButton>
          </div>
        </div>
        {/* 데스크탑 버튼 (아래 고정) */}
        <div className="sticky inset-x-0 bottom-0 hidden bg-white px-14 pb-8 pt-6 drop-shadow-[0_-3px_6px_0_rgba(0,0,0,0.04)] md:block">
          <BaseButton className="w-full" onClick={onSubmit} disabled={disabled}>
            등록하기
          </BaseButton>
        </div>
      </main>
    </div>
  );
}

export default ReviewModal;
