import { LIVE_CLINIC } from '../data/liveClinic';

/**
 * 개편 시안 7-0 — 쥬디 멘토 경험정리 LIVE 클리닉.
 *
 * 기존 `SpecialLiveSection`(쥬디 클리닉 + 특별 세미나 2카드) 자리를 대신한다. 섹션 id 가
 * `special-live` 에서 `live-clinic` 으로 바뀌었다 — 그 id 를 가리키던 곳은 함께 고쳤다.
 *
 * 영상은 `autoplay=0` 이다. 랜딩을 훑는 중에 소리가 나면 그대로 닫는다.
 */
export default function LiveClinicSection() {
  return (
    <section className="bg-[#F4F5F9] py-16 md:py-24" id={LIVE_CLINIC.anchorId}>
      <div className="wrap">
        <div className="text-center">
          <span className="text-neutral-0 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:text-sm">
            <span aria-hidden="true">🎙️</span>
            {LIVE_CLINIC.badge}
          </span>
        </div>

        <h2 className="text-neutral-0 mt-6 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          <span className="block">{LIVE_CLINIC.titleLines[0]}</span>
          <span className="text-primary block">
            {LIVE_CLINIC.titleLines[1]}
          </span>
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center leading-relaxed">
          {LIVE_CLINIC.subLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <strong className="text-primary text-base font-bold">
              {LIVE_CLINIC.statValue}
            </strong>
            <span className="text-xsmall14 text-neutral-40">
              {LIVE_CLINIC.statLabel}
            </span>
          </span>
        </div>

        {/* 16:9 비율 유지 — LexicalContent 의 유튜브 임베드와 같은 방식 */}
        <div className="rounded-xxl mx-auto mt-10 max-w-[840px] overflow-hidden bg-black md:mt-14">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${LIVE_CLINIC.videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`}
              title={LIVE_CLINIC.videoTitle}
            />
          </div>
        </div>

        <ol className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-5">
          {LIVE_CLINIC.steps.map((step) => (
            <li
              className="rounded-xxl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.05)] md:p-7"
              key={step.label}
            >
              <span className="text-primary text-sm font-bold tracking-wide">
                {step.label}
              </span>
              <strong className="text-xsmall16 text-neutral-0 mt-3 block font-bold">
                {step.title}
              </strong>
              <p className="text-xsmall14 text-neutral-40 mt-3 leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
