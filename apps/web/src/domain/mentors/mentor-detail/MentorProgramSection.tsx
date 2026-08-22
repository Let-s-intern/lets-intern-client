import { MMDD, YY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ProgramType } from '@/types/common';
import { getProgramPathname } from '@/utils/url';

import type { MentorProgramListItem } from '@/api/mentor/mentorSchema';

import type { MentorProgramItemProps } from '../ui/MentorProgramItem';
import MentorProgramContainer from './MentorProgramContainer';

const getDuration = (startDate: string, endDate: string) =>
  `${dayjs(startDate).format(YY_MM_DD)} ~ ${dayjs(endDate).format(YY_MM_DD)}`;

const getDeadlineLabel = (deadline: string, isPost: boolean) =>
  isPost ? undefined : `~${dayjs(deadline).format(MMDD)} 모집 마감`;

const toProgramItem = (
  program: MentorProgramListItem,
  isPost: boolean,
): MentorProgramItemProps => ({
  thumbnail: program.thumbnail,
  title: program.title,
  url: getProgramPathname({
    programType: program.programType.toLowerCase() as ProgramType,
    id: program.programId,
    title: program.title,
  }),
  duration: getDuration(program.startDate, program.endDate),
  deadlineLabel: getDeadlineLabel(program.deadline, isPost),
  gaTitle: program.title,
});

interface MentorProgramSectionProps {
  proceedingProgramList: MentorProgramListItem[];
  postProgramList: MentorProgramListItem[];
}

const MentorProgramSection = ({
  proceedingProgramList,
  postProgramList,
}: MentorProgramSectionProps) => (
  <section className="flex w-full flex-col gap-20">
    <MentorProgramContainer
      title="모집 중인 프로그램"
      count={proceedingProgramList.length}
      programs={proceedingProgramList.map((program) =>
        toProgramItem(program, false),
      )}
      emptyText="현재 모집 중인 프로그램이 없습니다."
      gaItem="mentor_ongoing_program"
      gaTitle="멘토 모집 중인 프로그램"
    />

    <MentorProgramContainer
      title="진행했던 프로그램"
      count={postProgramList.length}
      programs={postProgramList.map((program) => toProgramItem(program, true))}
      emptyText="이전에 진행했던 프로그램이 없습니다."
      gaItem="mentor_past_program"
      gaTitle="멘토 진행했던 프로그램"
    />
  </section>
);

export default MentorProgramSection;
