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

const LexicalContent = ({
  node,
  index,
}: {
  node: SerializedLexicalNode;

  index: number;
}) => {
  const key = `node-${index}-${node.type}`;

  switch (node.type) {
    case 'root': {
      const _node = node as SerializedRootNode;
      return (
        <div key={key} className="mx-auto max-w-3xl">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
          ))}
        </div>
      );
    }
    case 'heading': {
      const _node = node as SerializedHeadingNode;
      const HeadingTag =
        `h${_node.tag ? _node.tag.slice(1) : '1'}` as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag key={key} className="mb-2 mt-4 text-2xl font-bold">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
          ))}
        </HeadingTag>
      );
    }
    case 'quote': {
      const _node = node as SerializedQuoteNode;
      return (
        <blockquote
          key={key}
          className="my-4 border-l-4 border-gray-300 pl-4 italic"
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
          ))}
        </blockquote>
      );
    }
    case 'paragraph': {
      const _node = node as SerializedParagraphNode;
      return (
        <p key={key} className="my-2">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
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
          key={key}
          className={_node.listType === 'bullet' ? 'list-disc' : 'list-decimal'}
          start={_node.start}
        >
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
          ))}
        </ListTag>
      );
    }
    case 'listitem': {
      const _node = node as SerializedListItemNode;
      return (
        <li key={key} className="ml-4">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
          ))}
        </li>
      );
    }
    case 'link': {
      const _node = node as SerializedLinkNode;

      return (
        <a key={key} href={_node.url} className="text-blue-600 hover:underline">
          {_node.children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} index={childIndex} />
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
      return (
        <span key={key} className={className.trim()}>
          {_node.text}
        </span>
      );
    }
    case 'emoji': {
      const _node = node as SerializedEmojiNode;
      return (
        <span
          key={key}
          className="emoji"
          role="img"
          aria-label={_node.text || ''}
        >
          {_node.text || ''}
        </span>
      );
    }
    default:
      console.warn(`Unsupported node type: ${node.type}`);
      return <span>{`${node.type} is not supported`}</span>;
  }
};

export default LexicalContent;
