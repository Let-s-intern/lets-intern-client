import ChannelTalkBtn from '@/components/common/ui/layout/channel/ChannelTalkBtn';

const Maintenance = () => {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <img
          className="h-auto w-24"
          src="/images/maintenance/maintenance.png"
          alt="렛츠커리어 아이콘"
        />
        <h1 className="text-neutral-black text-center text-medium22 font-semibold sm:text-medium24">
          렛츠커리어 서버점검 안내
        </h1>
        <p className="mt-2 text-center text-xsmall14 sm:text-xsmall16">
          안정적인 서비스를 제공하기 위해 아래 일정동안,
          <br /> 서버 점검이 진행될 예정입니다.
          <br />
          <br />
          <span className="font-bold">
            작업시간: 2024.09.23(월) 00:00 ~ 06:00
          </span>
          <br />
          <br />
          이용에 불편을 드려 죄송하며,
          <br />더 나은 서비스를 제공할 수 있도록 최선을 다하겠습니다.
          <br />
          <br />
          문의: official@letscareer.co.kr 혹은 우측 아래 채팅문의
        </p>
      </div>
      <ChannelTalkBtn />
    </>
  );
};

export default Maintenance;
