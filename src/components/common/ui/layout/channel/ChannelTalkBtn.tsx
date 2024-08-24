import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import channelService from '../../../../../ChannelService';

const programDetailPathRegex = /^\/program\/(live|challenge|vod)\/\d+$/; // /program/live/:programId

const ChannelTalkBtn = () => {
  const location = useLocation();
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

  return (
    <button
      id="custom-channel-button"
      className={clsx(
        (programDetailPathRegex.test(location.pathname) && isUpTo991) ||
          (location.pathname.startsWith('/report') && isUpTo1280)
          ? 'bottom-32'
          : 'bottom-20',
        {
          hidden: isHidden,
        },
        'fixed right-4 z-10 flex items-center rounded-[25rem] bg-neutral-100 shadow-05',
      )}
    >
      <div className="text-1-medium sm:text-1.125-medium flex w-20 items-center justify-center pl-2 sm:h-[4.25rem] sm:w-[105px]">
        채팅문의
      </div>
      <div className="flex h-14 w-14 translate-x-px items-center justify-center rounded-full bg-primary sm:h-[4.25rem] sm:w-[4.25rem]">
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
