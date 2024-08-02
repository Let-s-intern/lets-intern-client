import { SerializedLinkNode } from '@lexical/link';
import { SerializedListItemNode, SerializedListNode } from '@lexical/list';
import { SerializedHeadingNode, SerializedQuoteNode } from '@lexical/rich-text';
import {
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from 'lexical';
import { SerializedEmojiNode } from '../../admin/lexical/nodes/EmojiNode';
import { SerializedImageNode } from '../../admin/lexical/nodes/ImageNode';

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
      return (
        <p className="mb-4">
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
        <a href={_node.url} className="text-blue-600 hover:underline">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </a>
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
          <div draggable="false">
            <img
              src={_node.src}
              alt={_node.altText}
              style={{
                height: _node.height ? _node.height : 'inherit',
                maxWidth: _node.maxWidth,
                width: _node.width ? _node.width : 'inherit',
              }}
            />
          </div>
          {_node.showCaption ? (
            <div className="image-caption-container">
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
