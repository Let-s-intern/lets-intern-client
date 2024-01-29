import FeatureSection from './components/FeatureSection';
import Header from './components/Header';
import ProgramSection from './components/ProgramSection';
import ReviewSection from './components/ReviewSection';

const Home = () => {
  return (
    <div className="flex flex-col gap-12">
      <Header />
      <ProgramSection />
      <FeatureSection />
      <ReviewSection />
      {/* <NewsSection /> */}
    </div>
  );
};

export default Home;
