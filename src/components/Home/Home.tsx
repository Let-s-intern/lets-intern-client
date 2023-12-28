import FeatureSection from './FeatureSection';
import Header from './Header';
import ProgramSection from './ProgramSection';
import ReviewSection from './ReviewSection';
import NewsSection from './NewsSection';

import './index.scss';

const Home = () => {
  return (
    <div className="homepage">
      <Header />
      <ProgramSection />
      <FeatureSection />
      <ReviewSection />
      <NewsSection />
    </div>
  );
};

export default Home;
