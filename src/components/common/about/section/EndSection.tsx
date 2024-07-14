import { Link } from 'react-router-dom';

const EndSection = () => {
  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-primary py-[6.25rem]">
      {/* Background */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <img className="h-5/6 scale-x-125" src="/images/about-end-bg.png" />
      </div>
      <div className="absolute inset-0 mix-blend-soft-light">
        <img className="h-full w-full" src="/images/blend.png" />
      </div>

      <h2 className="text-1.75-bold text-center text-static-100">
        커리어의 첫 걸음️
        <br />
        <span className="text-primary-xlight">렛츠커리어</span>가 응원해요!
      </h2>
      <Link className="z-10" to="/program">
        <button className="text-1.125-bold mt-10 rounded-full bg-static-100 px-6 py-3 text-primary">
          렛츠커리어 프로그램 둘러보기
        </button>
      </Link>
    </section>
  );
};

export default EndSection;
