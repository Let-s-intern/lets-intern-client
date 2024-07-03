import Heading from '../ui/Heading';
import LogoGroup from './LogoGroup';

const PassReviewSection = () => {
  return (
    <section className="flex flex-col gap-6 px-5">
      <Heading>
        렛츠커리어인들은 <br className="sm:hidden" />
        어디서 커리어를 시작했을까요?
      </Heading>
      <div className="flex items-center gap-12 overflow-hidden">
        <LogoGroup />
        <LogoGroup />
      </div>
    </section>
  );
};

export default PassReviewSection;
