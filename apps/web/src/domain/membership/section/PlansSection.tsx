import { useState } from "react";
import dayjs from "../lib/dayjs";
import { openPlanSheet } from "../lib/planSheet";
import {
  formatKRW,
  MEMBERSHIP_END_DATE,
  MEMBERSHIP_PLANS,
  MEMBERSHIP_START_DATE,
} from "../data/membership";
import { COMPARE_ROWS, PLAN_CARDS } from "../data/plans";

type TabKey = "a" | "b";

/** 비교표 셀 렌더 — "✓"=체크, "–"=대시, 배열=여러 줄 목록, 그 외 텍스트 */
function CompareCell({ value }: { value: string | string[] }) {
  if (Array.isArray(value)) {
    return (
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontSize: 12.5,
          fontWeight: 600,
          lineHeight: 1.45,
          color: "var(--g600)",
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {value.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </span>
    );
  }
  if (value === "✓") return <span className="check">✓</span>;
  if (value === "–") return <span className="dash">–</span>;
  return <>{value}</>;
}

export default function PlansSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("a");
  const plans = MEMBERSHIP_PLANS;
  const startDate = MEMBERSHIP_START_DATE;
  const endDate = MEMBERSHIP_END_DATE;

  return (
    <section className="plans" id="plans">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">멤버십 플랜</span>
          <h2>나에게 맞는 플랜을 선택하세요</h2>
          <p>
            가장 많은 분들이 <b style={{ color: "var(--lc-blue)" }}>스탠다드</b>
            를 선택했어요.
          </p>
        </div>

        <div className="tabs">
          {(["a", "b"] as TabKey[]).map((v) => (
            <button
              key={v}
              className={`tab ${activeTab === v ? "on" : ""}`}
              onClick={() => setActiveTab(v)}
            >
              {v === "a" ? "카드형" : "비교표"}
            </button>
          ))}
        </div>

        {/* VARIANT A — 카드형 */}
        <div
          className={`variant ${activeTab === "a" ? "on" : ""}`}
          style={activeTab !== "a" ? { display: "none" } : undefined}
        >
          <div className="pcards">
            {PLAN_CARDS.map((card, i) => {
              const plan = plans[card.key];
              const cls =
                card.variant === "standard"
                  ? "pcard feat rv"
                  : card.variant === "premium"
                    ? "pcard prem rv"
                    : "pcard rv";
              const wasStyle =
                card.variant === "premium" ? { color: "#9aa0b5" } : undefined;
              return (
                <div
                  key={card.key}
                  className={cls}
                  style={{ ["--rvd" as string]: `${i * 0.08}s` }}
                >
                  {card.ribbon && <span className="ribbon">{card.ribbon}</span>}
                  <div className="pname">{plan.label}</div>
                  <div className="ptarget">
                    {card.target.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < card.target.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <div className="price">
                    <span className="was num" style={wasStyle}>
                      {formatKRW(plan.originalPrice)}원
                    </span>
                    <br />
                    <span className="now num">{formatKRW(plan.price)}</span>
                    <span className="won">원</span>
                  </div>
                  <span className="off">{plan.discount}</span>
                  <ul className="plist">
                    {card.features.map((f, idx) => (
                      <li key={idx} className={f.off ? "off-item" : undefined}>
                        {f.text}
                        {f.sub && (
                          <span
                            style={{ color: "var(--g500)", fontWeight: 500 }}
                          >
                            {" "}
                            {f.sub}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {card.variant === "basic" && (
                    <button
                      className="btn btn-ghost"
                      onClick={() => openPlanSheet(card.key)}
                    >
                      {card.button}
                    </button>
                  )}
                  {card.variant === "standard" && (
                    <button
                      className="btn btn-blue"
                      onClick={() => openPlanSheet(card.key)}
                    >
                      {card.button}
                    </button>
                  )}
                  {card.variant === "premium" && (
                    <button
                      className="btn"
                      style={{
                        background: "var(--lc-yellow)",
                        color: "#1C1C1C",
                      }}
                      onClick={() => openPlanSheet(card.key)}
                    >
                      {card.button}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="plan-note">
            모든 플랜은{" "}
            <b>
              {dayjs(startDate).format("YY.MM.DD")} –{" "}
              {dayjs(endDate).format("MM.DD")}
            </b>{" "}
            {dayjs(endDate).diff(dayjs(startDate), "month") + 1}개월간 이용 가능
            · 결제 시 등급별 혜택이 자동 적용돼요
          </p>
        </div>

        {/* VARIANT B — 비교표 */}
        <div
          className={`variant ${activeTab === "b" ? "on" : ""}`}
          style={activeTab !== "b" ? { display: "none" } : undefined}
        >
          <div className="matrix" id="matrix">
            <div className="mrow head">
              <div></div>
              <div>
                <span className="mname">베이직</span>
                <span className="mprice num">
                  {formatKRW(plans.BASIC.price)}원
                </span>
              </div>
              <div className="mcol-feat">
                <span className="mhead-tag">가장 인기</span>
                <span className="mname b">스탠다드</span>
                <span className="mprice b num">
                  {formatKRW(plans.STANDARD.price)}원
                </span>
              </div>
              <div>
                <span className="mname">프리미엄</span>
                <span className="mprice num">
                  {formatKRW(plans.PREMIUM.price)}원
                </span>
              </div>
            </div>
            {COMPARE_ROWS.map((row) => (
              <div className="mrow" key={row.label}>
                <div>{row.label}</div>
                <div>
                  <CompareCell value={row.basic} />
                </div>
                <div className="mcol-feat">
                  <CompareCell value={row.standard} />
                </div>
                <div>
                  <CompareCell value={row.premium} />
                </div>
              </div>
            ))}
          </div>
          <p className="plan-note">
            행은 혜택, 열은 플랜 · 스탠다드 열을 한눈에 비교하세요
          </p>
        </div>
      </div>
    </section>
  );
}
