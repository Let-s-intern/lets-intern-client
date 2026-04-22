/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
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

import {BlockWithAlignableContents} from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

export type FigmaUrlType = 'design' | 'file' | 'proto' | 'board' | 'slides' | 'deck';

function getFigmaEmbedUrl(documentID: string, urlType: FigmaUrlType): string {
  const embedType = urlType === 'file' ? 'design' : urlType;
  return `https://embed.figma.com/${embedType}/${documentID}?embed-host=lexical`;
}

type FigmaComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  documentID: string;
  urlType: FigmaUrlType;
}>;

function FigmaComponent({
  className,
  format,
  nodeKey,
  documentID,
  urlType,
}: FigmaComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}>
      <iframe
        width="560"
        height="315"
        src={getFigmaEmbedUrl(documentID, urlType)}
        allowFullScreen={true}
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedFigmaNode = Spread<
  {
    documentID: string;
    urlType?: FigmaUrlType;
  },
  SerializedDecoratorBlockNode
>;

function $convertFigmaElement(
  domNode: HTMLElement,
): null | DOMConversionOutput {
  const documentID = domNode.getAttribute('data-lexical-figma');
  const urlType = (domNode.getAttribute('data-lexical-figma-type') || 'design') as FigmaUrlType;
  if (documentID) {
    const node = $createFigmaNode(documentID, urlType);
    return {node};
  }
  return null;
}

export class FigmaNode extends DecoratorBlockNode {
  __id: string;
  __urlType: FigmaUrlType;

  static getType(): string {
    return 'figma';
  }

  static clone(node: FigmaNode): FigmaNode {
    return new FigmaNode(node.__id, node.__urlType, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedFigmaNode): FigmaNode {
    const node = $createFigmaNode(
      serializedNode.documentID,
      serializedNode.urlType || 'design',
    );
    node.setFormat(serializedNode.format);
    return node;
  }

  exportJSON(): SerializedFigmaNode {
    return {
      ...super.exportJSON(),
      documentID: this.__id,
      urlType: this.__urlType,
      type: 'figma',
      version: 1,
    };
  }

  constructor(
    id: string,
    urlType: FigmaUrlType = 'design',
    format?: ElementFormatType,
    key?: NodeKey,
  ) {
    super(format, key);
    this.__id = id;
    this.__urlType = urlType;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-figma', this.__id);
    element.setAttribute('data-lexical-figma-type', this.__urlType);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute('src', getFigmaEmbedUrl(this.__id, this.__urlType));
    element.setAttribute('allowfullscreen', 'true');
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-figma')) {
          return null;
        }
        return {
          conversion: $convertFigmaElement,
          priority: 1,
        };
      },
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__id;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined,
  ): string {
    return `https://www.figma.com/${this.__urlType}/${this.__id}`;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    };
    return (
      <FigmaComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        documentID={this.__id}
        urlType={this.__urlType}
      />
    );
  }
}

export function $createFigmaNode(
  documentID: string,
  urlType: FigmaUrlType = 'design',
): FigmaNode {
  return new FigmaNode(documentID, urlType);
}

export function $isFigmaNode(
  node: FigmaNode | LexicalNode | null | undefined,
): node is FigmaNode {
  return node instanceof FigmaNode;
}
