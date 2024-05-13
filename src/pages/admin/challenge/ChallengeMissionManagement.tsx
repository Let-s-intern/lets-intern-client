import { useReducer } from 'react';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import NTableHead from '../../../components/admin/challenge/mission/mission/table/table-head/NTableHead';
import NTableBody from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBody';
import { IMissionTemplate, Status } from '../../../interfaces/interface';
import missionTemplateReducer from '../../../reducers/missionTemplateReducer';
import NTableBodyRow from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBodyRow';
import { missionManagementCellWidthList } from '../../../utils/tableCellWidthList';
import { statusEnum } from '../../../utils/convert';

// 테이블에 사용하는 데이터는 status 속성 추가하기 (타입은 Status 참고)
const initalMissionList: IMissionTemplate[] = [
  {
    status: statusEnum.SAVE as Status,
    id: 1,
    title: '현직자 인터뷰 정리',
    description:
      '1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고',
    guide:
      '교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!\r교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!',
    templateLink: 'https://start.spring.io/',
    createdAt: '2021-09-01',
  },
  {
    status: statusEnum.SAVE as Status,
    id: 2,
    title: '채용공고 정리 및 분석',
    description:
      '오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️\r오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️',
    guide:
      '이렇게 스스로 찾은 직무에 대한 정보를 바탕으로 어떻게 현실적으로 지원할 수 있을 지, 어떤 업무를 수행하고 역량을 요구하는지 꼼꼼히 살펴보시길 바랍니다 🔍',
    templateLink: 'https://start.spring.io/',
    createdAt: '2023-10-01',
  },
];

const cellWidthList = missionManagementCellWidthList;
const placeholders = ['생성일자', '미션명', '내용', '가이드', '템플릿 링크'];
const attrNames = [
  'createdAt',
  'title',
  'description',
  'guide',
  'templateLink',
];
const canEdits = [false, true, true, true, true];

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
                status: statusEnum.INSERT as Status,
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
        <NTableHead cellWidthList={cellWidthList} colNames={placeholders} />
        <NTableBody>
          {missionList.map((mission) => (
            <NTableBodyRow<IMissionTemplate>
              key={mission.id}
              attrNames={attrNames}
              item={mission}
              placeholders={placeholders}
              canEdits={canEdits}
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

export default ChallengeMissionManagement;
