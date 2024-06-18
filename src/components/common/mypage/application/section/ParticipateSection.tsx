import { Link } from 'react-router-dom';

import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';

interface ParticipateSectionProps {
  applicationList: ApplicationType[];
}

const ParticipateSection = ({ applicationList }: ParticipateSectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 중</h1>
      <div className="flex gap-4 md:flex-col">
        {applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-14">
            <p className="text-neutral-0 text-opacity-[36%]">
              참여 중인 내역이 아직 없어요.
            </p>
            <Link
              to="/program"
              className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
            >
              프로그램 신청하기
            </Link>
          </div>
        ) : (
          applicationList
            .slice(0, 3)
            .map((application) => <ApplicationCard application={application} />)
        )}
      </div>
      {applicationList.length > 3 && (
        <MoreButton className="hidden md:flex">더보기</MoreButton>
      )}
    </section>
  );
};

export default ParticipateSection;
