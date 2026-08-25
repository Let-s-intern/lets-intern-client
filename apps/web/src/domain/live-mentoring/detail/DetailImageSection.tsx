import Image from 'next/image';

/**
 * 운영이 확정한 마케팅 섹션을 시안 이미지 그대로 렌더한다.
 *
 * 멘토가 편집하지 않고 모든 멘토에게 동일하게 나가는 콘텐츠라, 마크업으로 옮기면
 * 시안과 미세하게 어긋나기만 하고 얻는 게 없다. 인터랙션이 필요해지는 섹션은
 * 그때 마크업으로 승격한다.
 *
 * TODO: png → webp 교체 (현재 8장 합계 약 2MB).
 */

/** 시안 파일명 → public 경로·대체텍스트·원본 크기. */
export const DETAIL_IMAGE_SECTIONS = {
  /** 0-1 · 특별 혜택 (합격 포폴 제공) */
  benefit: {
    src: '/images/live-mentoring/section-benefit.png',
    alt: '특별 혜택 — 은행, CJ 프레시웨이 합격 자소서 일부와 당근, 이랜드, 번개장터 합격 포폴 일부를 제공해 드립니다',
    width: 2880,
    height: 1526,
  },
  /** 0-2 · 취업 준비, 혼자 하기 막막하셨나요? */
  pain: {
    src: '/images/live-mentoring/section-pain.png',
    alt: '취업 준비, 혼자 하기 막막하셨나요? — 관련 경험과 스펙, 선호하는 서류, 경험 연결에 대한 고민',
    width: 2880,
    height: 1420,
  },
  /** 0-3 · 멘토링 소개 (추천 1~3) */
  mentoringIntro: {
    src: '/images/live-mentoring/section-mentoring-intro.png',
    alt: '멘토링 소개 — 혼자 막힌 취업 준비, 1:1 LIVE 멘토링으로 빠르게 정리해요. 추천 대상 안내',
    width: 2880,
    height: 3136,
  },
  /** 6 · 플랜 */
  plan: {
    src: '/images/live-mentoring/section-plan.png',
    alt: '내게 알맞은 구성을 선택할 수 있어요 — STANDARD 30분, PREMIUM 60분 플랜 안내',
    width: 1440,
    height: 1043,
  },
  /** 9 · 다른 멘토 */
  otherMentors: {
    src: '/images/live-mentoring/section-other-mentors.png',
    alt: '원하는 직무에 맞는 멘토를 찾고 있다면 다른 멘토의 1:1 LIVE 멘토링도 확인해보세요',
    width: 1440,
    height: 580,
  },
} as const;

interface DetailImageSectionProps {
  section: keyof typeof DETAIL_IMAGE_SECTIONS;
  id?: string;
  /** 첫 화면에 가까운 섹션만 우선 로드한다. */
  priority?: boolean;
}

const DetailImageSection = ({
  section,
  id,
  priority,
}: DetailImageSectionProps) => {
  const image = DETAIL_IMAGE_SECTIONS[section];
  return (
    <section id={id} className="w-full scroll-mt-16">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
};

export default DetailImageSection;
