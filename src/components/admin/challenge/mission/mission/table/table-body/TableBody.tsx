import { useQuery } from '@tanstack/react-query';
import TableBodyBox from '../../../../ui/table/table-body/TableBodyBox';
import TableBodyRow from './TableBodyRow';
// import axios from '../../../../../../../utils/axios';

const TableBody = () => {
  // const { data: missionList, isLoading } = useQuery({
  //   queryKey: ['mission', 19],
  //   queryFn: async () => {
  //     const res = await axios.get(`/mission/19`);
  //     const data = res.data;
  //     console.log(data);
  //     return data;
  //   },
  // });

  // if (isLoading) {
  //   return <></>;
  // }

  return (
    <TableBodyBox>
      {Array.from({ length: 6 }, (_, index) => index + 1).map((th) => (
        <TableBodyRow
          key={th}
          th={th}
          name={`${th}일차. 미션이름`}
          releaseDate="2024.01.26"
          dueDate="2024.01.27 8:00"
          isRefunded={true}
          connectedContents="경험정리"
          submitCount={93}
          totalCount={100}
          isVisible={false}
        />
      ))}
    </TableBodyBox>
  );
};

export default TableBody;
