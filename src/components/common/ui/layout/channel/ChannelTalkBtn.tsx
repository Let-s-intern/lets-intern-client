'use client';

import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';

import channelService from '@/ChannelService';
import { twMerge } from '@/lib/twMerge';
import { usePathname } from 'next/navigation';

const programDetailPathRegex = /^\/program\/(live|challenge|vod)\/\d+/; // 프로그램 상세페이지
const ChannelTalkBtn = () => {
  const pathname = usePathname() ?? '';
  const isUpTo991 = useMediaQuery('(max-width: 991px)');
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');

  const [isHidden, setIsHidden] = useState(false);
  const [alert, setAlert] = useState(0);

  useEffect(() => {
    if (!window.ChannelIO) {
      channelService.loadScript();
      channelService.boot({
        pluginKey: '3acfb692-c643-456f-86e8-dd64da454947',
        customLauncherSelector: '#custom-channel-button',
        hideChannelButtonOnBoot: true,
      });
    }

    // 버튼 표시/숨김
    channelService.onShowMessenger(() => setIsHidden(true));
    channelService.onHideMessenger(() => setIsHidden(false));
    // 채팅 알림 이벤트 설정
    channelService.onBadgeChanged((unread, alert) => {
      setAlert(alert);
    });
  }, []);

  /** 특정 페이지에서 버튼 숨김 */
  useEffect(() => {
    // 결제 페이지
    if (pathname.endsWith('payment')) setIsHidden(true);
  }, [pathname]);

  return (
    <button
      id="custom-channel-button"
      className={twMerge(
        'fixed right-4 z-30 flex w-32 items-center rounded-full bg-neutral-100 shadow-05 md:right-6 md:w-36',
        programDetailPathRegex.test(pathname) ||
          (pathname.startsWith('/report') && isUpTo1280) ||
          pathname.startsWith('/report/landing') ||
          (pathname.startsWith('/payment-input') && isUpTo991)
          ? 'bottom-32'
          : 'bottom-20',
        isHidden && 'hidden',
      )}
      onClick={() => channelService.showMessenger()}
    >
      <div className="flex flex-1 items-center justify-center pl-2 text-xsmall14 font-semibold md:text-xsmall16">
        문의하기
      </div>
      <div className="flex h-12 w-12 translate-x-px items-center justify-center rounded-full bg-primary sm:h-14 sm:w-14">
        <img
          className="h-7 w-7 sm:h-8 sm:w-8"
          src="/icons/channel.svg"
          alt="렛츠커리어 채널톡 로고"
        />
      </div>
      {/* 안 읽은 알람 표시 */}
      {alert > 0 && (
        <div className="text-0.75 absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-system-error text-static-100 sm:h-6 sm:w-6">
          {alert}
        </div>
      )}
    </button>
  );
};

export default ChannelTalkBtn;
