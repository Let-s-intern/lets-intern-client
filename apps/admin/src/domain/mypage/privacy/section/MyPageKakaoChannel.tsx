import { useEffect } from 'react';

const MyPageKakaoChannel = () => {
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
    <div
      className="flex cursor-pointer items-center justify-between rounded-md bg-[#FEE500] px-5 py-4"
      onClick={onClickAddChannel}
    >
      <div>
        <h1 className="text-lg font-semibold text-neutral-0 text-opacity-[88%]">
          렛츠커리어 채널 친구 추가
        </h1>
        <p className="text-sm text-neutral-0 text-opacity-[52%]">
          렛츠커리어 카카오톡 채널을 추가하고,
          <br />
          프로그램 모집 및 혜택 알림을 가장 먼저 받을 수 있어요.
        </p>
      </div>
      <img
        src="/images/kakao_channel.png"
        width={50}
        height={50}
        alt="카카오 채널 추가"
      />
    </div>
  );
};

export default MyPageKakaoChannel;
