import ColorThief from 'colorthief';

export default function getDominantColor(image: HTMLImageElement) {
  try {
    const colorThief = new ColorThief();
    return colorThief.getColor(image);
  } catch (err) {
    console.error(err);
    return [249, 249, 248]; // neutral-95
  }
}
