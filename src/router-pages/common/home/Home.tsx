import TopBanner from '@/components/common/home/new/banner/TopBanner';
import Popup from '@/components/common/home/new/ui/Popup';
import ActiveProgramSection from '@components/common/home/section/ActiveProgramSection';
import BlogCurationSection from '@components/common/home/section/BlogCurationSection';
import BottomBannerSection from '@components/common/home/section/BottomBannerSection';
import CurrentBlogSection from '@components/common/home/section/CurrentBlogSection';
import InterviewSection from '@components/common/home/section/InterviewSection';
import IntroSection from '@components/common/home/section/IntroSection';
import LetsCareerSection from '@components/common/home/section/LetsCareerSection';
import LogoPlaySection from '@components/common/home/section/LogoPlaySection';
import MainBannerSection from '@components/common/home/section/MainBannerSection';
import MainCurationSection from '@components/common/home/section/MainCurationSection';
import ReviewCurationSection from '@components/common/home/section/ReviewCurationSection';
import ReviewSection from '@components/common/home/section/ReviewSection';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  return (
    <>
      <TopBanner />
      <div className="mb-20 flex w-full flex-col items-center justify-center pt-9 md:mb-44 md:pt-[68px]">
        <IntroSection />
        <MainBannerSection />
        <MainCurationSection />
        <ActiveProgramSection />
        <LetsCareerSection />
        <ReviewSection />
        <ReviewCurationSection />
        <LogoPlaySection />
        <BottomBannerSection />
        <InterviewSection />
        <CurrentBlogSection />
        <BlogCurationSection />
      </div>
      <Popup />
    </>
  );
};

export default Home;
