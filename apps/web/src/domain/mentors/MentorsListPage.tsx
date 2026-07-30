import BannerSection from './section/BannerSection';
import MentorCardSection from './section/MentorCardSection';
import MentorFilterSection from './section/MentorFilterSection';

const MentorsListPage = () => {
  return (
    <main className="flex w-full flex-col">
      <BannerSection />

      <div className="mx-auto w-full max-w-[1120px] px-5 xl:px-0">
        <MentorFilterSection />
        <MentorCardSection />
      </div>
    </main>
  );
};

export default MentorsListPage;
