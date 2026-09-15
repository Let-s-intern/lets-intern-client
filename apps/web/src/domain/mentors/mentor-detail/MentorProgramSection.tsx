import { MMDD, YY_MM_DD } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { ProgramType } from '@/types/common';
import { getProgramPathname } from '@/utils/url';

import type { LiveMentoringOpening } from '@/api/live-mentoring/liveMentoringSchema';
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

// 썸네일·링크·제목 폴백은 1:1 멘토링 목록 카드(MentorCard)와 같다.
// 개설에는 진행기간·모집 마감이 없어 그 두 줄은 렌더하지 않는다.
const toLiveMentoringItem = (
  opening: LiveMentoringOpening,
): MentorProgramItemProps => {
  const title =
    opening.title ?? `${opening.mentorNickname ?? '멘토'}의 1:1 멘토링`;
  return {
    thumbnail: opening.mentorProfileImage,
    title,
    url: `/live-mentoring/${opening.mentorId}`,
    gaTitle: title,
  };
};

interface MentorProgramSectionProps {
  /** 이 멘토의 OPEN 1:1 멘토링. 있으면 모집 중인 프로그램의 첫 카드가 된다. */
  liveMentoringOpening?: LiveMentoringOpening | null;
  proceedingProgramList: MentorProgramListItem[];
  postProgramList: MentorProgramListItem[];
}

const MentorProgramSection = ({
  liveMentoringOpening,
  proceedingProgramList,
  postProgramList,
}: MentorProgramSectionProps) => {
  const proceedingPrograms = [
    ...(liveMentoringOpening
      ? [toLiveMentoringItem(liveMentoringOpening)]
      : []),
    ...proceedingProgramList.map((program) => toProgramItem(program, false)),
  ];

  return (
    <section className="flex w-full flex-col gap-20">
      <MentorProgramContainer
        title="모집 중인 프로그램"
        count={proceedingPrograms.length}
        programs={proceedingPrograms}
        emptyText="현재 모집 중인 프로그램이 없습니다."
        gaItem="mentor_ongoing_program"
        gaTitle="멘토 모집 중인 프로그램"
      />

      <MentorProgramContainer
        title="진행했던 프로그램"
        count={postProgramList.length}
        programs={postProgramList.map((program) =>
          toProgramItem(program, true),
        )}
        emptyText="이전에 진행했던 프로그램이 없습니다."
        gaItem="mentor_past_program"
        gaTitle="멘토 진행했던 프로그램"
      />
    </section>
  );
};

export default MentorProgramSection;
