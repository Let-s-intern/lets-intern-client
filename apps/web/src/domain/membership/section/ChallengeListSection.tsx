import { CHALLENGE_ITEMS } from '../data/challengeModalItems';

/**
 * 시안 10 — 챌린지 10종 카드 그리드 (PASS BENEFIT 02).
 *
 * 데이터는 기존 `CHALLENGE_ITEMS` 를 그대로 쓴다. 시안 10 의 10종이 이름·순서까지
 * 그것과 같아서 새로 만들 이유가 없다. 링크도 `/challenge/{slug}/latest` 라
 * 새 회차가 열려도 이 파일을 고칠 필요가 없다.
 */
export default function ChallengeListSection() {
  return (
    <section className="bg-white py-16 md:py-24" id="challenges">
      <div className="wrap">
        <div className="flex items-center justify-center gap-3">
          <span className="rounded-full bg-[#F1642B] px-3 py-1 text-xs font-bold text-white">
            PASS BENEFIT 02
          </span>
          <span className="text-sm font-bold tracking-wide text-[#F1642B]">
            10 CHALLENGES
          </span>
        </div>

        <h2 className="text-neutral-0 mt-4 text-center text-2xl font-bold leading-snug md:text-[2rem]">
          취준 필수 챌린지 참여 10종 - 베이직
        </h2>

        <p className="text-xsmall14 md:text-xsmall16 text-neutral-40 mt-4 text-center">
          <span className="block">
            진단 결과에 따라 10주 합격 플레이북을 활용해 나의 단계에 맞는
            챌린지에 참여하세요.
          </span>
          <span className="block">
            베이직보다 높은 단계의 플랜은 차액 결제 후 이용가능해요.
          </span>
        </p>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {CHALLENGE_ITEMS.map((item) => (
            <a
              className="rounded-xxl flex flex-col bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]"
              href={item.url}
              key={item.label}
            >
              {/*
                object-cover 를 쓰지 않는다. 썸네일에 글자가 들어 있어 비율이 다르면
                제목이 잘린다. 원본 비율 그대로 두고 폭만 맞춘다.
              */}
              <img
                alt=""
                className="w-full rounded-lg"
                loading="lazy"
                src={`/images/membership/${item.src}`}
              />
              <div className="flex flex-1 flex-col justify-between pt-4">
                <strong className="text-xsmall16 text-neutral-0 font-bold">
                  {item.label}
                </strong>
                <span className="text-primary text-xsmall14 mt-6 self-end font-medium">
                  챌린지 자세히 보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
