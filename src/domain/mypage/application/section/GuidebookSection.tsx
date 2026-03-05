import { useState } from 'react';
import { MypageApplication } from '@/api/application';
import HybridLink from '@/common/HybridLink';
import MobileCarousel from '@/common/carousel/MobileCarousel';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface GuidebookSectionProps {
  applicationList: MypageApplication[];
}

const GuidebookSection = ({ applicationList }: GuidebookSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const hasGuidebook = applicationList.length > 0;
  const list = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">가이드북</h1>
      {hasGuidebook ? (
        <>
          <MobileCarousel<MypageApplication>
            items={list}
            renderItem={(application) => (
              <ApplicationCard application={application} />
            )}
            itemWidth="169px"
            spaceBetween={16}
            containerWidth="100%"
            getItemKey={(application) => application.id || 0}
          />
          {applicationList.length > 3 && !showMore && (
            <MoreButton
              className="md:flex"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      ) : (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-neutral-0 text-opacity-[36%]">
            신청하신 가이드북이 아직 없어요.
          </p>
          <HybridLink
            href="/program?type=GUIDEBOOK"
            className="flex w-full items-center justify-center rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35 md:w-auto"
          >
            가이드북 둘러보기
          </HybridLink>
        </div>
      )}
    </section>
  );
};

export default GuidebookSection;
