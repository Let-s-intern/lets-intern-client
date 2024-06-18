import { Link } from 'react-router-dom';

import ApplicationCard from '../../ui/card/root/ApplicationCard';
import MoreButton from '../../ui/button/MoreButton';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';

interface WaitingSectionProps {
  applicationList: ApplicationType[];
}

const WaitingSection = ({ applicationList }: WaitingSectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">후기 작성하고 00 받아가세요!</h1>
      <div className="flex gap-4 md:flex-col">
        {applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-14">
            <p className="text-neutral-0 text-opacity-[36%]">
              프로그램 완주하고 후기를 작성해보세요!
            </p>
            <Link
              to="/programs"
              className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
            >
              프로그램 신청하기
            </Link>
          </div>
        ) : (
          applicationList
            .slice(0, 3)
            .map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                hasReviewButton
                reviewButton={{ text: '후기 작성하기' }}
              />
            ))
        )}
      </div>
      {applicationList.length > 3 && (
        <MoreButton className="hidden md:flex">더보기</MoreButton>
      )}
    </section>
  );
};

export default WaitingSection;
