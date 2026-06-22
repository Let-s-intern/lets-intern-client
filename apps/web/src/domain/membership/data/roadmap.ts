// 3개월 로드맵 섹션 데이터. (기능명세서 7)

export interface RoadmapNode {
  dot: string;
  mon: string;
  title: string;
  body: string;
}

export const ROADMAP = {
  badge: "3개월 합격 로드맵",
  titleLines: ["7월부터 9월까지,", "공채 흐름에 맞춰 달려요"],
  nodes: [
    {
      dot: "7",
      mon: "JULY",
      title: "서류 완성",
      body: "경험정리부터 이력서·자소서까지. 가이드북 + 챌린지로 합격 서류의 뼈대를 만들어요.",
    },
    {
      dot: "8",
      mon: "AUGUST",
      title: "인적성·직무 준비",
      body: "VOD와 렛츠런 스터디로 인적성·직무 역량을 다지고 지원 전략을 세워요.",
    },
    {
      dot: "9",
      mon: "SEPTEMBER",
      title: "면접 마무리",
      body: "1:1 현직자 멘토링과 면접 가이드로 마지막 관문까지 완주합니다.",
    },
  ] as RoadmapNode[],
} as const;
