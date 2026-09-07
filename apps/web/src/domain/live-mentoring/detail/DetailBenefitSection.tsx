/**
 * 시안 0-1 · 제공 자료 4종.
 *
 * `src` 는 시안 통이미지에서 카드 본문(블러 처리된 문서 지면)만 잘라낸 것이다.
 * 라벨·제목은 실제 글자라 마크업으로 옮기고, 블러 지면만 이미지로 남겼다.
 */
const BENEFIT_DOCS = [
  {
    label: '신입 공채',
    title: 'OO뱅크 서비스 기획자 자기소개서',
    src: '/images/live-mentoring/benefit-doc-1.png',
  },
  {
    label: '번개장터 인턴 합격',
    title: 'Product Manager 합격 포트폴리오',
    src: '/images/live-mentoring/benefit-doc-2.png',
  },
  {
    label: '신입 공채',
    title: 'CJ프레시웨이 IT 서비스 기획자 자기소개서',
    src: '/images/live-mentoring/benefit-doc-3.png',
  },
  {
    label: '당근 인턴, 이랜드 정규직 합격',
    title: 'Product Manager 합격 포트폴리오',
    src: '/images/live-mentoring/benefit-doc-4.png',
  },
] as const;

interface DetailBenefitSectionProps {
  id?: string;
}

/**
 * 시안 0-1 · "오직 렛츠커리어 1:1 멘토링 2차 참여자분들께만 제공되는 특별 혜택"
 *
 * 통이미지(section-benefit.png, 632KB)를 마크업으로 옮긴 것이다. 어떤 회사·직무의
 * 어떤 자료를 주는지가 이 섹션의 핵심 정보인데 전부 이미지라 검색엔진에 노출되지
 * 않았다. 이제 회사명·직무·자료 종류가 전부 텍스트다.
 *
 * 문서 지면은 일부러 블러 처리한 미리보기라 글자가 아니다. 통이미지에서 카드별로
 * 잘라내 이미지로 남겼다(각 448x512).
 *
 * 색·치수는 시안 PNG 에서 실측했다 — 회색 컨테이너 #e7e7e7 = neutral-80,
 * 컨테이너 2000px 안에 카드 448px·간격 40px, 카드 문구는 가운데 정렬.
 *
 * 카드 문구 크기만 시안과 다르다. 시안은 1440px 기준 8~9px 인데(문서 지면을 축소한
 * 결과다) 읽기 어려워 10·12px 로 올렸다.
 *
 * 그래서 좁은 화면에서는 제목이 카드마다 다른 줄 수로 접힌다. 헤더 높이를 고정하면
 * 가장 긴 제목(3줄)에 맞춰야 해 짧은 카드에 빈 공간이 크게 남는다. 대신 그리드가
 * 늘려 준 카드 높이 안에서 지면 이미지를 `mt-auto` 로 바닥에 붙여 4장의 지면 시작선을
 * 맞춘다. 줄 수가 몇이든 어긋나지 않는다.
 */
const DetailBenefitSection = ({ id }: DetailBenefitSectionProps) => (
  <section id={id} className="w-full scroll-mt-16 bg-white py-12 md:py-16">
    <div className="mw-1180 flex flex-col items-center px-5">
      <span className="text-xsmall14 md:text-small18 text-neutral-30 font-semibold">
        특별 혜택
      </span>
      <p className="text-xsmall14 md:text-small18 mt-6 text-center font-semibold text-[#6b8fff]">
        합격 포폴 일부를 제공해드립니다
      </p>
      <h2 className="text-small20 md:text-xlarge28 mt-3 whitespace-pre-line text-center font-bold">
        {'오직 렛츠커리어 1:1 멘토링 2차\n참여자분들께만 제공되는 특별 혜택'}
      </h2>
      <p className="text-xsmall14 md:text-small18 text-neutral-30 mt-6 text-center md:mt-8">
        은행, CJ 프레시웨이 합격 자소서 일부와 당근, 이랜드, 번개장터 합격 포폴
        일부를 제공해 드립니다!
      </p>

      <ul className="bg-neutral-80 mt-8 grid w-full max-w-[1000px] grid-cols-2 gap-5 rounded-lg p-5 md:mt-12 md:grid-cols-4">
        {BENEFIT_DOCS.map((doc) => (
          <li key={doc.src} className="flex h-full flex-col bg-white pt-4">
            <div className="flex flex-col items-center px-3 text-center">
              <p className="text-xxsmall10 text-neutral-30">{doc.label}</p>
              <h3 className="text-xxsmall12 mt-1 font-bold leading-tight">
                {doc.title}
              </h3>
            </div>
            {/* 블러 처리된 문서 지면 — 글자가 아니라 미리보기 이미지다 */}
            <img
              src={doc.src}
              alt=""
              aria-hidden="true"
              width={448}
              height={512}
              className="mt-auto h-auto w-full"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default DetailBenefitSection;
