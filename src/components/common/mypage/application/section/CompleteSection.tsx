import { MypageApplication } from '@/api/application';
import { useState } from 'react';
import MobileCarousel from '../../../ui/carousel/MobileCarousel';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface CompleteSectionProps {
  applicationList: MypageApplication[];
}

const CompleteSection = ({ applicationList }: CompleteSectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 완료</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-20">
          <p className="text-neutral-0 text-opacity-[36%]">
            참여 완료한 프로그램이 아직 없어요.
          </p>
        </div>
      ) : (
        <>
          <MobileCarousel<MypageApplication>
            items={viewList}
            renderItem={(application) => (
              <ApplicationCard
                grayscale
                application={application}
                showChallengeButton
              />
            )}
            itemWidth="169px"
            spaceBetween={16}
            containerWidth="100%"
            getItemKey={(application) => application.id || 0}
          />
          {applicationList.length > 3 && !showMore && (
            <Button
              className="md:flex"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </Button>
          )}
        </>
      )}
    </section>
  );
};

export default CompleteSection;
