declare module 'colorthief' {
  export type Color = [number, number, number];
  export default class ColorThief {
    getColor: (img: HTMLImageElement | null) => Color;
    getPalette: (img: HTMLImageElement | null) => Color[];
  }
}
