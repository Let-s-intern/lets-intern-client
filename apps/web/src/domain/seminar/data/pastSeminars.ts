// S8 지난 세미나 멘토 하이라이트 4인 (figma 8_지난세미나.png 기준).
// 멘토별 카드(프로필·이력·강의자료·3분 미리보기)가 한 장에 담긴 통이미지를 사용한다.
// S4의 지난 세미나(LIVE POST) 리스트와 별개인 하드코딩 큐레이션 섹션.

export interface PastSeminarMentor {
  id: string;
  /** 캐러셀 도트 라벨용 짧은 이름 */
  name: string;
  /** 멘토 카드 통이미지 (데스크톱: 가로형, 프로필·이력·강의자료·미리보기 baked-in) */
  image: string;
  /** 멘토 카드 통이미지 (모바일: 세로형) */
  mobileImage: string;
  /** 3분 미리보기 유튜브 링크 */
  videoUrl: string;
  /** 접근성 대체 텍스트 */
  alt: string;
}

export const PAST_SEMINAR_MENTORS: PastSeminarMentor[] = [
  {
    id: 'nick',
    name: '닉 멘토',
    image: '/images/seminar/past-seminar/cards/nick.webp',
    mobileImage: '/images/seminar/past-seminar/cards/mobile/nick.webp',
    videoUrl: 'https://youtu.be/8wplX_g9lL4',
    alt: '[닉 멘토] 삼성 계열사 영업지원팀 — CJ제일제당 신사업개발·삼성 계열사 동시 최종합격. 세미나 "대기업 하반기 공채 준비는 지금부터" 3분 미리보기',
  },
  {
    id: 'pado',
    name: '파도 멘토',
    image: '/images/seminar/past-seminar/cards/pado.webp',
    mobileImage: '/images/seminar/past-seminar/cards/mobile/pado.webp',
    videoUrl: 'https://youtu.be/NiXi0pi5GJM',
    alt: '[파도 멘토] 뤼튼 AI 서비스 기획자 — 세미나 "문예창작과는 어떻게 AI 스타트업 PM이 되었을까?" 3분 미리보기',
  },
  {
    id: 'judy',
    name: '쥬디 멘토',
    image: '/images/seminar/past-seminar/cards/judy.webp',
    mobileImage: '/images/seminar/past-seminar/cards/mobile/judy.webp',
    videoUrl: 'https://youtu.be/E3qa8fEkj2g',
    alt: '[쥬디 멘토] 렛츠커리어 CEO — 3,000개 이상 서류 피드백. 세미나 "2026 취뽀를 위해 반드시 알아야 할 핵심 트렌드" 3분 미리보기',
  },
  {
    id: 'bibi',
    name: '비비 멘토',
    image: '/images/seminar/past-seminar/cards/bibi.webp',
    mobileImage: '/images/seminar/past-seminar/cards/mobile/bibi.webp',
    videoUrl: 'https://youtu.be/aA02kE9I0uk',
    alt: '[비비 멘토] 앳홈 톰 브랜드 CRM 마케터 — 세미나 "보건의료에서 마케팅으로 직무전환, 어떻게 가능했을까?" 3분 미리보기',
  },
];
