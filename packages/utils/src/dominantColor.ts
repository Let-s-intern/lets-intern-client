import ColorThief, { Color } from 'colorthief';

export default function getDominantColor(image: HTMLImageElement): Color {
  try {
    const colorThief = new ColorThief();
    return colorThief.getColor(image);
  } catch (err) {
    console.error(err);
    return [249, 249, 248]; // neutral-95
  }
}
