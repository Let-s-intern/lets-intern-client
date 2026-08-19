import MentorProgramContainer from './MentorProgramContainer';

interface MentorProgramSectionProps {
  proceedingProgramList: unknown[];
  postProgramList: unknown[];
}

const MentorProgramSection = ({
  proceedingProgramList,
  postProgramList,
}: MentorProgramSectionProps) => (
  <section className="flex w-full flex-col gap-20">
    <MentorProgramContainer
      title="진행 중인 프로그램"
      count={proceedingProgramList.length}
      // TODO: proceedingProgramList 항목 필드 구조가 확정되면 실제 아이템 매핑 추가
      programs={[]}
      emptyText="현재 진행 중인 프로그램이 없습니다."
      gaItem="mentor_ongoing_program"
      gaTitle="멘토 진행 중인 프로그램"
    />

    <MentorProgramContainer
      title="진행했던 프로그램"
      count={postProgramList.length}
      // TODO: postProgramList 항목 필드 구조가 확정되면 실제 아이템 매핑 추가
      programs={[]}
      emptyText="이전에 진행했던 프로그램이 없습니다."
      gaItem="mentor_past_program"
      gaTitle="멘토 진행했던 프로그램"
    />
  </section>
);

export default MentorProgramSection;
