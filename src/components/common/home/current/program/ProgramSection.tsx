import ProgramGridItem from './ProgramGridItem';

const ProgramSection = () => {
  return (
    <section>
      <h1 className="text-sm-1.125-bold lg:text-md-1.375-semibold text-neutral-0">
        렛츠커리어 프로그램
      </h1>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
        <ProgramGridItem
          imageColor="blue"
          status="IN_PROGRESS"
          title="인턴 지원 2주 챌린지"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는"
          startDate="2024-04-01T00:00Z"
          endDate="2024-04-20T00:00Z"
        />
        <ProgramGridItem
          imageColor="green"
          status="BEFORE"
          title="부트캠프"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는"
          startDate="2024-04-01T00:00Z"
          endDate="2024-04-20T00:00Z"
        />
        <ProgramGridItem
          imageColor="gray"
          status="DONE"
          title="렛츠챗 세션"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는"
          startDate="2024-04-01T00:00Z"
          endDate="2024-04-20T00:00Z"
        />
        <ProgramGridItem
          imageColor="yellow"
          status="IN_PROGRESS"
          title="상시 콘텐츠"
          description="2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는"
          allDay
        />
      </ul>
    </section>
  );
};

export default ProgramSection;
