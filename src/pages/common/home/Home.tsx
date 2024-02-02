import FeatureSection from '../../../components/common/home/section/FeatureSection';
import HomeHeader from '../../../components/common/home/header/HomeHeader';
import ProgramSection from '../../../components/common/home/section/ProgramSection';
import ReviewSection from '../../../components/common/home/section/ReviewSection';

const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <HomeHeader />
      <ProgramSection />
      <FeatureSection />
      <ReviewSection />
      {/* <NewsSection /> */}
    </div>
  );
};

export default Home;
