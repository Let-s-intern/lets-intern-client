import { SerializedCodeNode } from '@lexical/code';
import { SerializedLinkNode } from '@lexical/link';
import { SerializedListItemNode, SerializedListNode } from '@lexical/list';
import { SerializedHeadingNode, SerializedQuoteNode } from '@lexical/rich-text';
import {
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from 'lexical';
import { SerializedCodeHighlightNode } from '../../admin/lexical/nodes/CodeHighlightNode';
import { SerializedCollapsibleContainerNode } from '../../admin/lexical/nodes/CollapsibleContainerNode';
import { SerializedCollapsibleContentNode } from '../../admin/lexical/nodes/CollapsibleContentNode';
import { SerializedCollapsibleTitleNode } from '../../admin/lexical/nodes/CollapsibleTitleNode';
import { SerializedEmojiNode } from '../../admin/lexical/nodes/EmojiNode';
import { SerializedImageNode } from '../../admin/lexical/nodes/ImageNode';
import { SerializedLayoutContainerNode } from '../../admin/lexical/nodes/LayoutContainerNode';
import { SerializedLayoutItemNode } from '../../admin/lexical/nodes/LayoutItemNode';

const LexicalContent = ({ node }: { node: SerializedLexicalNode }) => {
  switch (node.type) {
    case 'root': {
      const _node = node as SerializedRootNode;
      return (
        <div className="mx-auto max-w-3xl">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'heading': {
      const _node = node as SerializedHeadingNode;
      const HeadingTag =
        `h${_node.tag ? _node.tag.slice(1) : '1'}` as keyof JSX.IntrinsicElements;

      return (
        <HeadingTag
          className={`mb-3 mt-6 font-bold ${HeadingTag === 'h1' ? 'text-xlarge28' : HeadingTag === 'h2' ? 'text-medium24' : 'text-small20'}`}
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </HeadingTag>
      );
    }
    case 'quote': {
      const _node = node as SerializedQuoteNode;
      return (
        <blockquote className="mb-4 border-l-2 border-neutral-80 pl-4 text-neutral-40">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </blockquote>
      );
    }
    case 'paragraph': {
      const _node = node as SerializedParagraphNode;
      let textAlign = '';
      switch (_node.format) {
        case 'center':
          textAlign = 'text-center';
          break;
        case 'right':
          textAlign = 'text-right';
          break;
        default:
          textAlign = 'text-left';
          break;
      }
      return (
        <p className={`mb-4 ${textAlign}`}>
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </p>
      );
    }
    case 'list': {
      const _node = node as SerializedListNode;
      const ListTag =
        _node.listType === 'bullet'
          ? 'ul'
          : ('ol' as keyof JSX.IntrinsicElements);
      return (
        <ListTag
          className={_node.listType === 'bullet' ? 'list-disc' : 'list-decimal'}
          start={_node.start}
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </ListTag>
      );
    }
    case 'listitem': {
      const _node = node as SerializedListItemNode;
      return (
        <li className="ml-4">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </li>
      );
    }
    case 'link': {
      const _node = node as SerializedLinkNode;

      return (
        <a
          href={_node.url}
          className="text-system-positive-blue hover:underline"
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </a>
      );
    }
    case 'code': {
      const _node = node as SerializedCodeNode;
      return (
        <div className="mb-4 mt-3 w-full bg-gray-100 p-4 font-mono">
          <code className="whitespace-pre-wrap break-keep">
            {_node.children.map((child, childIndex) => (
              <LexicalContent key={childIndex} node={child} />
            ))}
          </code>
        </div>
      );
    }
    case 'code-highlight': {
      const _node = node as SerializedCodeHighlightNode;
      let textColor = '';
      switch (_node.highlightType) {
        case 'keyword':
          textColor = 'text-[#07a]';
          break;
        case 'string':
          textColor = 'text-[#690]';
          break;
        case 'punctuation':
          textColor = 'text-[#999]';
          break;
        case 'operator':
          textColor = 'text-[##9a6e3a]';
          break;
        case 'comment':
          textColor = 'text-[#777]';
          break;
        case 'class-name':
          textColor = 'text-[#dd4a68]';
          break;
        default:
          textColor = '';
          break;
      }
      return <span className={`${textColor}`}>{_node.text}</span>;
    }
    case 'linebreak': {
      return <br />;
    }
    case 'horizontalrule': {
      return <hr className="my-4" />;
    }
    case 'layout-container': {
      const _node = node as SerializedLayoutContainerNode;
      return (
        <div
          className="grid grid-cols-1 gap-4"
          style={{ gridTemplateColumns: _node.templateColumns }}
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'layout-item': {
      const _node = node as SerializedLayoutItemNode;
      return (
        <div className="w-full border border-dashed p-3">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'collapsible-container': {
      const _node = node as SerializedCollapsibleContainerNode;
      return (
        <details
          className="Collapsible__container"
          open={_node.open}
          onToggle={() => {
            _node.open = !_node.open;
          }}
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </details>
      );
    }
    case 'collapsible-title': {
      const _node = node as SerializedCollapsibleTitleNode;
      return (
        <summary className="Collapsible__title py-2">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </summary>
      );
    }
    case 'collapsible-content': {
      const _node = node as SerializedCollapsibleContentNode;
      return (
        <div className="Collapsible__content">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'text': {
      const _node = node as SerializedTextNode;

      let className = '';
      if (_node.format & 1) className += 'font-bold ';
      if (_node.format & 2) className += 'italic ';
      if (_node.format & 8) className += 'underline ';
      if (_node.format & 16) className += 'font-mono bg-gray-100 px-1 ';

      return <span className={className.trim()}>{_node.text}</span>;
    }
    case 'emoji': {
      const _node = node as SerializedEmojiNode;
      return (
        <span className="emoji" role="img" aria-label={_node.text || ''}>
          {_node.text || ''}
        </span>
      );
    }
    case 'image': {
      const _node = node as SerializedImageNode;

      return (
        <span className="image">
          <div className="w-full" draggable="false">
            <img
              className="h-auto w-full"
              src={_node.src}
              alt={_node.altText}
            />
            {/* <img
              src={_node.src}
              alt={_node.altText}
              style={{
                height: _node.height ? _node.height : 'inherit',
                maxWidth: _node.maxWidth,
                width: _node.width ? _node.width : 'inherit',
              }}
            /> */}
          </div>
          {_node.showCaption ? (
            <div className="image-caption-container mb-4 mt-3 w-full text-xsmall14">
              <div role="textbox" className="whitespace-pre-wrap break-keep">
                <LexicalContent node={_node.caption.editorState.root} />
              </div>
            </div>
          ) : null}
        </span>
      );
    }
    default:
      console.warn(`Unsupported node type: ${node.type}`);
      return <span>{`${node.type} is not supported`}</span>;
  }
};

export default LexicalContent;
