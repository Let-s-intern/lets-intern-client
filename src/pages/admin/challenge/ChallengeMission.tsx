import { useReducer } from 'react';

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

const initialMissionList: IMission[] = [
  {
    id: 124,
    status: STATUS.SAVE,
    type: 'GENERAL',
    title: '💛미션명1',
    startDate: '2024-05-13T12:15:39.813Z',
    endDate: '2024-05-13T12:15:39.813Z',
    refund: 0,
    essentialContentsList: [
      {
        id: 459,
        title: '💚 필수 콘텐츠명',
      },
    ],
    additionalContentsList: [
      {
        id: 8024,
        title: '💚 추가 콘텐츠명',
      },
    ],
    limitedContentsList: [
      {
        id: 358,
        title: '💚 제한 콘텐츠명',
      },
    ],
  },
  {
    id: 345,
    status: STATUS.SAVE,
    type: 'ADDITIONAL',
    title: '💛미션명2',
    startDate: '2032-05-13T12:15:39.813Z',
    endDate: '2032-06-13T12:15:39.813Z',
    refund: 30000,
    essentialContentsList: [
      {
        id: 123,
        title: '💚 필수 콘텐츠명 1',
      },
    ],
    additionalContentsList: [],
    limitedContentsList: [
      {
        id: 345,
        title: '💚 제한 콘텐츠명',
      },
    ],
  },
  {
    id: 68,
    status: STATUS.SAVE,
    type: 'REFUND',
    title: '💛미션명3',
    startDate: '2024-05-13T12:15:39.813Z',
    endDate: '2024-05-13T12:15:39.813Z',
    refund: 0,
    essentialContentsList: [
      {
        id: 247,
        title: '💚 필수 콘텐츠명',
      },
    ],
    additionalContentsList: [
      {
        id: 678,
        title: '💚 추가 콘텐츠명 1',
      },
    ],
    limitedContentsList: [],
  },
];
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

const ChallengeMission = () => {
  const [missionList, dispatch] = useReducer(
    missionReducer,
    null,
    () => initialMissionList,
  );

  const handleAddMission = (item: IMission) => {
    dispatch({ type: 'add', item });
  };
  const handleDeleteMission = (item: IMission) => {
    dispatch({ type: 'delete', item });
  };

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>미션 관리</Heading>
        <Button
          onClick={() => {
            dispatch({
              type: 'add',
              item: {
                status: STATUS.INSERT,
                type: 'GENERAL',
                title: '',
                startDate: new Date().toISOString(),
                refund: 0,
                essentialContentsList: [],
                additionalContentsList: [],
                limitedContentsList: [],
              },
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
