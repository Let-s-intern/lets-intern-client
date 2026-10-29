'use client';

import { useUserProgramQuery } from '@/api/program';
import ProgramStatusTag from '@/domain/program/programs/card/ProgramStatusTag';
import { getProgramCardLink } from '@/domain/program/programs/card/programCardIdentity';
import { PROGRAM_BADGE_STATUS, PROGRAM_STATUS_KEY } from '@/utils/programConst';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const AllInOnePassSection = () => {
  const router = useRouter();
  const passQuery = useMemo(
    () => new URLSearchParams({ type: 'MEMBERSHIP' }),
    [],
  );
  const { data, isLoading } = useUserProgramQuery({
    pageable: { page: 1, size: 4 },
    searchParams: passQuery,
  });

  const passList = data?.programList ?? [];
  if (isLoading || passList.length === 0) return null;

  return (
    <section className="bg-primary-5 flex w-full flex-col gap-5 rounded-lg border border-[#9499F9] p-5 pb-4 md:px-8 md:pb-5 md:pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xsmall16 md:text-small20 font-semibold">
          올인원패스로 모든 혜택을 한 번에
        </h2>
        <Link
          href="/program?type=MEMBERSHIP"
          className="text-xxsmall12 text-neutral-45 md:text-xsmall16 pb-3 pl-3"
        >
          올인원패스 더보기
        </Link>
      </div>
      <div className="custom-scrollbar w-full overflow-x-auto">
        <div className="flex w-fit gap-5 pb-1">
          {passList.map(({ programInfo }) => (
            <div
              key={programInfo.id}
              className="flex w-full min-w-[130px] cursor-pointer flex-col overflow-hidden md:min-w-[200px]"
              onClick={() => router.push(getProgramCardLink(programInfo))}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-white">
                <img
                  className="h-full w-full object-cover"
                  src={programInfo.thumbnail || undefined}
                  alt={programInfo.title ?? '올인원패스'}
                />
                {programInfo.programStatusType === PROGRAM_STATUS_KEY.POST && (
                  <div className="bg-neutral-0/40 absolute inset-0 rounded-sm" />
                )}
                <div className="absolute left-2 top-2">
                  <ProgramStatusTag
                    status={PROGRAM_BADGE_STATUS[programInfo.programStatusType]}
                  />
                </div>
              </div>
              <div className="pt-3">
                <p className="text-xsmall16 line-clamp-2 font-semibold">
                  {programInfo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllInOnePassSection;
