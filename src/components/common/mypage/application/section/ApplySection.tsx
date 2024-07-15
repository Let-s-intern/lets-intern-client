import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface ApplySectionProps {
  applicationList: ApplicationType[];
  refetch: () => void;
}

const ApplySection = ({ applicationList, refetch }: ApplySectionProps) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const viewList = showMore ? applicationList : applicationList.slice(0, 3);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">참여 예정</h1>
      {applicationList.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-4 py-14">
          <p className="text-neutral-0 text-opacity-[36%]">
            참여 예정인 프로그램이 아직 없어요.
          </p>
          <Link
            to="/program"
            className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
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
              refetch={refetch}
              showDeleteMenu
            />
          ))}
        </div>
      )}
      {applicationList.length > 3 && (
        <MoreButton
          className="md:flex"
          onClick={() => {
            showMore ? navigate('/program') : setShowMore(true);
          }}
        >
          {showMore ? '다른 프로그램 둘러보기' : `더보기`}
          더보기
        </MoreButton>
      )}
    </section>
  );
};

export default ApplySection;
