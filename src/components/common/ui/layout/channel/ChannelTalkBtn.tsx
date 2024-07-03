import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import channelService from '../../../../../ChannelService';

const programDetailPathRegex = /^\/program\/(live|challenge|vod)\/\d+$/; // /program/live/:programId

const ChannelTalkBtn = () => {
  const location = useLocation();

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!window.ChannelIO) {
      channelService.loadScript();
      channelService.boot({
        pluginKey: '3acfb692-c643-456f-86e8-dd64da454947',
        customLauncherSelector: '#custom-channel-button',
        hideChannelButtonOnBoot: true,
      });
      channelService.onShowMessenger(() => setIsHidden(true));
      channelService.onHideMessenger(() => setIsHidden(false));
    }
  }, []);

  return (
    <button
      id="custom-channel-button"
      className={clsx(
        'fixed bottom-20 right-4 flex items-center rounded-[25rem] bg-neutral-100 shadow-05',
        { hidden: programDetailPathRegex.test(location.pathname) || isHidden },
      )}
    >
      <div className="text-1-medium sm:text-1.125-medium flex w-20 items-center justify-center pl-2 sm:h-[4.25rem] sm:w-[105px]">
        채팅문의
      </div>
      <div className="flex h-14 w-14 translate-x-px items-center justify-center rounded-full bg-primary sm:h-[4.25rem] sm:w-[4.25rem]">
        <img
          className="h-7 w-7 sm:h-8 sm:w-8"
          src="/icons/channel.png"
          alt="렛츠커리어 채널톡 로고"
        />
      </div>
    </button>
  );
};

export default ChannelTalkBtn;
