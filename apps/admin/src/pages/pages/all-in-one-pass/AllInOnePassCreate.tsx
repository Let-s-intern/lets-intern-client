import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { PassFormInput } from '@/domain/all-in-one-pass/types';
import BasicInfoSection from '@/domain/all-in-one-pass/ui/form/BasicInfoSection';
import PlanSection, {
  createEmptyPlan,
} from '@/domain/all-in-one-pass/ui/form/PlanSection';
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
  plans: [createEmptyPlan()], // 기본 플랜 1개
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
    <main className="flex flex-col gap-5 p-6">
      <Header>
        <Heading>올인원패스 생성</Heading>
      </Header>

      {/* 상단 2단: 좌 기본 정보 · 우 플랜 정보 (1.3~1.6은 이후 전폭 섹션) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BasicInfoSection input={input} patch={patch} />
        <PlanSection
          plans={input.plans}
          onChange={(plans) => patch({ plans })}
        />
      </div>

      <div className="flex justify-end gap-2">
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
