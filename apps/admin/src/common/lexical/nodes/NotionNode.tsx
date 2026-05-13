/**
 * NotionNode - Lexical DecoratorBlockNode for embedding Notion pages.
 *
 * `*.notion.site` 화이트리스트 통과 URL 만 iframe 으로 렌더한다.
 * 검증 실패 시(만에 하나 잘못된 JSON 으로 들어와도) iframe 을 그리지 않고
 * 안전한 안내 placeholder 를 렌더한다.
 *
 * 운영자가 iframe 하단 핸들을 드래그하여 height 를 조절할 수 있다.
 * 조절된 height 는 노드에 저장되고 importJSON/exportJSON 으로 라운드트립.
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
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const [editor] = useLexicalComposerContext();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [displayHeight, setDisplayHeight] = useState(height);

  useEffect(() => {
    setDisplayHeight(height);
  }, [height]);

  const embedSrc = toNotionEmbedUrl(url);

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    const startHeight = displayHeight;
    let lastHeight = startHeight;

    if (overlayRef.current !== null) {
      overlayRef.current.style.display = 'block';
    }
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    const handleMove = (ev: MouseEvent) => {
      const delta = ev.clientY - startY;
      lastHeight = Math.max(NOTION_MIN_HEIGHT, startHeight + delta);
      // 드래그 중에는 DOM 직접 조작으로 빠른 preview. 리렌더 비용 회피.
      if (iframeRef.current !== null) {
        iframeRef.current.style.height = `${lastHeight}px`;
      }
    };

    const handleUp = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      if (overlayRef.current !== null) {
        overlayRef.current.style.display = 'none';
      }
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      setDisplayHeight(lastHeight);
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isNotionNode(node)) {
          node.setHeight(lastHeight);
        }
      });
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <div style={{ position: 'relative' }}>
        {embedSrc !== null ? (
          <iframe
            ref={iframeRef}
            src={embedSrc}
            width="100%"
            height={displayHeight}
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
        {/* 드래그 중 iframe 위에 깔아 mousemove 이벤트 흡수 방지(노션 iframe 은 cross-origin) */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'none',
            cursor: 'ns-resize',
            background: 'transparent',
          }}
        />
        {/* 리사이즈 핸들. embedSrc 가 유효할 때만 노출. */}
        {embedSrc !== null && (
          <div
            onMouseDown={handleResizeStart}
            title="드래그하여 노션 임베드 높이 조절"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -6,
              height: 12,
              cursor: 'ns-resize',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 60,
                height: 4,
                background: '#9ca3af',
                borderRadius: 2,
              }}
            />
          </div>
        )}
      </div>
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
    // JSON 복원 단계에서 화이트리스트 재검증.
    // 통과 실패한 URL 은 빈 문자열로 치환되어 decorate() 의 placeholder 분기로 렌더된다
    // (DecoratorBlockNode 시그니처상 null 반환은 불가).
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
