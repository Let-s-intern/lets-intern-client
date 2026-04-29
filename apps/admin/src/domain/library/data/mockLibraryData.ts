export interface LibraryDetailInfo {
  id: number;
  title: string;
  category: string;
  description: string;
  thumbnail: string | null;
  displayDate: string;
  content: string;
}

export const MOCK_LIBRARY_DETAILS: LibraryDetailInfo[] = [
  {
    id: 1,
    title: '제목이 한줄 일때',
    category: '카테고리 분류',
    description:
      '취업 준비에 꼭 필요한 자료를 모았습니다. 지금 바로 확인하세요.',
    thumbnail: null,
    displayDate: '2025-01-30',
    content: `<p>취업 준비, 어디서부터 시작해야 할지 막막하신가요?</p>
<p>렛츠커리어가 준비한 무료 자료집으로 취업 준비의 첫걸음을 내딛어 보세요. 이력서 작성부터 면접 준비까지, 취준생이 꼭 알아야 할 핵심 정보를 담았습니다.</p>
<h2>자료집 주요 내용</h2>
<ul>
  <li>이력서 작성 가이드</li>
  <li>자기소개서 핵심 포인트</li>
  <li>면접 준비 체크리스트</li>
</ul>
<p>지금 바로 다운로드하여 취업 준비에 활용해 보세요!</p>`,
  },
  {
    id: 2,
    title:
      '제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목',
    category: '카테고리 분류',
    description: '취업 시장 트렌드와 합격 전략을 한눈에 정리했습니다.',
    thumbnail: null,
    displayDate: '2025-01-30',
    content: `<p>2025년 취업 시장은 어떻게 변화하고 있을까요?</p>
<p>최신 채용 트렌드와 기업별 선호 역량을 분석하여, 여러분의 취업 전략 수립에 도움이 될 자료를 준비했습니다.</p>
<h2>주요 트렌드</h2>
<ol>
  <li>AI 역량의 중요성 증가</li>
  <li>프로젝트 경험 중심 평가</li>
  <li>소프트스킬 강조</li>
</ol>
<p>변화하는 채용 시장에서 경쟁력을 갖추세요.</p>`,
  },
  {
    id: 3,
    title: '나의 경험을 200% 활용하여 제작하는 자기소개서 2주 완성 챌린지',
    category: '카테고리 분류',
    description:
      '자기소개서 작성에 어려움을 겪고 있다면, 이 자료집이 도움이 됩니다.',
    thumbnail: null,
    displayDate: '2025-02-15',
    content: `<p>자기소개서, 매번 쓸 때마다 막막하셨나요?</p>
<p>나의 경험을 체계적으로 정리하고, 기업이 원하는 인재상에 맞춰 자기소개서를 작성하는 방법을 알려드립니다.</p>
<h2>2주 완성 플랜</h2>
<ul>
  <li>1주차: 경험 정리 및 핵심 역량 도출</li>
  <li>2주차: 기업별 맞춤 자기소개서 작성</li>
</ul>
<h2>이런 분께 추천해요</h2>
<ul>
  <li>자기소개서를 처음 쓰는 취준생</li>
  <li>기존 자기소개서를 업그레이드하고 싶은 분</li>
  <li>다양한 경험을 효과적으로 어필하고 싶은 분</li>
</ul>`,
  },
  {
    id: 4,
    title:
      '제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목이 들어갑니다 제목',
    category: '카테고리 분류',
    description: '포트폴리오 제작에 필요한 모든 것을 담았습니다.',
    thumbnail: null,
    displayDate: '2025-01-30',
    content: `<p>포트폴리오, 어떻게 만들어야 할지 고민이신가요?</p>
<p>직무별 포트폴리오 작성 가이드와 실제 합격 사례를 참고하여 나만의 포트폴리오를 완성해 보세요.</p>
<h2>포트폴리오 구성 요소</h2>
<ul>
  <li>프로젝트 소개 및 역할</li>
  <li>문제 해결 과정</li>
  <li>성과 및 결과물</li>
</ul>`,
  },
];

export const MOCK_LIBRARY_RECOMMENDS = MOCK_LIBRARY_DETAILS.slice(0, 4);

export function findMockLibrary(
  id: string | number,
): LibraryDetailInfo | undefined {
  return MOCK_LIBRARY_DETAILS.find((item) => item.id === Number(id));
}
