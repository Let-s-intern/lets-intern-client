/**
 * NotionNode (web - 본문 렌더 측).
 *
 * apps/admin 의 NotionNode 와 동일 구조이며 읽기 전용 렌더에 사용된다.
 * 플러그인은 web 에 등록하지 않는다 — 본문에서 노드만 인식해 iframe 을 그린다.
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
  // 노션 publish URL 은 `X-Frame-Options` 로 차단되므로 `/ebd/<id>` 임베드용 URL 로 변환해 iframe 에 사용.
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
          height={NOTION_IFRAME_HEIGHT}
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
    const embedSrc = toNotionEmbedUrl(this.__url);
    if (embedSrc !== null) {
      element.setAttribute('src', embedSrc);
    }
    element.setAttribute('width', '100%');
    element.setAttribute('height', String(NOTION_IFRAME_HEIGHT));
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
