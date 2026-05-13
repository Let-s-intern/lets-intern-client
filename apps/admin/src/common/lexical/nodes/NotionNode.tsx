/**
 * NotionNode - Lexical DecoratorBlockNode for embedding Notion pages.
 *
 * letsintern.notion.site / www.notion.so 화이트리스트 통과 URL 만 iframe 으로 렌더한다.
 * 검증 실패 시(만에 하나 잘못된 JSON 으로 들어와도) iframe 을 그리지 않고
 * 안전한 안내 placeholder 를 렌더한다.
 *
 * YouTubeNode.tsx 를 템플릿으로 한다.
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

import { isAllowedNotionUrl } from '../utils/notion';

const NOTION_IFRAME_SANDBOX =
  'allow-scripts allow-same-origin allow-popups allow-forms';
const NOTION_IFRAME_HEIGHT = 600;

type NotionComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  url: string;
}>;

function NotionComponent({
  className,
  format,
  nodeKey,
  url,
}: NotionComponentProps) {
  const allowed = isAllowedNotionUrl(url);

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      {allowed ? (
        <iframe
          src={url}
          width="100%"
          height={NOTION_IFRAME_HEIGHT}
          frameBorder={0}
          allowFullScreen
          sandbox={NOTION_IFRAME_SANDBOX}
          title="Notion 페이지"
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
  },
  SerializedDecoratorBlockNode
>;

function $convertNotionElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  const url = domNode.getAttribute('data-lexical-notion-url');
  if (url && isAllowedNotionUrl(url)) {
    const node = $createNotionNode(url);
    return { node };
  }
  return null;
}

export class NotionNode extends DecoratorBlockNode {
  __url: string;

  static getType(): string {
    return 'notion';
  }

  static clone(node: NotionNode): NotionNode {
    return new NotionNode(node.__url, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedNotionNode): NotionNode {
    // JSON 복원 단계에서 화이트리스트를 한 번 더 검증한다.
    // 통과 실패한 URL 은 빈 문자열로 치환되어 decorate() 단계에서
    // placeholder 가 렌더된다 (DecoratorBlockNode 시그니처상 null 반환은 불가).
    const url = isAllowedNotionUrl(serializedNode.url) ? serializedNode.url : '';
    const node = $createNotionNode(url);
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedNotionNode {
    return {
      ...super.exportJSON(),
      type: 'notion',
      version: 1,
      url: this.__url,
    };
  }

  constructor(url: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__url = url;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-notion', 'true');
    element.setAttribute('data-lexical-notion-url', this.__url);
    // 화이트리스트 통과 URL 만 실제 src 를 부여한다.
    if (isAllowedNotionUrl(this.__url)) {
      element.setAttribute('src', this.__url);
    }
    element.setAttribute('width', '100%');
    element.setAttribute('height', String(NOTION_IFRAME_HEIGHT));
    element.setAttribute('frameborder', '0');
    element.setAttribute('allowfullscreen', 'true');
    element.setAttribute('sandbox', NOTION_IFRAME_SANDBOX);
    element.setAttribute('title', 'Notion 페이지');
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
      />
    );
  }
}

export function $createNotionNode(url: string): NotionNode {
  return new NotionNode(url);
}

export function $isNotionNode(
  node: NotionNode | LexicalNode | null | undefined,
): node is NotionNode {
  return node instanceof NotionNode;
}
