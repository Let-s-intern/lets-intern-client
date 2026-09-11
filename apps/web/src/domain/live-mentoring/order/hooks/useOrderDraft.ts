'use client';

import type { HydrationStore } from '@letscareer/store';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  LiveMentoringCategory,
  LiveMentoringDuration,
} from '@/api/live-mentoring/liveMentoringSchema';
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
  /**
   * 신청 생성 DTO 의 `durationPriceId`.
   *
   * 상세 스키마에서 필수라 정상 경로에서는 항상 채워진다. null 을 남겨 둔 것은
   * 아직 이 값을 안 주는 서버(구버전)에 붙었을 때 결제하기를 막기 위해서다.
   */
  durationPriceId: number | null;
  /** 선택 플랜의 판매가. 결제 금액의 원금이다. */
  price: number;
  /** 30분은 1칸, 60분은 연속 2칸. */
  slots: SelectedApplySlot[];
  /** 멘토가 오픈 설정에서 고른 타입 중 멘티가 고른 하나. */
  mentoringCategory: LiveMentoringCategory;
  reservationChangeAgreed: boolean;
}

/** 신청 생성이 끝난 뒤 결제 위젯·결과 화면이 읽는 값. */
export interface CreatedLiveMentoringApplication {
  applicationId: number;
  /** Toss 에 넘기는 주문번호. */
  orderId: string;
  /** 서버가 쿠폰까지 계산한 실제 청구액. 결제창에 뜨는 금액이다. */
  finalAmount: number;
  orderName: string;
  customerName: string;
  customerEmail: string;
  customerMobilePhone: string;
  /** 10분 선점 만료 시각. */
  expiresAt: string;
}

interface OrderDraftState extends HydrationStore {
  draft: LiveMentoringOrderDraft | null;
  application: CreatedLiveMentoringApplication | null;
  setDraft: (draft: LiveMentoringOrderDraft) => void;
  setApplication: (application: CreatedLiveMentoringApplication) => void;
  clearDraft: () => void;
}

/**
 * 서버 선점(10분)이 끝났는지. 만료 시각 그 순간부터 만료다 — 서버 판정이
 * `!expiresAt.isAfter(now)` 다.
 *
 * `expiresAt` 은 오프셋 없는 KST 다(서버 `Clock` 이 Asia/Seoul). 그대로 파싱하면 기기
 * 타임존으로 읽혀, KST 보다 동쪽 기기에서는 방금 만든 신청이 만료로 보인다.
 * 파싱하지 못하면 만료로 보지 않는다 — 승인 여부는 서버가 가린다.
 */
export const isApplicationExpired = (
  application: CreatedLiveMentoringApplication,
  now: number = Date.now(),
) => new Date(`${application.expiresAt}+09:00`).getTime() <= now;

/**
 * 결제 페이지·결과 화면이 읽는 선택값 저장소.
 *
 * **`application` 만 localStorage 에 남긴다.** 예전에는 메모리에만 두고 "새로고침하면
 * 사라질 뿐" 이라고 봤는데, 그 전제가 틀렸다. Toss 결제창은 `successUrl` 로 새 문서를
 * 열기 때문에 실결제 복귀는 매번 새로고침과 같다. 신청이 비어 승인 API 를 한 번도
 * 부르지 못했다(LC-3300). 0원 쿠폰 경로만 클라이언트 라우팅이라 가려져 있었다.
 *
 * `draft`(슬롯 선택값·쿠폰)는 저장하지 않는다. 승인에 쓰이지 않고, 되살리면 이미
 * 남에게 팔린 슬롯으로 결제를 다시 시도하게 된다 — 메모리에만 두려던 이유가 이것이다.
 *
 * sessionStorage 가 아닌 이유는 모바일 간편결제가 다른 탭으로 돌아오면 비어 있어서다.
 */
export const useOrderDraftStore = create<OrderDraftState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      draft: null,
      application: null,
      // 새 선택으로 들어오면 직전에 만든 신청은 남길 이유가 없다
      setDraft: (draft) => set({ draft, application: null }),
      setApplication: (application) => set({ application }),
      clearDraft: () => set({ draft: null, application: null }),
    }),
    {
      name: 'liveMentoringOrderApplication',
      partialize: (state) => ({ application: state.application }),
      // 선점이 끝난 신청은 되살리지 않는다. 승인해 봐야 `LIVE_MENTORING_PAYMENT_EXPIRED` 다
      merge: (persisted, current) => {
        const application =
          (persisted as Partial<OrderDraftState> | undefined)?.application ??
          null;
        return {
          ...current,
          application:
            application && !isApplicationExpired(application)
              ? application
              : null,
        };
      },
      onRehydrateStorage: (state) => () => state.setHasHydrated(true),
    },
  ),
);
