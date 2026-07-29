import BannerSection from './BannerSection';
import MentorFilterSection from './MentorFilterSection';

const MentorsListPage = () => {
  return (
    <main className="flex w-full flex-col">
      <BannerSection />

      <div className="mx-auto w-full max-w-[1120px] px-5 xl:px-0">
        <MentorFilterSection />
      </div>
    </main>
  );
};

export default MentorsListPage;
