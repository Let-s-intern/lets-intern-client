import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';

import Heading from '@/domain/admin/ui/heading/Heading';
import {
  ManualOpeningActionPanel,
  ManualProductActionPanel,
} from './ManualActionPanel';
import PendingListTable from './PendingListTable';

/** 상품 목록 표의 열 구성 (관리자용 목록 API 요청 문서 기준). */
const PRODUCT_COLUMNS = [
  '멘토',
  '상품명',
  '카테고리',
  '상태',
  '현재 개설',
  '액션',
];

/** 개설 목록 표의 열 구성 (관리자용 목록 API 요청 문서 기준). */
const OPENING_COLUMNS = [
  '멘토',
  '상품명',
  '진행시간·가격',
  '신청 기간',
  '상태',
  '개설일',
  '종료',
  '액션',
];

export default function AdminLiveMentoringPage() {
  const [tab, setTab] = useState(0);

  return (
    <section className="p-5">
      <Heading className="mb-4">1대1 라이브 멘토링 관리</Heading>

      <Tabs
        value={tab}
        onChange={(_, next: number) => setTab(next)}
        className="mb-4"
      >
        <Tab label="상품 관리" />
        <Tab label="개설 관리" />
      </Tabs>

      {tab === 0 ? (
        <>
          <ManualProductActionPanel />
          <PendingListTable
            columns={PRODUCT_COLUMNS}
            description="검토 대기 상품을 조회할 API 가 없어 목록을 그릴 수 없습니다. 위 임시 영역에 상품 ID 를 직접 입력해 승인·반려하세요."
          />
        </>
      ) : (
        <>
          <ManualOpeningActionPanel />
          <PendingListTable
            columns={OPENING_COLUMNS}
            description="개설을 조회할 API 가 없어 목록을 그릴 수 없습니다. 위 임시 영역에 개설 ID 를 직접 입력해 강제 종료하세요."
          />
        </>
      )}
    </section>
  );
}
