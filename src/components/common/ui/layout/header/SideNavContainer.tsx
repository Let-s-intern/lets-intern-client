import { useUserQuery } from '@/api/user';
import { twMerge } from '@/lib/twMerge';
import useAuthStore from '@/store/useAuthStore';
import { ReactNode } from 'react';
import KakaoChannel from './KakaoChannel';
import LoginLink from './LoginLink';
import SignUpLink from './SignUpLink';

interface Props {
  children?: ReactNode;
  isNextRouter: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function SideNavContainer({ children, isNextRouter, isOpen, onClose }: Props) {
  const { isLoggedIn, logout } = useAuthStore();

  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });

  return (
    <div
      id="sideNavigation"
      className={twMerge(
        'fixed right-0 top-0 z-50 flex h-screen w-[80vw] flex-col bg-white shadow-md transition-all duration-300 sm:w-[22rem]',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="flex w-full flex-row-reverse items-center p-2.5">
        <i
          className="h-6 w-6 cursor-pointer"
          aria-label="메뉴 닫기"
          aria-controls="sideNavigation"
          aria-expanded={isOpen}
          onClick={onClose}
        >
          <img className="h-auto w-full" src="/icons/x-close.svg" alt="" />
        </i>
      </div>
      <hr />
      <div className="flex h-full flex-col gap-4 overflow-y-auto pb-36 scrollbar-hide">
        <KakaoChannel />
        <div className="mx-5 flex justify-between">
          {isLoggedIn ? (
            <span className="flex w-full items-center justify-between gap-4 text-xsmall16 font-medium text-neutral-0 sm:p-0">
              <span>
                환영합니다, <span className="text-primary">{user?.name}</span>님
              </span>
              <button
                type="button"
                className="text-primary"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                  onClose();
                }}
              >
                로그아웃
              </button>
            </span>
          ) : (
            <div className="flex gap-6">
              <LoginLink
                className="p-0 font-medium"
                isNextRouter={isNextRouter}
                force={isNextRouter}
                onClick={() => onClose()}
              />
              <SignUpLink
                className="bg-transparent p-0 font-medium"
                isNextRouter={isNextRouter}
                force={isNextRouter}
                onClick={() => onClose()}
              />
            </div>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-2" onClick={onClose}>
          {children}
        </nav>
      </div>
    </div>
  );
}

export default SideNavContainer;
