import ProgramGridItem, {
  ProgramGridItemProps,
} from '../../../components/common/home/current/ProgramGridItem';

const Home = () => {
  const programList = [
    {
      id: 1,
      status: 'IN_PROGRESS',
      imgColor: 'blue',
      title: '인턴 지원 2주 챌린지',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      id: 2,
      status: 'BEFORE',
      imgColor: 'green',
      title: '부트캠프',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      id: 3,
      status: 'DONE',
      imgColor: 'gray',
      title: '렛츠챗 세션',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: false,
      startDate: '2024-04-01T00:00Z',
      endDate: '2024-04-20T00:00Z',
    },
    {
      id: 4,
      imgColor: 'yellow',
      status: 'IN_PROGRESS',
      title: '상시콘텐츠',
      description: '2주동안 ~을 통해 경험정리 및 지원까지 한번에 최대글자수는',
      isAllDay: true,
    },
  ];

  return (
    <div className="px-5">
      <div className="mx-auto max-w-[1080px]">
        <section className="mt-4">
          <h1 className="text-neutral-0 text-sm-1.125-bold lg:text-md-1.375-semibold">
            렛츠커리어 프로그램
          </h1>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-4">
            {programList.map((program) => (
              <ProgramGridItem
                data={{
                  imgColor:
                    program.imgColor as ProgramGridItemProps['data']['imgColor'],
                  status:
                    program.status as ProgramGridItemProps['data']['status'],
                  title: program.title,
                  description: program.description,
                  isAllDay: program.isAllDay,
                  startDate: program.startDate,
                  endDate: program.endDate,
                }}
              />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Home;
