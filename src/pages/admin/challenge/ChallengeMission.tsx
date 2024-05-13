import { useReducer } from 'react';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import NTableHead from '../../../components/admin/challenge/mission/mission/table/table-head/NTableHead';
import NTableBody from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBody';
import NTableBodyRow from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBodyRow';
import { missionCellWidthList } from '../../../utils/tableCellWidthList';
import { IMission, Status } from '../../../interfaces/interface';
import missionReducer from '../../../reducers/missionReducer';
import { statusEnum } from '../../../utils/convert';
import { formatMissionDateString } from '../../../utils/formatDateString';

const initalMissionList: IMission[] = [
  {
    id: 124,
    status: statusEnum.SAVE as Status,
    type: 'GENERAL',
    title: '💛미션명1',
    startDate: formatMissionDateString('2024-05-13T12:15:39.813Z'),
    endDate: formatMissionDateString('2024-05-13T12:15:39.813Z'),
    refund: 0,
    essentialContentsList: [
      {
        id: 0,
        title: '💚 필수 콘텐츠명',
        link: 'https://www.naver.com/',
      },
    ],
    additionalContentsList: [
      {
        id: 0,
        title: '💚 추가 콘텐츠명',
        link: 'https://www.naver.com/',
      },
    ],
    limitedContentsList: [
      {
        id: 0,
        title: '💚 제한 콘텐츠명',
        link: 'https://www.naver.com/',
      },
    ],
  },
  {
    id: 345,
    status: statusEnum.SAVE as Status,
    type: 'ADDITIONAL',
    title: '💛미션명2',
    startDate: formatMissionDateString('2032-05-13T12:15:39.813Z'),
    endDate: formatMissionDateString('2032-06-13T12:15:39.813Z'),
    refund: 30000,
    essentialContentsList: [
      {
        id: 123,
        title: '💚 필수 콘텐츠명 1',
        link: 'https://www.naver.com/',
      },
      {
        id: 456,
        title: '💚 필수 콘텐츠명 2',
        link: 'https://www.naver.com/',
      },
    ],
    additionalContentsList: [],
    limitedContentsList: [
      {
        id: 345,
        title: '💚 제한 콘텐츠명',
        link: 'https://www.naver.com/',
      },
    ],
  },
  {
    id: 68,
    status: statusEnum.SAVE as Status,
    type: 'REFUND',
    title: '💛미션명3',
    startDate: formatMissionDateString('2024-05-13T12:15:39.813Z'),
    endDate: formatMissionDateString('2024-05-13T12:15:39.813Z'),
    refund: 0,
    essentialContentsList: [
      {
        id: 0,
        title: '💚 필수 콘텐츠명',
        link: 'https://www.naver.com/',
      },
    ],
    additionalContentsList: [
      {
        id: 0,
        title: '💚 추가 콘텐츠명 1',
        link: 'https://www.naver.com/',
      },
      {
        id: 0,
        title: '💚 추가 콘텐츠명 2',
        link: 'https://www.naver.com/',
      },
    ],
    limitedContentsList: [],
  },
];
const cellWidthList = missionCellWidthList;
const tableSettings = {
  placeholders: [
    '유형',
    '미션명',
    '공개일',
    '마감일',
    '환급금액',
    '필수콘텐츠',
    '추가콘텐츠',
    '제한콘텐츠',
  ],
  attrNames: [
    'type',
    'title',
    'startDate',
    'endDate',
    'refund',
    'essentialContentsList',
    'additionalContentsList',
    'limitedContentsList',
  ],
  canEdits: [true, true, true, false, true, true, true, true],
};

const ChallengeMission = () => {
  const [missionList, dispatch] = useReducer(
    missionReducer,
    null,
    () => initalMissionList,
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
                id: Date.now(),
                status: statusEnum.INSERT as Status,
                type: 'GENERAL',
                title: '',
                startDate: '',
                endDate: '',
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
        <NTableHead
          cellWidthList={cellWidthList}
          colNames={tableSettings.placeholders}
        />
        <NTableBody>
          {missionList.map((mission: IMission) => (
            <NTableBodyRow<IMission>
              {...tableSettings}
              key={mission.id}
              item={mission}
              handleAdd={handleAddMission}
              handleDelete={handleDeleteMission}
              cellWidthList={cellWidthList}
            ></NTableBodyRow>
          ))}
        </NTableBody>
      </Table>
    </div>
  );
};

export default ChallengeMission;
