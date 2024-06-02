import { useReducer } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

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
  attrNames: ['createDate', 'title', 'description', 'guide', 'templateLink'],
  canEdits: [false, true, true, true, true],
  contents: [
    { type: TABLE_CONTENT.DATE },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
    { type: TABLE_CONTENT.INPUT },
  ],
};

const ChallengeMissionManagement = () => {
  const getMissionTemplateList = async () => {
    try {
      const res = await axios.get('/mission-template/admin');
      if (res.status !== 200) {
        throw new Error(res.data.message);
      }

      const data = res.data.data.missionTemplateAdminList;
      dispatch({
        type: 'init',
        list: data.map((item: IMissionTemplate) => ({
          ...item,
          status: STATUS.SAVE,
        })),
      });
    } catch (error) {
      console.error(error);
    }
  };
  const updateMissionTemplate = async (item: IMissionTemplate) => {
    const body = { ...item };
    delete body.id;
    delete body.createdDate;
    delete body.status;
    // 미션 템플릿 생성
    if (item.status === STATUS.INSERT) {
      const res = await axios.post('/mission-template', body);
      if (res.status !== 200) throw new Error(res.data.message);
    }
    // 미션 템플릿 수정
    const res = await axios.patch(`/mission-template/${item.id}`, body);
    if (res.status !== 200) throw new Error(res.data.message);
  };

  const [missionList, dispatch] = useReducer(missionTemplateReducer, []);
  const { isLoading } = useQuery({
    queryKey: ['mission-template', 'admin'],
    queryFn: getMissionTemplateList,
  });
  const updateMutation = useMutation({
    mutationFn: updateMissionTemplate,
    onError(error) {
      console.error(error);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/mission-template/${id}`);
      if (res.status !== 200) throw new Error(res.data.message);
      // console.log(res);
    },
    onError(error) {
      console.error(error);
    },
  });

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
            handleAddMission({
              id: Date.now(), // 임시 id
              status: STATUS.INSERT,
              title: '',
              description: '',
              guide: '',
              templateLink: '',
              createDate: new Date().toISOString(), // 임시 생성일자
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
