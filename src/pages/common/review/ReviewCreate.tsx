import ConfirmSection from '../../../components/common/review/section/ConfirmSection';
import StarScoreSection from '../../../components/common/review/section/StarScoreSection';
import TenScoreSection from '../../../components/common/review/section/TenScroeSection';
import TextAreaSection from '../../../components/common/review/section/TextAreaSection';

const ReviewCreate = () => {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-16 pb-16 pt-8">
      <StarScoreSection />
      <TenScoreSection />
      <TextAreaSection />
      <ConfirmSection />
    </main>
  );
};

export default ReviewCreate;
