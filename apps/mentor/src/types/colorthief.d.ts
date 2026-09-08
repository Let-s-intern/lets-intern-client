/*
  `@letscareer/utils` 를 소스로 참조하므로 그 안의 `dominantColor.ts` 까지 타입 검사에
  들어온다. mentor 의 tsconfig `include` 는 `src` 뿐이라 패키지 쪽 선언 파일
  (`packages/utils/src/colorthief.d.ts`)을 읽지 못한다. web·admin 과 같은 방식으로 둔다.
*/
declare module 'colorthief' {
  export type Color = [number, number, number];
  export default class ColorThief {
    getColor: (img: HTMLImageElement | null) => Color;
    getPalette: (img: HTMLImageElement | null) => Color[];
  }
}
