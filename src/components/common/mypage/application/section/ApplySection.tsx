import { Link } from 'react-router-dom';

import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import Button from '../../ui/button/Button';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface ApplySectionProps {
  applicationList: ApplicationType[];
}

const ApplySection = ({ applicationList }: ApplySectionProps) => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">신청 완료</h1>
      <div className="flex gap-4 md:flex-col">
        {applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-14">
            <p className="text-neutral-0 text-opacity-[36%]">
              신청한 내역이 아직 없어요.
            </p>
            <Link
              to="/programs"
              className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
            >
              프로그램 신청하기
            </Link>
          </div>
        ) : (
          applicationList.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              showDeleteMenu
            />
          ))
        )}
      </div>
      {applicationList.length > 0 && (
        <Button className="hidden md:flex">더보기</Button>
      )}
    </section>
  );
};

export default ApplySection;
