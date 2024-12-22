import { memo } from 'react';

import channelService from '@/ChannelService';

function FaqDropdown() {
  return (
    <div className="mx-auto flex flex-col items-center gap-3 rounded-md bg-neutral-95 px-8 py-4 md:w-full md:max-w-[800px] md:flex-row md:items-center md:justify-between">
      <span className="text-xsmall14 font-semibold text-neutral-35 md:text-small20">
        아직 궁금증이 풀리지 않았다면?
      </span>
      <button
        className="rounded-sm border border-neutral-70 bg-white px-5 py-3 text-xsmall14 font-medium md:px-6 md:text-small18"
        onClick={() => channelService.showMessenger()}
      >
        1:1 채팅 문의하기
      </button>
    </div>
  );
}

export default memo(FaqDropdown);
