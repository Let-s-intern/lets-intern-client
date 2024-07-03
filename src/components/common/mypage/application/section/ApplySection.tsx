import { Link } from 'react-router-dom';

import { useState } from 'react';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface ApplySectionProps {
  applicationList: ApplicationType[];
  refetch: () => void;
}


const ApplySection = ({ applicationList, refetch }: ApplySectionProps) => {
  const [viewList, setViewList] = useState<ApplicationType[]>(
    applicationList.slice(0, 3),
  );
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">신청 완료</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-neutral-0 text-opacity-[36%]">
            신청한 내역이 아직 없어요.
          </p>
          <Link
            to="/program"
            className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
          >
            프로그램 신청하기
          </Link>
        </div>
      ) : (
        <div className=" grid grid-cols-2 gap-4 md:flex md:flex-col">
          {viewList.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              refetch={refetch}
              showDeleteMenu
            />
          ))}
        </div>
      )}
      {applicationList.length > 3 && applicationList.length !== viewList.length && (
        <MoreButton
          className="md:flex"
          onClick={() => setViewList(applicationList)}
        >
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default ApplySection;
