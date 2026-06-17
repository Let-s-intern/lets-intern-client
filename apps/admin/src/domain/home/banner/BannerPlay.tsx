import { IoIosPause } from 'react-icons/io';

interface BannerPlayProps {
  setIsPlay: React.Dispatch<React.SetStateAction<boolean>>;
  isPlay: boolean;
  bannerIndex: number;
  length: number;
}

const BannerPlay = ({
  setIsPlay,
  isPlay,
  bannerIndex,
  length,
}: BannerPlayProps) => {
  return (
    <div className="absolute bottom-4 left-5 flex items-center gap-1.5 md:bottom-6 md:left-8">
      {isPlay ? (
        <img
          onClick={() => setIsPlay(false)}
          className="w-5 cursor-pointer"
          src="/icons/play.svg"
          alt="배너 페이지네이션 재생 아이콘"
        />
      ) : (
        <IoIosPause
          className="cursor-pointer"
          size={20}
          color="white"
          onClick={() => setIsPlay(true)}
        />
      )}

      <span className="text-0.75-medium md:text-0.875-medium">
        {bannerIndex + 1 < 10 ? `0${bannerIndex + 1}` : bannerIndex + 1} /{' '}
        {length < 10 ? `0${length}` : length}
      </span>
    </div>
  );
};

export default BannerPlay;
