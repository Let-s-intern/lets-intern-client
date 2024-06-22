import { Link } from 'react-router-dom';

import ApplicationCard from '../../ui/card/root/ApplicationCard';
import MoreButton from '../../ui/button/MoreButton';
import { ApplicationType } from '../../../../../pages/common/mypage/Application';
import { useState } from 'react';

interface WaitingSectionProps {
  applicationList: ApplicationType[];
}

const WaitingSection = ({ applicationList }: WaitingSectionProps) => {
  const [viewList, setViewList] = useState<ApplicationType[]>(applicationList.slice(0, 3));
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">프로그램 후기를 작성해주세요.</h1>
      {
        applicationList.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-14">
            <p className="text-neutral-0 text-opacity-[36%]">
              프로그램 완주하고 후기를 작성해보세요!
            </p>
            <Link
              to="/program"
              className="rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35"
            >
              프로그램 신청하기
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-4 md:flex md:flex-col'>
            {
              viewList.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  hasReviewButton
                  reviewType="CREATE"
                />
              ))
            }
          </div>
        )
      }
      {applicationList.length > 3 && (
        <MoreButton className="hidden md:flex" onClick={() => {
          setViewList(applicationList);
        }}>더보기</MoreButton>
      )}
    </section>
  );
};

export default WaitingSection;
