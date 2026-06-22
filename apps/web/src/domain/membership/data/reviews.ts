// 후기 섹션 데이터.
// - IMAGE_REVIEWS: 상단 캡처 이미지 후기 카드
// - MISSION_REVIEWS: 챌린지 미션 후기(기존 qcard 디자인 유지: 기업 칩·날짜·프로그램·내용·이름)
//   정의서 테이블 전체 행 반영. 기업 미상 행은 프로그램 카테고리를 칩으로(분류값은 비노출).

export interface ImageReview {
  src: string;
  alt: string;
  source: string;
  badge: string;
  quote: string;
}

export const IMAGE_REVIEWS: ImageReview[] = [
  {
    src: '/images/membership/review-instagram.jpg',
    alt: '인스타그램으로 받은 합격 후기',
    source: '인스타그램 DM',
    badge: '서합·최합 🎉',
    quote:
      '렛커 챌린지로 이력서·자소서까지 다 참고했어요. 교육기업 서류 합격, 식품계 최종 합격해서 전환형으로 다니고 있어요',
  },
  {
    src: '/images/membership/review-companies.png',
    alt: '주요 기업 서류 합격 후기',
    source: '멘토에게 온 메시지',
    badge: '6개사 서류 합격',
    quote:
      '경험 정리로 강점을 발견한 덕분에 SK하이닉스·현대오일뱅크·한화시스템·한화오션·CJ ENM·현대자동차 등 주요 기업 서류 합격이라는 값진 결과를 얻었어요',
  },
  {
    src: '/images/membership/review-coverletter.png',
    alt: '자기소개서 챌린지 후기',
    source: '카카오톡 오픈채팅',
    badge: '정규직 합격 🎉',
    quote:
      '렛커 덕에 취뽀했습니다! 자기소개서 챌린지에서 방향성 설정, 경험 정리에 큰 도움을 받아 F&B 준대기업 PM 정규직으로 합격했어요',
  },
  {
    src: '/images/membership/review-interview.png',
    alt: '면접 준비 챌린지 미션 후기',
    source: '챌린지 미션 후기',
    badge: '면접 준비',
    quote:
      '가장 유용했던 점은 기업 분석 하는 방법을 알게 된 것과 100개 이상의 질문을 접할 수 있었던 거예요. 자신감 있게 실전에 임할 수 있게 됐어요',
  },
  {
    src: '/images/membership/review-letsrun.png',
    alt: '렛츠런 스터디 후기',
    source: '렛츠런 스터디',
    badge: '동기부여',
    quote:
      '이번 스터디를 하면서 확실히 동기부여도 받고 격려도 받을 수 있어서 참 뿌듯한 것 같아요. 다들 열심히 사는 모습을 보며 매일 배워요',
  },
  {
    src: '/images/membership/review-renewal.jpg',
    alt: '리뉴얼된 챌린지 후기',
    source: '챌린지 미션 후기',
    badge: '콘텐츠 만족',
    quote:
      '리뉴얼된 챌린지 콘텐츠가 정말 양질이라 계속 들여다보며 많은 도움 받았어요. 같은 경험도 관점에 따라 완전히 달라지는 걸 체험했어요',
  },
  {
    src: '/images/membership/review-community.png',
    alt: '렛츠런 스터디 커뮤니티 대화',
    source: '렛츠런 스터디',
    badge: '취준 루틴',
    quote:
      '플젝하면서도 취준 놓고 싶지 않아 렛츠런 신청했어요. 같이 달리는 분들 덕에 하루하루 덜 스트레스 받으며 작업하고 취준도 이어가요',
  },
  {
    src: '/images/membership/review-mission.png',
    alt: '미션 소감 후기',
    source: '미션 소감',
    badge: '기업 분석',
    quote:
      '산업군 분석에서 기업 분석 순서로 가니 자료 이해가 수월했어요. 취준 일기를 쓰듯 소감을 적으니 심리적 안정과 동기부여에 도움이 돼요',
  },
];

export type ChipColor =
  | 'co-green'
  | 'co-coral'
  | 'co-indigo'
  | 'co-sky'
  | 'co-blue'
  | 'co-orange'
  | 'co-purple'
  | 'co-ink';

export interface MissionReview {
  /** 기업명 또는 기업 미상 시 프로그램 카테고리 */
  chip: string;
  chipColor: ChipColor;
  /** "YY.MM.DD" */
  date: string;
  program: string;
  body: string;
  name: string;
}

export const MISSION_REVIEWS: MissionReview[] = [
  {
    chip: '네○○ · L○',
    chipColor: 'co-green',
    date: '24.09.03',
    program: '이력서·자기소개서 완성 1기',
    body: '직무 나침반 개념으로 직무를 분석하니 하고 싶은 일이 더 명확해졌어요. 대기업 채용사이트의 직무 인터뷰가 업무 루틴부터 팀 소개까지 자세해서 큰 도움이 됐습니다.',
    name: '고○○ 님',
  },
  {
    chip: 'C○',
    chipColor: 'co-coral',
    date: '25.02.12',
    program: '자기소개서 3주 완성 챌린지 2기',
    body: '왜 이 기업·산업이어야 하는지 모호했는데, 논리적이고 정확한 지원동기를 쓰는 첫 단계를 배웠어요. 분석 자료를 찾는 사이트와 방법까지 알게 됐습니다.',
    name: '임○○ 님',
  },
  {
    chip: '현○○○○',
    chipColor: 'co-indigo',
    date: '25.02.12',
    program: '자기소개서 3주 완성 챌린지 2기',
    body: '완성차 산업을 다방면으로 수집해볼 계기가 됐어요. 직무와 관련된 키워드를 한 번 더 집중적으로 분석할 필요가 있다고 느꼈습니다.',
    name: '신○○ 님',
  },
  {
    chip: '기○',
    chipColor: 'co-sky',
    date: '25.02.15',
    program: '자기소개서 3주 완성 챌린지 2기',
    body: '마케터를 희망했지만 이전 인턴 경력으로 CS/CX 직무에 더 적합하다는 걸 알게 됐어요. CX도 기획부터 마케팅 전략까지 다룬다는 점이 반가웠습니다.',
    name: '정○○ 님',
  },
  {
    chip: '토○',
    chipColor: 'co-blue',
    date: '25.03.27',
    program: '자기소개서 완성 2주 챌린지 9기',
    body: '지원 동기의 막막함을 3WHY 기법으로 해소했어요. 토스 PO가 원하는 역량이 잘 정리돼 있어 작성이 수월했습니다. 어렵지만 뿌듯한 경험이었어요.',
    name: '이○○ 님',
  },
  {
    chip: 'L○○○',
    chipColor: 'co-coral',
    date: '25.09.19',
    program: '자기소개서 3주 완성 챌린지 3기',
    body: '기업분석을 하다 보니 LG전자가 라이프·비즈니스 솔루션, 자동차 부품까지 사업을 확장해온 걸 알게 됐고, 이를 지원동기에 활용해봐도 좋겠다는 생각이 들었어요.',
    name: '김○○ 님',
  },
  {
    chip: '멜○',
    chipColor: 'co-green',
    date: '25.09.10',
    program: '자기소개서 3주 완성 챌린지 3기',
    body: 'K-STAR-K 구조를 실제 공고에 적용하며, 기업 비전과 직무 핵심을 첫 문장과 끝 문장에 녹이는 게 얼마나 중요한지 깨달았어요. 같은 경험도 키워드에 따라 인상이 달라지더라고요.',
    name: '정○○ 님',
  },
  {
    chip: '롯○○○○',
    chipColor: 'co-orange',
    date: '25.09.16',
    program: '포트폴리오 2주 완성 챌린지 15기',
    body: '포트폴리오 요약 페이지를 어떻게 보완할지 고민해보게 돼 좋았어요. 같은 직무에 합격한 분들의 예시를 참고하는 게 큰 도움이 될 것 같습니다.',
    name: '김○○ 님',
  },
  {
    chip: '삼○',
    chipColor: 'co-blue',
    date: '26.01.28',
    program: '자기소개서 완성 챌린지 6기',
    body: 'SWOT·PESTEL 분석으로 큰 그림부터 그려나갈 수 있어 도움이 많이 됐어요. 공채 시즌을 위해 미리미리 기업·산업 분석을 해둬야겠다고 느꼈습니다.',
    name: '김○○ 님',
  },
  {
    chip: '삼○',
    chipColor: 'co-blue',
    date: '26.01.31',
    program: '자기소개서 완성 챌린지 6기',
    body: '직무는 안다고 생각했는데 서비스 기획과 마케팅의 차이 등 새로 알게 된 게 많았어요. 나에게 더 핏한 공고를 분석하는 눈을 길러야겠다고 느꼈습니다.',
    name: '박○○ 님',
  },
  {
    chip: '현○',
    chipColor: 'co-indigo',
    date: '26.05.07',
    program: '면접 준비 7일 끝장 챌린지 4기',
    body: '경쟁사와 산업 분석이 선행돼야 기업의 강점을 파악할 수 있다는 걸 배웠어요. 분석한 내용을 제 경험과 연결해 면접 컨셉을 잡아보려 합니다.',
    name: '김○○ 님',
  },
  {
    chip: '현○',
    chipColor: 'co-indigo',
    date: '26.05.07',
    program: '면접 준비 7일 끝장 챌린지 4기',
    body: 'AI가 할 수 없는 저만의 가치로 1분 자기소개를 작성해봤어요. 인터뷰·SNS로 인사이트를 도출했던 경험을 들어 차별점을 강조했습니다.',
    name: '김○○ 님',
  },
  {
    chip: '인적성',
    chipColor: 'co-purple',
    date: '26.06.03',
    program: '인적성 대비 수리유형 2주 뽀개기',
    body: '상반기 처음 서류에 합격했는데 인적성에서 떨어졌어요. 뒤늦게 중요성을 깨닫고 기본부터, 속도보다 정확도 높게 차근차근 쌓아가려 합니다.',
    name: '김○○ 님',
  },
  {
    chip: '면접',
    chipColor: 'co-ink',
    date: '26.05.26',
    program: '면접 준비 7일 끝장 챌린지 5기',
    body: '면접을 준비하며 제 캐릭터·장단점·경험을 다양한 측면에서 다시 보게 됐고, 그 과정이 서류 작성에도 도움이 됐어요.',
    name: '김○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.28',
    program: '자기소개서 완성 챌린지 6기',
    body: '하나의 기업이 여러 산업에 걸쳐 다각화돼 있다는 걸 알았어요. 어떤 경쟁력과 어느 범위의 지식을 갖춰야 할지 고민하는 시간이 됐습니다.',
    name: '진○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.03',
    program: '자기소개서 완성 챌린지 6기',
    body: '자소서를 많이 써봤지만 새로운 접근법이었어요. 합격 예시본을 보며 조언을 얻을 수 있는 시간이었습니다.',
    name: '손○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.04',
    program: '자기소개서 완성 챌린지 6기',
    body: 'K-STAR-K 양식을 생각하며 작성한 건 처음이에요. 가이드라인이 있으니 표현이나 구조보다 내용 자체에 집중할 수 있었습니다.',
    name: '홍○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.06',
    program: '자기소개서 완성 챌린지 6기',
    body: '미리 기업분석을 해둬야 지원동기를 맞춤형으로 쓸 수 있다는 걸 느꼈어요. 입사 후 포부를 수치로 풀어내는 게 특히 어려웠습니다.',
    name: '김○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.13',
    program: '자기소개서 완성 챌린지 6기',
    body: "업무가 바빠 최종본을 못 냈지만, '내가 정말 하고 싶은 일이 무엇인지'를 다시 깊이 생각하게 된 값진 경험이었어요.",
    name: '박○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.13',
    program: '자기소개서 완성 챌린지 6기',
    body: '드디어 자소서 하나를 완성했어요. 퇴고할수록 부족함이 보이지만, 남은 기간 다른 자소서도 미리 써두려 합니다.',
    name: '김○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.13',
    program: '자기소개서 완성 챌린지 6기',
    body: '자소서를 완성해냈다는 뿌듯함이 커요. 피드백을 반영해 꼭 합격까지 이어가고 싶습니다.',
    name: '한○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.02.13',
    program: '자기소개서 완성 챌린지 6기',
    body: '잘 썼는지에 대한 불안감과 아쉬움은 늘 공존하는 것 같아요. 이번 상반기 공채에서 좋은 소식을 받으면 좋겠습니다.',
    name: '황○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '혼자 쓰다 보면 어떤 역량을 앞세울지 고민하다 공고를 놓치곤 했어요. 이번엔 마스터 자소서를 만들어 꼭 취뽀하려 합니다.',
    name: '박○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '경험정리 챌린지로 충분한 리소스가 모였어요. 이번 자소서 챌린지로 제 자기소개서에 대한 평가를 받아보고 싶습니다.',
    name: '진○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '같은 자소서라도 붙는 곳과 떨어지는 곳이 있더라고요. 가고 싶은 회사에 확실히 붙을 수 있는 자소서를 마련하고 싶습니다.',
    name: '손○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '취준 2회차, 1회차엔 자소서 합격률이 좋지 않았어요. 이번엔 처음부터 체계적으로 틀을 잡고, 함께 달리며 준비하려 합니다.',
    name: '김○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '대기업 공채 합격을 목표로 들어왔어요. 혼자 하면 미루게 돼서, 챌린지로 밀도 있게 공채를 준비하고 싶습니다.',
    name: '한○○ 님',
  },
  {
    chip: '자소서',
    chipColor: 'co-blue',
    date: '26.01.26',
    program: '자기소개서 완성 챌린지 6기',
    body: '공채를 앞두고 미리 준비하려 참여했어요. 이번 시간을 토대로 성장해 이번 상반기에 꼭 최종합격하고 싶습니다.',
    name: '황○○ 님',
  },
];
