// apps/admin 전용 — 챌린지 제출확인 표의 column 정렬을 견고하게 만들기 위해
// shrink-0 을 묶어 둔다. packages/utils 는 web 의 동일 화면이 함께 사용 중이라
// 그쪽 영향을 피하려고 admin 로컬에서만 override 한다.
//
// 1400px 기준 폭(괄호 안 px)과 들어갈 콘텐츠:
//  0  체크박스      4%  (56)  ─ 16px 아이콘
//  1  제출일자     11%  (154) ─ "YYYY-MM-DD HH:mm" 16자
//  2  이름          6%  (84)  ─ 한글 3~4자
//  3  메일         13%  (182) ─ ellipsis 전제, 길면 잘림
//  4  옵션 코드     8%  (112) ─ 짧은 코드 1~2개
//  5  제출현황(드롭)  7%  (98)  ─ "확인중 ▼" 버튼
//  6  미션(링크)    4%  (56)  ─ "확인" 작은 링크
//  7  확인여부(드롭)  7%  (98)  ─ "확인 완료 ▼" 버튼
//  8  코멘트       14%  (196) ─ 자유 텍스트
//  9  미션 소감    flex-1 ~21% (294) ─ 가장 긴 자유 텍스트, 잉여 흡수
// 10  노출 여부     5%  (70)  ─ MUI Switch 58px + 여유
export const challengeSubmitDetailCellWidthList = [
  'w-[4%] shrink-0',
  'w-[11%] shrink-0',
  'w-[6%] shrink-0',
  'w-[13%] shrink-0',
  'w-[8%] shrink-0',
  'w-[7%] shrink-0',
  'w-[4%] shrink-0',
  'w-[7%] shrink-0',
  'w-[14%] shrink-0',
  'flex-1 shrink-0',
  'w-[5%] shrink-0',
];
