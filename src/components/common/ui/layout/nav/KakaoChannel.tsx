import { useEffect } from 'react';

const KakaoChannel = () => {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('fe2307dd60e05ff8cbb06d777a13e31c');
    }
  }, []);

  const onClickAddChannel = () => {
    window.Kakao.Channel.followChannel({
      channelPublicId: '_tCeHG',
    })
      .then((response: any) => {
        console.log('채널 추가 성공');
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full px-1.5 py-2">
      <button
        className="flex w-full items-center justify-center gap-x-3 rounded-md bg-[#FEE500] px-6 py-3"
        onClick={onClickAddChannel}
      >
        <img src="/images/kakao_channel.png" alt="카카오 채널 추가" />
        <p className="font-medium">채널 추가하고, 프로그램 모집 알림 받기</p>
      </button>
    </div>
  );
};

export default KakaoChannel;
