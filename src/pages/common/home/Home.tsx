import FeatureSection from '../../../components/common/section/home/FeatureSection';
import HomeHeader from '../../../components/common/header/HomeHeader';
import ProgramSection from '../../../components/common/section/home/ProgramSection';
import ReviewSection from '../../../components/common/section/home/ReviewSection';

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
