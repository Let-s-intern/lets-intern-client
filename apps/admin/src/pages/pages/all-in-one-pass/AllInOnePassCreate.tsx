import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import BasicInfoSection from '@/domain/all-in-one-pass/section/BasicInfoSection';
import BenefitSection from '@/domain/all-in-one-pass/section/BenefitSection';
import CalendarSection from '@/domain/all-in-one-pass/section/CalendarSection';
import DetailContentSection from '@/domain/all-in-one-pass/section/DetailContentSection';
import ExternalLinkSection from '@/domain/all-in-one-pass/section/ExternalLinkSection';
import PlanSection, {
  createEmptyPlan,
} from '@/domain/all-in-one-pass/section/PlanSection';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
import { Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const createInitialInput = (): PassFormInput => ({
  title: '',
  shortDescription: '',
  purchaseStartDate: null,
  purchaseEndDate: null,
  passMonths: null,
  thumbnailUrl: null,
  plans: [createEmptyPlan()],
  calendarEvents: [],
  externalLinks: [],
  detailContent: null,
  benefits: [],
});

/** A-2 올인원패스 생성 */
export default function AllInOnePassCreate() {
  const navigate = useNavigate();
  const [input, setInput] = useState<PassFormInput>(createInitialInput);

  const patch = (partial: Partial<PassFormInput>) =>
    setInput((prev) => ({ ...prev, ...partial }));

  const handleSave = () => {
    // TODO: 생성 submit 단계에서 생성 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log('[올인원패스 생성 입력값]', input);
  };

  return (
    <main className="flex flex-col p-6">
      <Header>
        <Heading>올인원패스 생성</Heading>
      </Header>
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BasicInfoSection input={input} patch={patch} />
          <PlanSection
            plans={input.plans}
            onChange={(plans) => patch({ plans })}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CalendarSection
            events={input.calendarEvents}
            onChange={(calendarEvents) => patch({ calendarEvents })}
            purchaseStartDate={input.purchaseStartDate}
            purchaseEndDate={input.purchaseEndDate}
            passMonths={input.passMonths}
          />
          <ExternalLinkSection
            links={input.externalLinks}
            onChange={(externalLinks) => patch({ externalLinks })}
          />
        </div>
        <DetailContentSection
          onChange={(detailContent) => patch({ detailContent })}
        />
        <BenefitSection
          benefits={input.benefits}
          onChange={(benefits) => patch({ benefits })}
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outlined" onClick={() => navigate('/all-in-one-pass')}>
          취소
        </Button>
        <Button variant="contained" onClick={handleSave}>
          저장하기
        </Button>
      </div>
    </main>
  );
}
