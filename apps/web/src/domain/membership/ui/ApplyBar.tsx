import dayjs from "../lib/dayjs";
import BarCountdown from "./BarCountdown";
import { openPlanSheet } from "../lib/planSheet";
import { MEMBERSHIP_DEADLINE } from "../data/membership";

// ApplyCTA.tsx(Desktop/MobileApplyCTA) 디자인 복사 — 하단 고정 신청 바.
export default function ApplyBar() {
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
