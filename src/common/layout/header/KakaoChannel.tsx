'use client';

import { useEffect } from 'react';

const KakaoChannel = () => {
  useEffect(() => {
    if (!window.Kakao?.isInitialized()) {
      window.Kakao?.init('fe2307dd60e05ff8cbb06d777a13e31c');
    }
  }, []);

  const onClickAddChannel = () => {
    window.Kakao.Channel.followChannel({
      channelPublicId: '_tCeHG',
    })
      .then((response: any) => {})
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <button
      className="flex w-full items-center justify-start gap-x-3 bg-[#FEE500] px-6 py-3 sm:justify-center"
      onClick={onClickAddChannel}
    >
      <img src="/images/kakao_channel.png" alt="카카오 채널 추가" />
      <p className="break-keep text-start font-medium">
        채널 추가하고 <br className="sm:hidden" />
        프로그램 모집 알림 받기
      </p>
    </button>
  );
};

export default KakaoChannel;
