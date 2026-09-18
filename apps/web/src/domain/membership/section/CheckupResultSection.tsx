import { captureCheckupResultCtaClicked } from '../analytics';
import type { CheckupAreaScore, CheckupResult } from '../data/checkup';
import {
  CHECKUP_RESULT,
  CHECKUP_RESULT_COPY,
  CHECKUP_STATUS_LABEL,
} from '../data/checkup';

interface Props {
  /** 5문항을 다 답하기 전에는 null 이다 */
  result: CheckupResult | null;
  onRestart: () => void;
  /** "준비 단계 확인하기" 가 내려가는 섹션의 앵커 id */
  stepsAnchorId: string;
}

/** 가장 먼저 보완할 영역 앞의 경고 표시 */
const WARNING_ICON = (
  <svg
    aria-hidden="true"
    className="h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      d="M12 4 2.5 20.5h19L12 4Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 10v4.5" strokeLinecap="round" />
    <path d="M12 17.6h.01" strokeLinecap="round" />
  </svg>
);

const RESTART_ICON = (
  <svg
    aria-hidden="true"
    className="h-5 w-5 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
  >
    <path
      d="M20 11a8 8 0 1 0-.6 4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M20 4v6h-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** 영역 하나의 막대와 상태 한 줄 */
function AreaBar({ score }: { score: CheckupAreaScore }) {
  const isWeakest = score.status === 'weakest';

  return (
    <li>
      <p className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-bold">
        <span className="num text-neutral-45 mr-2">{score.area.no}</span>
        {score.area.label}
      </p>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#EDEFF5]">
        <div
          className={`h-full rounded-full ${
            isWeakest ? 'bg-[#F1642B]' : 'bg-[#293662]'
          }`}
          data-status={score.status}
          data-testid="checkup-area-bar"
          style={{ width: `${score.ratio * 100}%` }}
        />
      </div>

      <p
        className={`text-xsmall14 mt-2 flex items-center gap-1.5 ${
          isWeakest ? 'font-bold text-[#F1642B]' : 'text-neutral-45'
        }`}
      >
        {isWeakest ? WARNING_ICON : null}
        {CHECKUP_STATUS_LABEL[score.status]}
      </p>
    </li>
  );
}

/**
 * 시안 3 — 진단 결과 (CAREER CHECK RESULT).
 *
 * 답을 들고 있지 않다. 결과는 랜딩이 계산해 내려주고, "다시 진단하기" 도 랜딩이
 * 초기화한다 — 진단 문항 섹션과 이 섹션이 같은 답을 봐야 하기 때문이다.
 *
 * 답하기 전에도 섹션 자체는 보인다. 시안의 안내 문구("위 5문항 무료진단에 답하면 …")가
 * 결과가 어디에 나타나는지 미리 알려주는 자리다.
 */
export default function CheckupResultSection({
  result,
  onRestart,
  stepsAnchorId,
}: Props) {
  if (result === null) {
    return (
      <section
        className="bg-[#F7F8FC] py-16 md:py-20"
        id={CHECKUP_RESULT.anchorId}
      >
        <div className="wrap rv">
          <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 text-center leading-relaxed">
            {CHECKUP_RESULT.guideLines.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </section>
    );
  }

  const copy = CHECKUP_RESULT_COPY[result.weakestAreaId];

  return (
    <section
      className="bg-[#F7F8FC] py-16 md:py-20"
      id={CHECKUP_RESULT.anchorId}
    >
      <div className="wrap rv">
        <div className="mx-auto grid max-w-[1000px] gap-6 md:grid-cols-2">
          <div className="rounded-xxl flex flex-col bg-white p-7 md:p-10">
            <p className="text-sm font-bold tracking-wide text-[#F1642B]">
              {CHECKUP_RESULT.eyebrow}
            </p>
            <h3 className="text-medium22 md:text-medium24 text-neutral-0 mt-3 font-bold">
              {CHECKUP_RESULT.title}
            </h3>

            <ul className="mt-8 flex flex-col gap-7">
              {result.scores.map((score) => (
                <AreaBar key={score.area.id} score={score} />
              ))}
            </ul>

            <button
              className="text-neutral-45 text-xsmall16 mt-auto flex items-center justify-center gap-2 pt-10 font-bold"
              onClick={onRestart}
              type="button"
            >
              {RESTART_ICON}
              {CHECKUP_RESULT.restart}
            </button>
          </div>

          <div className="rounded-xxl flex flex-col border border-[#293662] bg-white p-7 md:p-10">
            <p className="text-xsmall14 w-fit rounded-full bg-[#293662] px-5 py-2.5 font-bold text-white">
              {CHECKUP_RESULT.badge}
            </p>

            <h3 className="text-medium24 md:text-xlarge28 text-neutral-0 mt-6 font-bold">
              {copy.titleLines.map((line) => (
                <span className="block" key={line.map((p) => p.text).join('')}>
                  {line.map((part) => (
                    <span
                      className={part.accent ? 'text-primary' : undefined}
                      key={part.text}
                    >
                      {part.text}
                    </span>
                  ))}
                </span>
              ))}
            </h3>

            <div className="mt-7 flex flex-col gap-5">
              {copy.body.map((paragraph) => (
                <p
                  className="text-xsmall14 md:text-xsmall16 text-neutral-40 leading-relaxed"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* `.membership-root a { color: inherit }` 가 Tailwind 글자색 유틸을
                명시도로 이긴다. 색은 안쪽 span 에 준다. */}
            <a
              className="mt-auto block rounded-lg bg-[#11142B] py-4 text-center"
              href={`#${stepsAnchorId}`}
              onClick={() =>
                captureCheckupResultCtaClicked({
                  weakestAreaId: result.weakestAreaId,
                })
              }
            >
              <span className="text-xsmall16 font-bold text-white">
                {CHECKUP_RESULT.cta}
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
