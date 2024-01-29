import { Link } from 'react-router-dom';

const BottomSection = () => {
  return (
    <section className="flex h-28 items-center justify-center bg-[#232233]">
      <div className="rounded border border-solid border-white text-sm text-white">
        <Link to="/" className="block px-4 py-0.5">
          선순환에 동참하기
        </Link>
      </div>
    </section>
  );
};

export default BottomSection;
