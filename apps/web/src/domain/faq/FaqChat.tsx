import { memo } from 'react';

import channelService from '@/ChannelService';

function FaqChat() {
  return (
    <div className="bg-neutral-95 mx-auto flex flex-col items-center gap-3 rounded-md px-8 py-4 md:w-full md:max-w-[800px] md:flex-row md:items-center md:justify-between">
      <span className="text-xsmall14 text-neutral-35 md:text-small20 font-semibold">
        아직 궁금증이 풀리지 않았다면?
      </span>
      <button
        className="border-neutral-70 text-xsmall14 md:text-small18 rounded-sm border bg-white px-5 py-3 font-medium md:px-6"
        onClick={() => channelService.showMessenger()}
      >
        1:1 채팅 문의하기
      </button>
    </div>
  );
}

export default memo(FaqChat);
