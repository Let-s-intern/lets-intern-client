import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';

import Heading from '@/domain/admin/ui/heading/Heading';
import ManualActionPanel from './ManualActionPanel';
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

      {/*
        승인·반려와 강제 종료가 같은 멘토 해석 결과를 쓰므로 패널은 탭 밖에 하나만 둔다.
        탭마다 두면 멘토를 고른 상태가 탭 전환에 날아간다.
      */}
      <ManualActionPanel />

      {tab === 0 ? (
        <PendingListTable
          columns={PRODUCT_COLUMNS}
          description="검토 대기 상품을 조회할 API 가 없어 목록을 그릴 수 없습니다. 위 임시 영역에서 멘토를 골라 승인·반려하세요."
        />
      ) : (
        <PendingListTable
          columns={OPENING_COLUMNS}
          description="개설을 조회할 API 가 없어 목록을 그릴 수 없습니다. 위 임시 영역에서 멘토를 골라 강제 종료하세요."
        />
      )}
    </section>
  );
}
