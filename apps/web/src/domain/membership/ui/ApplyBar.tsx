"use client";

import dayjs from "../lib/dayjs";
import BarCountdown from "./BarCountdown";
import { openPlanSheet } from "../lib/planSheet";
import { MEMBERSHIP_DEADLINE } from "../data/membership";
import useMembershipSheetStore from "../store/useMembershipSheetStore";

// ApplyCTA.tsx(Desktop/MobileApplyCTA) 디자인 복사 — 하단 고정 신청 바.
export default function ApplyBar() {
  const isSheetOpen = useMembershipSheetStore((s) => s.isSheetOpen);

  // 결제 시트가 열려 있으면 시트와 겹치므로 하단 바를 숨긴다.
  if (isSheetOpen) return null;

  return (
    <div className="apply-bar">
      <div className="apply-bar-info">
        <span className="apply-bar-title">렛츠커리어 하반기 멤버십</span>
        <span className="apply-bar-deadline">
          {dayjs(MEMBERSHIP_DEADLINE).format("M월 D일 (dd)")} 마감까지 🚀
        </span>
      </div>
      <div className="apply-bar-right">
        <BarCountdown deadline={MEMBERSHIP_DEADLINE} />
        <button className="apply-bar-btn" onClick={() => openPlanSheet()}>
          지금 바로 신청
        </button>
      </div>
    </div>
  );
}
