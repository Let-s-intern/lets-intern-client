import { MMDD, YY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';

import {
  MentorProgramInfo,
  ONGOING_PROGRAMS,
  PAST_PROGRAMS,
} from '../data/dummyMentorPrograms';
import { MentorProgramItemProps } from '../ui/MentorProgramItem';
import MentorProgramContainer from './MentorProgramContainer';

const getDuration = (startDate?: string | null, endDate?: string | null) => {
  if (!startDate || !endDate) return undefined;
  return `${dayjs(startDate).format(YY_MM_DD)} ~ ${dayjs(endDate).format(YY_MM_DD)}`;
};

const getDeadlineLabel = (
  programStatusType: MentorProgramInfo['programStatusType'],
  deadline?: string | null,
) => {
  if (programStatusType === 'POST' || !deadline) return undefined;
  return `~${dayjs(deadline).format(MMDD)} 모집 마감`;
};

const toProgramItem = (program: MentorProgramInfo): MentorProgramItemProps => ({
  thumbnail: program.thumbnail ?? null,
  title: program.title ?? '',
  url: `/program/${program.id}`,
  duration: getDuration(program.startDate, program.endDate),
  deadlineLabel: getDeadlineLabel(program.programStatusType, program.deadline),
  gaTitle: program.title ?? undefined,
});

const MentorProgramSection = () => (
  <section className="flex w-full flex-col gap-20">
    <MentorProgramContainer
      title={
        <div className="text-medium22 text-neutral-0 flex w-full items-center justify-between font-bold">
          진행 중인 프로그램{' '}
          <span className="text-neutral-40 text-xsmall16 font-medium">
            {ONGOING_PROGRAMS.length}개
          </span>
        </div>
      }
      programs={ONGOING_PROGRAMS.map(toProgramItem)}
      gaItem="mentor_ongoing_program"
      gaTitle="멘토 진행 중인 프로그램"
    />

    <MentorProgramContainer
      title={
        <div className="text-medium22 text-neutral-0 flex w-full items-center justify-between font-bold">
          <p>진행했던 프로그램</p>
          <span className="text-primary-hover text-xsmall16 font-medium">
            {PAST_PROGRAMS.length}개
          </span>
        </div>
      }
      programs={PAST_PROGRAMS.map(toProgramItem)}
      gaItem="mentor_past_program"
      gaTitle="멘토 진행했던 프로그램"
    />
  </section>
);

export default MentorProgramSection;
