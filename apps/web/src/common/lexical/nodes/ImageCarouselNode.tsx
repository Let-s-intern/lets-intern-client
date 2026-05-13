import type { SerializedLexicalNode, Spread } from 'lexical';

export interface CarouselImage {
  src: string;
  altText: string;
  webpMobile?: string;
  webpDesktop?: string;
  jpegMobile?: string;
  jpegDesktop?: string;
}

export type SerializedImageCarouselNode = Spread<
  {
    images: CarouselImage[];
    width: number;
    maxWidth: number;
  },
  SerializedLexicalNode
>;
