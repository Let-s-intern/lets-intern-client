import { useReducer } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import LineTableHead from '../../../components/admin/challenge/ui/lineTable/LineTableHead';
import LineTableBody from '../../../components/admin/challenge/ui/lineTable/LineTableBody';
import LineTableBodyRow from '../../../components/admin/challenge/ui/lineTable/LineTableBodyRow';
import { missionCellWidthList } from '../../../utils/tableCellWidthList';
import { IMission } from '../../../interfaces/interface';
import missionReducer from '../../../reducers/missionReducer';
import {
  STATUS,
  TABLE_CONTENT,
  missionTypeToText,
} from '../../../utils/convert';
import axios from '../../../utils/axios';

const missionTemplateList = [
  {
    id: 0,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션1',
    description: '미션1 설명',
    guide: '미션1 가이드',
    templateLink: 'https://www.naver.com/',
  },
  {
    id: 1,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션2',
    description: '미션2 설명',
    guide: '미션2 가이드',
    templateLink: 'https://www.naver.com/',
  },
  {
    id: 2,
    createDate: '2024-05-17T13:28:53.014Z',
    title: '미션3',
    description: '미션3 설명',
    guide: '미션3 가이드',
    templateLink: 'https://www.naver.com/',
  },
];
const essentialContentList = [
  {
    id: 0,
    title: '필수콘텐츠1',
  },
  {
    id: 56,
    title: '필수콘텐츠2',
  },
  {
    id: 25,
    title: '필수콘텐츠3',
  },
];
const additionalContentList = [
  {
    id: 0,
    title: '추가콘텐츠1',
  },
  {
    id: 56,
    title: '추가콘텐츠2',
  },
  {
    id: 25,
    title: '추가콘텐츠3',
  },
];
const limitedContentList = [
  {
    id: 0,
    title: '제한콘텐츠1',
  },
  {
    id: 56,
    title: '제한콘텐츠2',
  },
  {
    id: 25,
    title: '제한콘텐츠3',
  },
];
const tableSettings = {
  cellWidthList: missionCellWidthList,
  placeholders: ['유형', '미션명', '공개일', '마감일', '환급금액'],
  attrNames: [
    'type',
    'title',
    'startDate',
    'startDate',
    'refund',
    'essentialContentsList',
    'additionalContentsList',
    'limitedContentsList',
  ],
  canEdits: [true, true, true, false, true, true, true, true],
  contents: [
    {
      type: TABLE_CONTENT.DROPDOWN,
      options: Object.entries<string>(missionTypeToText).map(
        ([key, value]) => ({
          id: key,
          title: value,
        }),
      ),
    },
    {
      type: TABLE_CONTENT.DROPDOWN,
      options: missionTemplateList.map((item) => ({
        id: item.id,
        title: item.title,
      })),
    },
    { type: TABLE_CONTENT.DATE },
    { type: TABLE_CONTENT.DATE },
    { type: TABLE_CONTENT.INPUT },
    {
      type: TABLE_CONTENT.DROPDOWN,
      options: essentialContentList,
    },
    {
      type: TABLE_CONTENT.DROPDOWN,
      options: additionalContentList,
    },
    {
      type: TABLE_CONTENT.DROPDOWN,
      options: limitedContentList,
    },
  ],
};
const colNames = [
  ...tableSettings.placeholders,
  '필수콘텐츠',
  '추가콘텐츠',
  '제한콘텐츠',
];
const initialMission: IMission = {
  status: STATUS.INSERT,
  type: 'GENERAL',
  title: '',
  startDate: new Date().toISOString(),
  refund: 0,
  essentialContentsList: [],
  additionalContentsList: [],
  limitedContentsList: [],
};

const ChallengeMission = () => {
  const params = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['mission', 'admin'],
    queryFn: async () => {
      const res = await axios.get(`/api/v1/mission/admin/${params.programId}`);
      return res.data;
    },
  });
  const updateMutation = useMutation({
    mutationFn: async (item: IMission) => {
      const body = { ...item };
      delete body.status;
      delete body.id;
      delete body.endDate;
      // [TODO] 미션 템플릿 ID 추가
      // 미션 생성
      if (item.status === STATUS.INSERT) {
        const res = await axios.post(
          `/api/v1/mission/${params.programId}`,
          body,
        );
        return res.data;
      }
      // 미션 수정
      const res = await axios.patch(
        `/api/v1/mission/${params.programId}`,
        body,
      );
      return res.data;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(`/api/v1/mission/${id}`);
      return res.data;
    },
  });

  const [missionList, dispatch] = useReducer(missionReducer, null, () => {
    // 초기 미션 리스트 status 설정
    return data
      ? data.missionAdminList.map((item: IMission) => ({
          ...item,
          status: STATUS.SAVE,
        }))
      : [];
  });

  const handleSaveMission = (item: IMission) => {
    updateMutation.mutate(item);
  };

  const handleAddMission = (item: IMission) => {
    dispatch({ type: 'add', item });
  };
  const handleDeleteMission = (item: IMission) => {
    dispatch({ type: 'delete', item });
    deleteMutation.mutate(item.id as number);
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
              item: initialMission,
            });
          }}
        >
          등록
        </Button>
      </div>
      <Table>
        <LineTableHead
          cellWidthList={tableSettings.cellWidthList}
          colNames={colNames}
        />
        <LineTableBody>
          {missionList.map((mission: IMission) => (
            <LineTableBodyRow<IMission>
              {...tableSettings}
              key={mission.id}
              item={mission}
              handleSave={handleSaveMission}
              handleAdd={handleAddMission}
              handleDelete={handleDeleteMission}
            ></LineTableBodyRow>
          ))}
        </LineTableBody>
      </Table>
    </div>
  );
};

export default ChallengeMission;
