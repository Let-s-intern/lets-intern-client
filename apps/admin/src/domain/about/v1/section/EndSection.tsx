import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

const EndSection = () => {
  const matches = useMediaQuery('(max-width: 991px)');

  return (
    <section className="bg-primary relative flex flex-col items-center overflow-hidden py-[6.25rem] xl:py-[8.75rem]">
      <h2 className="text-1.75-bold xl:text-2.25-bold text-static-100 text-center">
        커리어의 첫 걸음️
        <br />
        <span className="text-primary-xlight">렛츠커리어</span>가 응원해요!
      </h2>
      <Link className="z-10" to="/program">
        <button className="text-1.125-bold md:text-1.25-bold xl:text-1.5-bold bg-static-100 text-primary mt-10 rounded-full px-6 py-3">
          렛츠커리어 프로그램 둘러보기
        </button>
      </Link>

      {/* Background */}
      <div
        className={`absolute inset-y-0 left-0 ${matches && 'right-0'} flex flex-col justify-end`}
      >
        <img
          className="h-5/6 scale-x-125 sm:scale-110 lg:scale-x-100"
          src="/images/about-end-bg.png"
        />
      </div>
      <div className="absolute inset-0 mix-blend-soft-light">
        <img className="h-full w-full" src="/images/blend.png" />
      </div>
    </section>
  );
};

export default EndSection;
