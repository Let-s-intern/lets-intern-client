import BadgeMenuItem from '../../../components/admin/challenge/challenge-mission/badge/BadgeMenuItem';
import TableBodyRow from '../../../components/admin/challenge/challenge-mission/table/table-body/TableBodyRow';
import TableHead from '../../../components/admin/challenge/challenge-mission/table/table-head/TableHead';

const ChallengeMission = () => {
  return (
    <div className="px-12 pt-8">
      <div className="flex gap-4">
        <BadgeMenuItem active>미션</BadgeMenuItem>
        <BadgeMenuItem>콘텐츠</BadgeMenuItem>
      </div>
      <h2 className="ml-3 mt-6 text-xl font-medium">미션</h2>
      <div className="w-full">
        <TableHead className="mt-4" />
        <div className="mt-3 flex flex-col gap-2">
          {Array.from({ length: 6 }, (_, index) => index + 1).map((th) => (
            <TableBodyRow
              key={th}
              th={th}
              name={`${th}일차. 미션이름`}
              startDate="2024.01.26"
              endDate="2024.01.27 8:00"
              isRefunded={true}
              connectedContents="경험정리"
              submitCount={93}
              totalCount={100}
              isVisible={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeMission;
