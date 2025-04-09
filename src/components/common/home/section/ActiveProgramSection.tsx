import { useGetUserProgramQuery } from '@/api/program';
import dayjs from '@/lib/dayjs';
import ProgramNotificationModal from '@components/common/program/ProgramNotificationModal';
import { useMemo, useState } from 'react';
import ProgramContainer from '../ProgramContainer';
import {
  getBadgeText,
  getDuration,
  getProgramUrl,
} from './MainCurationSection';

const ActiveProgramSection = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data } = useGetUserProgramQuery({
    pageable: {
      size: 20,
      page: 1,
    },
    searchParams: {
      status: ['PROCEEDING'],
    },
  });

  const filteredData = useMemo(() => {
    return data?.programList
      .filter(
        (p) =>
          p.programInfo.programType === 'CHALLENGE' ||
          p.programInfo.programType === 'LIVE',
      )
      .sort((a, b) => {
        return (
          dayjs(a.programInfo.deadline).unix() -
          dayjs(b.programInfo.deadline).unix()
        );
      })
      .slice(0, 10);
  }, [data]);

  if (!filteredData || filteredData.length === 0) return null;

  return (
    <>
      <section className="mt-16 flex w-full max-w-[1120px] flex-col md:mt-21">
        <ProgramContainer
          gaItem="proceeding_program"
          gaTitle="지금 모집 중인 프로그램을 한눈에 확인해보세요"
          showGrid
          isShowNotification
          onClickNotification={() => setIsOpenModal(true)}
          title={
            <>
              지금 모집 중인 프로그램을 <br className="md:hidden" />
              한눈에 확인해 보세요 📢
            </>
          }
          moreUrl="/program?status=PROCEEDING"
          isDeadline={false}
          programs={filteredData.map((program) => ({
            thumbnail: program.programInfo.thumbnail ?? '',
            title: program.programInfo.title ?? '',
            url: getProgramUrl({
              type: program.programInfo.programType,
              programId: program.programInfo.id ?? undefined,
            }),
            duration: getDuration({
              type: program.programInfo.programType,
              startDate: program.programInfo.startDate ?? '',
              endDate: program.programInfo.endDate ?? '',
            }),
            badge: {
              text: getBadgeText({
                type: program.programInfo.programType,
                deadline: program.programInfo.deadline ?? '',
              }),
            },
          }))}
        />
      </section>
      {/* 출시 알림 신청 모달 */}
      <ProgramNotificationModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default ActiveProgramSection;
