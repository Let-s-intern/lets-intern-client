import ColorThief from 'colorthief';

export default function getDominantColor(image: HTMLImageElement) {
  const colorThief = new ColorThief();
  return colorThief.getColor(image);
}
