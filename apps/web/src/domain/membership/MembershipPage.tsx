import './styles/membership.css';
import HeroSection from './section/HeroSection';
import SolutionSection from './section/SolutionSection';
import BenefitsSection from './section/BenefitsSection';
import ProofSection from './section/ProofSection';
import PlansSection from './section/PlansSection';
import ReviewsSection from './section/ReviewsSection';
import RoadmapSection from './section/RoadmapSection';
import FinalCtaSection from './section/FinalCtaSection';
import FaqSection from './section/FaqSection';
import MembershipCTAButtons from './MembershipCTAButtons';

export default function MembershipPage() {
  return (
    <main>
      <HeroSection />
      <SolutionSection />
      <BenefitsSection />
      <ProofSection />
      <PlansSection />
      <ReviewsSection />
      <RoadmapSection />
      <FinalCtaSection />
      <FaqSection />
      <MembershipCTAButtons />
    </main>
  );
}
