import { useState } from 'react';

import Heading from '../../../components/admin/challenge/ui/heading/Heading';
import Table from '../../../components/admin/challenge/ui/table/table-container/Table';
import Button from '../../../components/admin/challenge/ui/button/Button';
import NTableHead from '../../../components/admin/challenge/mission/mission/table/table-head/NTableHead';
import NTableBody from '../../../components/admin/challenge/mission/mission/table/table-body/NTableBody';
import { IMissionTemplate } from '../../../interfaces/Mission.interface';

const ChallengeMissionManagement = () => {
  const [isModeAdd, setIsModeAdd] = useState(false);
  const [missionList, setMissionList] = useState<IMissionTemplate[]>([
    {
      id: 1,
      type: 'REFUND',
      topic: 'EXPERIENCE',
      status: 'WAITING',
      title: '현직자 인터뷰 정리',
      contents:
        '1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고\r1️⃣ 콘텐츠 마케팅 직무의 채용공고 3개 이상 정리 - Step 3,4 참고',
      guide:
        '교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!\r교육 콘텐츠를 따라 직무 인터뷰를 정독하며 나만의 방식으로 정리해보세요!',
      template: 'https://start.spring.io/',
      comments: '코멘트입니다',
      startDate: '2024-02-19T06:00:00',
      endDate: '2024-02-19T06:00:00',
      refund: 2000,
      refundTotal: 50000,
      essentialContentsTopic: 'EXPERIENCE',
      additionalContentsTopic: 'EXPERIENCE',
      limitedContentsTopic: null,
    },
    {
      id: 2,
      type: 'REFUND',
      topic: 'EXPERIENCE',
      status: 'WAITING',
      title: '채용공고 정리 및 분석',
      contents:
        '오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️\r오늘 미션을 인증하면 2,000원 상당의 취업플랫폼 정리본을 드립니다 ⛳️',
      guide:
        '이렇게 스스로 찾은 직무에 대한 정보를 바탕으로 어떻게 현실적으로 지원할 수 있을 지, 어떤 업무를 수행하고 역량을 요구하는지 꼼꼼히 살펴보시길 바랍니다 🔍',
      template: 'https://start.spring.io/',
      comments: '코멘트입니다',
      startDate: '2024-03-19T06:00:00',
      endDate: '2024-02-19T06:00:00',
      refund: 2000,
      refundTotal: 50000,
      essentialContentsTopic: 'EXPERIENCE',
      additionalContentsTopic: 'EXPERIENCE',
      limitedContentsTopic: null,
    },
  ]);

  return (
    <div className="px-12 pt-6">
      <div className="flex items-center justify-between px-3">
        <Heading>미션 관리</Heading>
        <Button
          onClick={() => {
            setIsModeAdd(true);
          }}
        >
          등록
        </Button>
      </div>
      <Table>
        <NTableHead />
        <NTableBody
          list={missionList}
          setList={setMissionList}
          isModeAdd={isModeAdd}
          setIsModeAdd={setIsModeAdd}
        />
      </Table>
    </div>
  );
};

export default ChallengeMissionManagement;
