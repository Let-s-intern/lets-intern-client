import Link from 'next/link';

import { useState } from 'react';
import { MypageApplication } from '../../../../../api/application';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface WaitingSectionProps {
  applicationList: MypageApplication[];
}

const WaitingSection = ({ applicationList }: WaitingSectionProps) => {
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">프로그램 후기를 작성해주세요.</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-neutral-0 text-opacity-[36%]">
            프로그램 완주하고 후기를 작성해보세요!
          </p>
          <Link
            href="/program"
            className="other_program rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
          >
            다른 프로그램 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-col">
          {viewList.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              hasReviewButton
              reviewType="CREATE"
            />
          ))}
        </div>
      )}

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
    </section>
  );
};

export default WaitingSection;
