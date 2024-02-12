import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import TableRowDetailMenu from './TableRowDetailMenu';
import TableRowEditorMenu from './TableRowEditorMenu';
import TableRowContent from './TableRowContent';
import axios from '../../../../../../../utils/axios';

interface Props {
  th: number;
  mission: any;
}

const TableBodyRow = ({ th, mission }: Props) => {
  const queryClient = useQueryClient();

  const [menuShown, setMenuShown] = useState<'DETAIL' | 'EDIT' | 'NONE'>(
    'NONE',
  );
  const [missionDetail, setMissionDetail] = useState<any>();
  const [values, setValues] = useState<any>();

  const getMission = useQuery({
    queryKey: ['mission', 'detail', mission.id],
    queryFn: async () => {
      const res = await axios.get(`/mission/detail/${mission.id}`);
      const data = res.data;
      setMissionDetail(data);
      setValues(data);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: menuShown !== 'NONE',
  });

  const editMission = useMutation({
    mutationFn: async (values) => {
      const res = await axios.patch(`/mission/${mission.id}`, values);
      const data = res.data;
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['mission'] });
      setMenuShown('DETAIL');
    },
  });

  useEffect(() => {
    console.log(values);
  }, [values]);

  useEffect(() => {
    if (menuShown === 'EDIT') {
      getMission.refetch();
    }
  }, [menuShown]);

  const handleMissionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValues = {
      ...values,
      th: Number(values.th),
      isRefunded: Boolean(Number(values.refund)),
      refund: Number(values.refund),
    };
    console.log(newValues);
    editMission.mutate(newValues);
  };

  const isLoading = getMission.isLoading || !values || !missionDetail;

  return (
    <div>
      <TableRowContent
        th={th}
        mission={mission}
        menuShown={menuShown}
        setMenuShown={setMenuShown}
      />
      {menuShown === 'DETAIL'
        ? !isLoading && (
            <TableRowDetailMenu
              mission={missionDetail}
              setMenuShown={setMenuShown}
            />
          )
        : menuShown === 'EDIT' &&
          !isLoading && (
            <TableRowEditorMenu
              values={values}
              setValues={setValues}
              setMenuShown={setMenuShown}
              onSubmit={handleMissionEdit}
            />
          )}
    </div>
  );
};

export default TableBodyRow;
