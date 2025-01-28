import { useNavigate } from 'react-router-dom';

import { useControlScroll } from '@/hooks/useControlScroll';
import useHasScroll from '@/hooks/useHasScroll';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import BackHeader from '../ui/BackHeader';
import BaseButton from '../ui/button/BaseButton';
import ReviewExitModal from './ReviewExitModal';

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  onSubmit?: () => void; // 리뷰 등록하기
  title?: string;
  isLastMission?: boolean;
  onClose?: () => void;
  readOnly?: boolean;
}

/** 마이페이지 후기 작성(생성) 모달
 * [주의] 모바일에서는 모달처럼 안 보임 */
function ReviewModal({
  children,
  disabled,
  onSubmit,
  title,
  isLastMission,
  onClose,
  readOnly,
}: Props) {
  const navigate = useNavigate();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');
  const { scrollRef, hasScroll } = useHasScroll();
  useControlScroll(isDesktop); // 데스크탑(모달)에서는 body 스크롤 제어

  const buttonText = isLastMission ? '제출하기' : '등록하기';

  // useEffect(() => {
  //   if (typeof window === 'undefined') return;

  //   const handlePopstate = () => {

  //     console.log('뒤로가기 감지', window.history.state);

  //     history.go(1); // 뒤로가기 방지
  //   };
  //   history.pushState(null, '', location.href); // 뒤로가기 방지

  //   window.addEventListener('popstate', handlePopstate);

  //   return () => {
  //     window.removeEventListener('popstate', handlePopstate);
  //   };
  // }, [isExitOpen]);

  return (
    <>
      {/* 바탕 */}
      <div className="mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center md:py-24">
        <main className="relative bg-white md:overflow-hidden md:rounded-ms">
          <div
            ref={scrollRef}
            className={twMerge(
              'w-full px-5 pb-8 md:h-full md:w-[45rem] md:overflow-y-auto md:pl-12 md:pt-6',
              // 스크롤 너비를 padding에서 제외 (치우침 방지)
              hasScroll ? 'pr-8' : 'pr-12',
              isLastMission ? 'md:pb-40' : 'md:pb-32',
              readOnly && 'md:pb-8',
            )}
          >
            <div className="flex items-center justify-between">
              <BackHeader to="/mypage/review" hideBack={isDesktop}>
                {title ?? `${readOnly ? '후기 확인하기' : '후기 작성하기'}`}
              </BackHeader>
              {/* 데스크탑 전용 닫기 버튼 */}
              {!isLastMission && (
                <img
                  src="/icons/menu_close_md.svg"
                  alt="close"
                  className="hidden h-6 w-6 cursor-pointer md:block"
                  onClick={() => {
                    if (readOnly) {
                      navigate('/mypage/review', { replace: true });
                    } else {
                      setIsExitOpen(true);
                    }
                  }}
                />
              )}
            </div>

            <div className="flex flex-col gap-16 md:gap-8">
              {children}

              {/* 모바일 버튼 */}
              <BaseButton
                className={`md:hidden ${readOnly ? 'hidden' : ''}`}
                onClick={onSubmit}
                disabled={disabled}
              >
                {buttonText}
              </BaseButton>
            </div>
          </div>
          {/* 데스크탑 버튼 (아래 고정) */}
          <div
            className={clsx(
              'sticky inset-x-0 bottom-0 hidden gap-y-4 bg-white px-14 pb-8 pt-6 drop-shadow-[0_-3px_6px_0_rgba(0,0,0,0.04)] md:flex flex-col items-center',
              { 'md:hidden': readOnly },
            )}
          >
            <BaseButton
              className="w-full text-small18 font-medium"
              onClick={onSubmit}
              disabled={disabled}
            >
              {buttonText}
            </BaseButton>
            {isLastMission && (
              <span
                className="text-small18 font-medium text-neutral-50 cursor-pointer hover:underline"
                onClick={() => onClose && onClose()}
              >
                다음에 할게요
              </span>
            )}
          </div>
        </main>
      </div>
      <ReviewExitModal
        isOpen={isExitOpen}
        onClose={() => setIsExitOpen(false)}
        onClickConfirm={() => navigate('/mypage/review', { replace: true })}
      />
    </>
  );
}

export default ReviewModal;
