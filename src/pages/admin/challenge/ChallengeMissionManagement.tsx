import { useReducer } from 'react';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import LineTableHead from '../../../components/admin/challenge/ui/lineTable/LineTableHead';
import LineTableBody from '../../../components/admin/challenge/ui/lineTable/LineTableBody';
import { IMissionTemplate } from '../../../interfaces/interface';
import missionTemplateReducer from '../../../reducers/missionTemplateReducer';
import LineTableBodyRow from '../../../components/admin/challenge/ui/lineTable/LineTableBodyRow';
import { missionManagementCellWidthList } from '../../../utils/tableCellWidthList';
import { TABLE_CONTENT, STATUS } from '../../../utils/convert';
import axios from '../../../utils/axios';

const cellWidthList = missionManagementCellWidthList;
const tableSettings = {
  placeholders: ['생성일자', '미션명', '내용', '가이드', '템플릿 링크'],
  attrNames: ['createdAt', 'title', 'description', 'guide', 'templateLink'],
  canEdits: [false, true, true, true, true],
  contents: [
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
  ],
};
const initialMissionTemplate = {
  id: Date.now(), // 임시 id
  status: STATUS.INSERT,
  title: '',
  description: '',
  guide: '',
  templateLink: '',
};

const ChallengeMissionManagement = () => {
  const queryClient = new QueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['mission-template', 'admin'],
    queryFn: async () => {
      const res = await axios.get('/api/v1/mission-template/admin');
      return res.data;
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (item: IMissionTemplate) => {
      const body = { ...item };
      delete body.status;
      delete body.id;
      delete body.createdDate;
      // 미션 템플릿 생성
      if (item.status === STATUS.INSERT) {
        const res = await axios.post('/api/v1/mission-template', body);
        return res.data;
      }
      // 미션 템플릿 수정
      const res = await axios.patch(
        `/api/v1/mission-template/${item.id}`,
        body,
      );
      return res.data;
    },
    onSuccess: () => {
      // DB에서 createdDate 가져오는 용도
      queryClient.invalidateQueries({
        queryKey: ['mission-template', 'admin'],
      });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/v1/mission-template/${id}`);
      return res.data;
    },
  });

  const [missionList, dispatch] = useReducer(
    missionTemplateReducer,
    null,
    () => {
      // 초기 미션 리스트 status 설정
      return data
        ? data.missionTemplateAdminList.map((item: IMissionTemplate) => ({
            ...item,
            status: STATUS.SAVE,
          }))
        : [];
    },
  );

  const handleAddMission = (item: IMissionTemplate) => {
    dispatch({ type: 'add', item });
  };
  const handleDeleteMission = (item: IMissionTemplate) => {
    dispatch({ type: 'delete', item });
    deleteMutation.mutate(item.id as number);
  };
  const handleSaveMission = (item: IMissionTemplate) => {
    updateMutation.mutate(item);
  };

  if (isLoading) return <></>;

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>미션 관리</Heading>
        <Button
          onClick={() => {
            dispatch({
              type: 'add',
              item: initialMissionTemplate,
            });
          }}
        >
          등록
        </Button>
      </div>
      <Table>
        <LineTableHead
          cellWidthList={cellWidthList}
          colNames={tableSettings.placeholders}
        />
        <LineTableBody>
          {missionList?.map((mission) => (
            <LineTableBodyRow<IMissionTemplate>
              {...tableSettings}
              key={mission.id}
              item={mission}
              handleAdd={handleAddMission}
              handleDelete={handleDeleteMission}
              handleSave={handleSaveMission}
              cellWidthList={cellWidthList}
            />
          ))}
        </LineTableBody>
      </Table>
    </div>
  );
};

export default ChallengeMissionManagement;
