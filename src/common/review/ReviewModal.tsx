import { useControlScroll } from '@/hooks/useControlScroll';
import { twMerge } from '@/lib/twMerge';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { josa } from 'es-hangul';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BaseButton from '../button/BaseButton';
import BackHeader from '../header/BackHeader';
import ReviewExitModal from './ReviewExitModal';

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  onSubmit?: () => void; // 리뷰 등록하기
  title?: string;
  isLastMission?: boolean;
  onClose?: () => void;
  readOnly?: boolean;
  programTitle?: string;
  className?: string;
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
  programTitle,
  className,
}: Props) {
  const router = useRouter();
  const [isExitOpen, setIsExitOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width:768px)');

  useControlScroll(isDesktop); // 데스크탑(모달)에서는 body 스크롤 제어

  const buttonText = isLastMission ? '제출하기' : '등록하기';

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!readOnly) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [readOnly]);

  return (
    <>
      {/* 바탕 */}
      <div
        className={twMerge(
          'mx-auto bg-neutral-0/50 md:fixed md:inset-0 md:z-50 md:flex md:flex-col md:items-center md:justify-center md:py-24',
          className,
        )}
        onClick={() => {
          if (readOnly) {
            if (onClose) {
              onClose();
            } else {
              router.replace('/mypage/review');
            }
          }
        }}
      >
        <div
          className="relative bg-white md:overflow-hidden md:rounded-ms"
          onClick={(e) => e.stopPropagation()} // 바탕 클릭 시 모달 닫힘 방지
        >
          <div
            className={twMerge(
              'relative flex h-full w-screen flex-col px-5 pb-8 md:w-[45rem] md:px-12 md:pt-6',
              isLastMission ? 'md:pb-40' : 'md:pb-32',
              readOnly && 'md:pb-8',
            )}
          >
            <div
              className={twMerge(
                'flex w-full items-center justify-between bg-white',
                !isDesktop ? 'sticky left-0 top-[3.75rem] z-10' : '',
              )}
            >
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
                      if (onClose) {
                        onClose();
                      } else {
                        router.replace('/mypage/review');
                      }
                    } else {
                      setIsExitOpen(true);
                    }
                  }}
                />
              )}
            </div>
            <div className="w-full flex-1 md:overflow-y-auto">
              {isLastMission && programTitle && (
                <p className="mb-8 text-xsmall16 font-medium text-neutral-20">
                  참여한 {josa(programTitle, '을/를')} 회고하고,
                  <br />나 자신이 얼마나 성장했는지 확인해보세요!
                </p>
              )}

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
          </div>
          {/* 데스크탑 버튼 (아래 고정) */}
          <div
            className={clsx(
              'sticky inset-x-0 bottom-0 hidden flex-col items-center gap-y-4 bg-white px-14 pb-8 pt-6 drop-shadow-[0_-3px_6px_0_rgba(0,0,0,0.04)] md:flex',
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
                className="cursor-pointer text-small18 font-medium text-neutral-50 hover:underline"
                onClick={() => {
                  if (onClose) {
                    onClose();
                    alert('미션 제출이 완료되었습니다.');
                  }
                }}
              >
                다음에 할게요
              </span>
            )}
          </div>
        </div>
      </div>
      <ReviewExitModal
        isOpen={isExitOpen}
        onClose={() => setIsExitOpen(false)}
        onClickConfirm={() => {
          if (onClose) {
            onClose();
          } else {
            router.replace('/mypage/review');
          }
        }}
      />
    </>
  );
}

export default ReviewModal;
