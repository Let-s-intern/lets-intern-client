import { useReducer } from 'react';

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
import { formatMissionDateString } from '../../../utils/formatDateString';

// 테이블에 사용하는 데이터는 status 속성 추가하기
const initalMissionList: IMissionTemplate[] = [
  {
    status: STATUS.SAVE,
    id: 1,
    title: '현직자 인터뷰 정리',
    description:
      '1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고',
    guide:
      '교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!\r교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!',
    templateLink: 'https://start.spring.io/',
    createdAt: formatMissionDateString('2024-10-01'),
  },
  {
    status: STATUS.SAVE,
    id: 2,
    title: '채용공고 정리 및 분석',
    description:
      '오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️\r오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️',
    guide:
      '이렇게 스스로 찾은 직무에 대한 정보를 바탕으로 어떻게 현실적으로 지원할 수 있을 지, 어떤 업무를 수행하고 역량을 요구하는지 꼼꼼히 살펴보시길 바랍니다 🔍',
    templateLink: 'https://start.spring.io/',
    createdAt: formatMissionDateString('2024-10-05'),
  },
];

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

const ChallengeMissionManagement = () => {
  const [missionList, dispatch] = useReducer(
    missionTemplateReducer,
    null,
    () => initalMissionList,
  );

  const handleAddMission = (item: IMissionTemplate) => {
    dispatch({ type: 'add', item });
  };
  const handleDeleteMission = (item: IMissionTemplate) => {
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
                id: Date.now(),
                title: '',
                description: '',
                guide: '',
                templateLink: '',
                createdAt: new Date().toISOString(),
              },
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
          {missionList.map((mission) => (
            <LineTableBodyRow<IMissionTemplate>
              {...tableSettings}
              key={mission.id}
              item={mission}
              handleAdd={handleAddMission}
              handleDelete={handleDeleteMission}
              cellWidthList={cellWidthList}
            />
          ))}
        </LineTableBody>
      </Table>
    </div>
  );
};

export default ChallengeMissionManagement;
