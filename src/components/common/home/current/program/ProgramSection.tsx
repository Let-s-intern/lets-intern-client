import ProgramGridItem, { ProgramGridItemProps } from './ProgramGridItem';

const ProgramSection = () => {
  const programList = [
    {
      status: 'IN_PROGRESS',
      imgColor: 'blue',
      title: '인턴 지원 2주 챌린지',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      status: 'BEFORE',
      imgColor: 'green',
      title: '부트캠프',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      status: 'DONE',
      imgColor: 'gray',
      title: '렛츠챗 세션',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      imgColor: 'yellow',
      status: 'IN_PROGRESS',
      title: '상시콘텐츠',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: true,
    },
  ];

  return (
    <section className="mt-4">
      <h1 className="text-neutral-0 text-sm-1.125-bold lg:text-md-1.375-semibold">
        렛츠커리어 프로그램
      </h1>
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
        {programList.map((program, index) => (
          <ProgramGridItem
            key={index}
            imgColor={program.imgColor as ProgramGridItemProps['imgColor']}
            status={program.status as ProgramGridItemProps['status']}
            title={program.title}
            description={program.description}
            isAllDay={program.isAllDay}
            startDate={program.startDate}
            endDate={program.endDate}
          />
        ))}
      </ul>
    </section>
  );
};

export default ProgramSection;
