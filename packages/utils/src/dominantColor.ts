import ColorThief, { Color } from 'colorthief';

export default function getDominantColor(image: HTMLImageElement): Color {
  try {
    const colorThief = new ColorThief();
    return colorThief.getColor(image);
  } catch {
    // cross-origin 이미지에서 canvas tainted 발생 시 silent fallback.
    // 의도된 보안 차단이므로 로깅하지 않는다.
    return [249, 249, 248]; // neutral-95
  }
}
