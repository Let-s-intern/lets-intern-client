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
  const [errorMessage, setErrorMessage] = useState('');

  const getMission = useQuery({
    queryKey: ['mission', 'admin', 'detail', mission.id],
    queryFn: async () => {
      const res = await axios.get(`/mission/admin/detail/${mission.id}`);
      const data = res.data;
      setMissionDetail(data);
      setValues({
        type: data.type,
        title: data.title,
        contents: data.contents,
        guide: data.guide,
        th: data.th,
        startDate: data.startDate,
        endDate: data.endDate,
        template: data.template,
        topic: data.topic,
        essentialContentsTopic: data.essentialContentsTopic,
        additionalContentsTopic: data.additionalContentsTopic,
        limitedContentsTopic: data.limitedContentsTopic,
        refund: data.refund,
        comments: data.comments,
      });
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
    onError: (data: any) => {
      setErrorMessage(data.response.data.reason);
    },
  });

  useEffect(() => {
    if (menuShown === 'EDIT') {
      getMission.refetch();
    }
    setErrorMessage('');
  }, [menuShown]);

  const handleMissionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newValues = {
      ...values,
      th: Number(values.th),
    };
    newValues.refund = Number(values.refund);
    console.log(newValues);
    editMission.mutate(newValues);
  };

  const handleEditorClose = () => {
    setMenuShown('DETAIL');
  };

  const isLoading = getMission.isLoading || !values || !missionDetail;

  return (
    <>
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
              mode="EDIT"
              setValues={setValues}
              onSubmit={handleMissionEdit}
              onCancel={handleEditorClose}
              className="mt-1"
              errorMessage={errorMessage}
            />
          )}
    </>
  );
};

export default TableBodyRow;
