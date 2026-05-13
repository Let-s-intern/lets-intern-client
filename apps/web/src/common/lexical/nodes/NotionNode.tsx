/**
 * NotionNode (web - 본문 렌더 측).
 *
 * apps/admin 의 NotionNode 와 동일 직렬화 형식. 본문 렌더는 LexicalContent 가 별도로
 * 자체 JSON 트래버서로 처리하므로 이 클래스는 LexicalComposer 사용 경로(있다면) 와
 * importJSON 라운드트립용으로만 의미가 있다.
 *
 * 현재는 변경 격리를 위해 복제한다. 추후 공통 패키지로 승격 시 통합한다.
 */

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

import { isAllowedNotionUrl, toNotionEmbedUrl } from '../utils/notion';

const NOTION_IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-popups allow-forms';
const NOTION_DEFAULT_HEIGHT = 1200;
const NOTION_MIN_HEIGHT = 200;

type NotionComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  url: string;
  height: number;
}>;

function NotionComponent({
  className,
  format,
  nodeKey,
  url,
  height,
}: NotionComponentProps) {
  const embedSrc = toNotionEmbedUrl(url);

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      {embedSrc !== null ? (
        <iframe
          src={embedSrc}
          width="100%"
          height={height}
          frameBorder={0}
          scrolling="no"
          allowFullScreen
          sandbox={NOTION_IFRAME_SANDBOX}
          title="Notion 페이지"
          style={{ display: 'block', overflow: 'hidden' }}
        />
      ) : (
        <div
          style={{
            padding: 16,
            border: '1px dashed #d1d5db',
            color: '#6b7280',
            background: '#f9fafb',
            borderRadius: 4,
          }}
        >
          허용되지 않은 Notion URL 입니다. 이 임베드는 표시되지 않습니다.
        </div>
      )}
    </BlockWithAlignableContents>
  );
}

export type SerializedNotionNode = Spread<
  {
    url: string;
    height: number;
  },
  SerializedDecoratorBlockNode
>;

function $convertNotionElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  const url = domNode.getAttribute('data-lexical-notion-url');
  if (url && isAllowedNotionUrl(url)) {
    const heightAttr = domNode.getAttribute('height');
    const height =
      heightAttr !== null && Number.isFinite(Number(heightAttr))
        ? Math.max(NOTION_MIN_HEIGHT, Number(heightAttr))
        : NOTION_DEFAULT_HEIGHT;
    const node = $createNotionNode(url, height);
    return { node };
  }
  return null;
}

export class NotionNode extends DecoratorBlockNode {
  __url: string;
  __height: number;

  static getType(): string {
    return 'notion';
  }

  static clone(node: NotionNode): NotionNode {
    return new NotionNode(node.__url, node.__height, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedNotionNode): NotionNode {
    const url = isAllowedNotionUrl(serializedNode.url) ? serializedNode.url : '';
    const height =
      typeof serializedNode.height === 'number' &&
      Number.isFinite(serializedNode.height) &&
      serializedNode.height >= NOTION_MIN_HEIGHT
        ? serializedNode.height
        : NOTION_DEFAULT_HEIGHT;
    const node = $createNotionNode(url, height);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedNotionNode {
    return {
      ...super.exportJSON(),
      type: 'notion',
      version: 1,
      url: this.__url,
      height: this.__height,
    };
  }

  constructor(
    url: string,
    height: number = NOTION_DEFAULT_HEIGHT,
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__url = url;
    this.__height = height;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-notion', 'true');
    element.setAttribute('data-lexical-notion-url', this.__url);
    const embedSrc = toNotionEmbedUrl(this.__url);
    if (embedSrc !== null) {
      element.setAttribute('src', embedSrc);
    }
    element.setAttribute('width', '100%');
    element.setAttribute('height', String(this.__height));
    element.setAttribute('frameborder', '0');
    element.setAttribute('scrolling', 'no');
    element.setAttribute('allowfullscreen', 'true');
    element.setAttribute('sandbox', NOTION_IFRAME_SANDBOX);
    element.setAttribute('title', 'Notion 페이지');
    element.setAttribute('style', 'display:block;overflow:hidden;');
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-notion')) {
          return null;
        }
        return {
          conversion: $convertNotionElement,
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

  getHeight(): number {
    return this.__height;
  }

  setHeight(height: number): this {
    const writable = this.getWritable();
    writable.__height = Math.max(NOTION_MIN_HEIGHT, Math.floor(height));
    return writable;
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
      <NotionComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        url={this.__url}
        height={this.__height}
      />
    );
  }
}

export function $createNotionNode(
  url: string,
  height: number = NOTION_DEFAULT_HEIGHT,
): NotionNode {
  return new NotionNode(url, height);
}

export function $isNotionNode(
  node: NotionNode | LexicalNode | null | undefined,
): node is NotionNode {
  return node instanceof NotionNode;
}
