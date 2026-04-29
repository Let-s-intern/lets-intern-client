import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical';

import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

const PDFComponent = React.lazy(() => import('./PDFComponent'));

type PDFBlockComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  url: string;
  fileName: string;
}>;

function PDFBlockComponent({
  className,
  format,
  nodeKey,
  url,
  fileName,
}: PDFBlockComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <React.Suspense fallback={<div>PDF 로딩 중...</div>}>
        <PDFComponent url={url} fileName={fileName} />
      </React.Suspense>
    </BlockWithAlignableContents>
  );
}

export type SerializedPDFNode = Spread<
  {
    url: string;
    fileName: string;
  },
  SerializedDecoratorBlockNode
>;

function $convertPDFElement(domNode: HTMLElement): null | DOMConversionOutput {
  const url = domNode.getAttribute('data-lexical-pdf-url');
  const fileName =
    domNode.getAttribute('data-lexical-pdf-name') || 'document.pdf';
  if (url) {
    const node = $createPDFNode(url, fileName);
    return { node };
  }
  return null;
}

export class PDFNode extends DecoratorBlockNode {
  __url: string;
  __fileName: string;

  static getType(): string {
    return 'pdf';
  }

  static clone(node: PDFNode): PDFNode {
    return new PDFNode(node.__url, node.__fileName, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedPDFNode): PDFNode {
    const node = $createPDFNode(serializedNode.url, serializedNode.fileName);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedPDFNode {
    return {
      ...super.exportJSON(),
      url: this.__url,
      fileName: this.__fileName,
      type: 'pdf',
      version: 1,
    };
  }

  constructor(
    url: string,
    fileName: string = 'document.pdf',
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__url = url;
    this.__fileName = fileName;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-pdf-url', this.__url);
    element.setAttribute('data-lexical-pdf-name', this.__fileName);
    const link = document.createElement('a');
    link.href = this.__url;
    link.textContent = `📄 ${this.__fileName}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    element.appendChild(link);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-pdf-url')) {
          return null;
        }
        return {
          conversion: $convertPDFElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getUrl(): string {
    return this.__url;
  }

  getFileName(): string {
    return this.__fileName;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return this.__url;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <PDFBlockComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        url={this.__url}
        fileName={this.__fileName}
      />
    );
  }
}

export function $createPDFNode(
  url: string,
  fileName: string = 'document.pdf',
): PDFNode {
  return new PDFNode(url, fileName);
}

export function $isPDFNode(
  node: PDFNode | LexicalNode | null | undefined,
): node is PDFNode {
  return node instanceof PDFNode;
}
