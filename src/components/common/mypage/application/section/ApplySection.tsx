import { MypageApplication } from '@/api/application';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HybridLink from '../../../ui/HybridLink';
import MoreButton from '../../ui/button/MoreButton';
import ApplicationCard from '../../ui/card/root/ApplicationCard';

interface ApplySectionProps {
  applicationList: MypageApplication[];
  refetch: () => void;
}

const ApplySection = ({ applicationList, refetch }: ApplySectionProps) => {
  const router = useRouter();
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
          <HybridLink
            href="/program"
            className="other_program flex w-full items-center justify-center rounded-sm border-2 border-primary-xlight bg-white px-5 py-2 font-medium text-neutral-35 md:w-auto"
          >
            다른 프로그램 둘러보기
          </HybridLink>
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
      {applicationList.length > 3 ? (
        <MoreButton
          className={`md:flex ${showMore ? 'other-program border-2 border-primary bg-neutral-100 text-primary-dark' : ''}`}
          onClick={() => {
            if (showMore) {
              router.push('/program');
            } else {
              setShowMore(true);
            }
          }}
        >
          {showMore ? '다른 프로그램 둘러보기' : `더보기`}
        </MoreButton>
      ) : (
        applicationList.length > 0 && (
          <MoreButton
            className="border-2 border-primary bg-neutral-100 text-primary-dark"
            onClick={() => router.push('/program')}
          >
            다른 프로그램 둘러보기
          </MoreButton>
        )
      )}
    </section>
  );
};

export default ApplySection;
