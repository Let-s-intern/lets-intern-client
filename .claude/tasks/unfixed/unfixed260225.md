src/domain/curation/challenge-comparison/CompareResultCard.tsx
+53 선부터 +62 선까지에 대해 코멘트
const titleParts = 프로그램.map((p) => {
만약 (p.제목.includes('경험정리')) 반환 '경험정리';
만약 (p.제목.includes('이력서')) 반환 '이력서';
만약 (p.제목.includes('대기업')) 반환 '대기업 자소서';
만약 (p.제목.includes('자기소개서')) 반환 '자소서';
만약 (p.제목.includes('포트폴리오')) 반환 '포트폴리오';
만약 (p.제목.includes('마케팅')) 반환 '마케팅';
만약 (p.제목.includes('HR')) 반환 'HR';
반환 p.제목;
});
@gemini-코드 어시스트
제미니 코드-어시스트 봇
8 minutes ago
중간

현재 비교 결과 제목을 생성하는 로직이 를 사용하여 문자열을 확인하고 있어, 향후 프로그램 이름이 변경되거나 새로운 프로그램이 추가될 때 깨지기 쉬운 구조입니다. 예를 들어, '경험정리'와 '경험분석' 챌린지가 모두 '경험'을 포함하고 있어 의도치 않은 결과가 나올 수 있습니다.includes

PROGRAMS 데이터 객체에 이나 같은 짧은 별칭을 추가하고, 이 값을 조합하여 제목을 생성하는 방식을 고려해 보세요. 이렇게 하면 데이터와 로직이 분리되어 유지보수성이 향상됩니다.shortTitlealias

예시:
src/domain/curation/shared/programs.ts

export const PROGRAMS: Record<ProgramId, ProgramContent> = {
experience: {
// ...
shortTitle: '경험정리',
// ...
},
// ...
};
const titleParts = programs.map((p) => p.shortTitle || p.title);
