import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';

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

const ImageCarouselComponent = React.lazy(
  () => import('./ImageCarouselComponent'),
);

function $convertImageCarouselElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  const raw = domNode.getAttribute('data-lexical-image-carousel');
  if (!raw) return null;
  try {
    const images = JSON.parse(raw) as CarouselImage[];
    return { node: $createImageCarouselNode(images) };
  } catch {
    return null;
  }
}

export class ImageCarouselNode extends DecoratorNode<JSX.Element> {
  __images: CarouselImage[];
  __width: number;
  __maxWidth: number;

  static getType(): string {
    return 'image-carousel';
  }

  static clone(node: ImageCarouselNode): ImageCarouselNode {
    return new ImageCarouselNode(
      node.__images,
      node.__width,
      node.__maxWidth,
      node.__key,
    );
  }

  static importJSON(
    serializedNode: SerializedImageCarouselNode,
  ): ImageCarouselNode {
    return new ImageCarouselNode(
      serializedNode.images,
      serializedNode.width ?? 0,
      serializedNode.maxWidth ?? 950,
    );
  }

  exportJSON(): SerializedImageCarouselNode {
    return {
      images: this.__images,
      width: this.__width,
      maxWidth: this.__maxWidth,
      type: 'image-carousel',
      version: 1,
    };
  }

  // width 0 = 기본값 (캐러셀은 0일 때 100%로 표시, 이미지는 auto)
  constructor(
    images: CarouselImage[],
    width: number = 0,
    maxWidth: number = 950,
    key?: NodeKey,
  ) {
    super(key);
    this.__images = images;
    this.__width = width;
    this.__maxWidth = maxWidth;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute(
      'data-lexical-image-carousel',
      JSON.stringify(this.__images),
    );
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-image-carousel')) return null;
        return { conversion: $convertImageCarouselElement, priority: 1 };
      },
    };
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getImages(): CarouselImage[] {
    return this.__images;
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return (
      <Suspense fallback={null}>
        <ImageCarouselComponent
          images={this.__images}
          width={this.__width}
          maxWidth={this.__maxWidth}
        />
      </Suspense>
    );
  }
}

export function $createImageCarouselNode(
  images: CarouselImage[],
): ImageCarouselNode {
  return $applyNodeReplacement(new ImageCarouselNode(images));
}

export function $isImageCarouselNode(
  node: LexicalNode | null | undefined,
): node is ImageCarouselNode {
  return node instanceof ImageCarouselNode;
}
