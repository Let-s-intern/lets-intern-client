import SectionNav from '@/common/nav/SectionNav';
import FaqSection from '@/domain/pass-certification/section/FaqSection';
import FormSection from '@/domain/pass-certification/section/FormSection';
import IntroSection from '@/domain/pass-certification/section/IntroSection';
import LetterSection from '@/domain/pass-certification/section/LetterSection';
import PassCaseSection from '@/domain/pass-certification/section/PassCaseSection';
import ProcessSection from '@/domain/pass-certification/section/ProcessSection';
import RewardSection from '@/domain/pass-certification/section/RewardSection';
import { PASS_NAV_ITEMS } from '@/domain/pass-certification/section/sectionIds';

export default function PassCertificationPage() {
  return (
    <>
      <IntroSection />
      <SectionNav items={PASS_NAV_ITEMS} />
      <RewardSection />
      <PassCaseSection />
      <ProcessSection />
      <LetterSection />
      <FormSection />
      <FaqSection />
    </>
  );
}
