import FeatureSection from './Section/FeatureSection';
import Header from './Section/Header';
import ProgramSection from './Section/ProgramSection';
import ReviewSection from './Section/ReviewSection';

import './Home.scss';

const Home = () => {
  return (
    <div className="homepage">
      <Header />
      <ProgramSection />
      <FeatureSection />
      <ReviewSection />
      {/* <NewsSection /> */}
    </div>
  );
};

export default Home;
