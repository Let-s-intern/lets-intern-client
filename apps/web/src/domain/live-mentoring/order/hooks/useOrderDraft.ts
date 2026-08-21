'use client';

import { create } from 'zustand';

import type { LiveMentoringDuration } from '@/api/live-mentoring/liveMentoringSchema';
import type { SelectedApplySlot } from '../../apply/types';

/**
 * 신청 시트에서 결제 페이지로 넘기는 선택값.
 *
 * 시트와 결제 페이지가 다른 라우트라 상태를 어딘가에 얹어야 한다. 화면 두 개만
 * 쓰는 값이므로 전역 `src/store/` 가 아니라 이 도메인 안에 둔다 — 기존
 * `useProgramStore` 를 늘리면 프로그램·리포트 결제가 함께 흔들린다.
 */
export interface LiveMentoringOrderDraft {
  mentorId: number;
  /** 신청 생성 경로에 들어가는 개설 id. */
  openingId: number;
  /** 결제 프로그램 카드 제목. */
  productName: string;
  thumbnail: string | null;
  duration: LiveMentoringDuration;
  /** 선택 플랜의 판매가. 결제 금액의 원금이다. */
  price: number;
  /** 30분은 1칸, 60분은 연속 2칸. */
  slots: SelectedApplySlot[];
  mentoringTypeIds: number[];
  reservationChangeAgreed: boolean;
}

interface OrderDraftState {
  draft: LiveMentoringOrderDraft | null;
  setDraft: (draft: LiveMentoringOrderDraft) => void;
  clearDraft: () => void;
}

/**
 * 결제 페이지가 읽는 선택값 저장소.
 *
 * **일부러 메모리에만 둔다(`persist` 없음).** 새로고침하면 사라지고, 결제 페이지는
 * 상세로 되돌아간다. 서버에 신청 상세 조회 API 가 없어(PRD 7-5) 복구할 방법이
 * 없는데, sessionStorage 에 남겨 두면 슬롯이 이미 남에게 팔린 뒤에도 예전 선택으로
 * 결제를 시도하게 된다.
 */
export const useOrderDraftStore = create<OrderDraftState>((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
