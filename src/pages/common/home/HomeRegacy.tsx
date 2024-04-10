import FeatureSection from '../../../components/common/home/regacy/section/FeatureSection';
import HomeHeader from '../../../components/common/home/regacy/header/HomeHeader';
import ProgramSection from '../../../components/common/home/regacy/section/ProgramSection';
import ReviewSection from '../../../components/common/home/regacy/section/ReviewSection';

const HomeRegacy = () => {
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

export default HomeRegacy;
