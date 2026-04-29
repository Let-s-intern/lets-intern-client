import { MypageApplication } from '@/api/application';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import NewApplicationCard from '../../ui/card/NewApplicationCard';
import EmptySection from './EmptySection';

interface VodClassSectionProps {
  applicationList: MypageApplication[];
}

const VodClassSection = ({ applicationList }: VodClassSectionProps) => {
  const [showMore, setShowMore] = useState(false);
  const hasVodCLass = applicationList.length > 0;
  const list = showMore ? applicationList : applicationList.slice(0, 10);

  return (
    <section className="flex flex-col gap-6">
      {hasVodCLass ? (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {list.map((application) => (
              <NewApplicationCard
                key={application.id}
                application={application}
              />
            ))}
          </div>
          {applicationList.length > 10 && !showMore && (
            <MoreButton
              className="border-neutral-80 text-primary hover:!bg-primary/5 !bg-transparent px-3 py-2 transition-colors md:flex md:p-3"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      ) : (
        <EmptySection
          text="아직 구매한 VOD 클래스가 없어요"
          href="/program?type=VOD"
          buttonText="VOD 클래스 둘러보기"
        />
      )}
    </section>
  );
};

export default VodClassSection;
