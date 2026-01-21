import { twMerge } from '@/lib/twMerge';
import { SerializedCodeNode } from '@lexical/code';
import { SerializedLinkNode } from '@lexical/link';
import { SerializedListItemNode, SerializedListNode } from '@lexical/list';
import { SerializedHeadingNode, SerializedQuoteNode } from '@lexical/rich-text';
import {
  SerializedTableCellNode,
  SerializedTableNode,
  SerializedTableRowNode,
} from '@lexical/table';
import clsx from 'clsx';
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
import { SerializedYouTubeNode } from '../../admin/lexical/nodes/YouTubeNode';

const parseStyle = (styleString: string) =>
  styleString
    .split(';')
    .filter((s) => s.trim().length > 0)
    .reduce((acc, curr) => {
      const [key, value] = curr.split(':').map((str) => str.trim());
      const camelCaseKey = key.replace(/-([a-z])/g, (match, p1) =>
        p1.toUpperCase(),
      );
      return { ...acc, [camelCaseKey]: value };
    }, {});

const LexicalContent = ({ node }: { node: SerializedLexicalNode }) => {
  // 안전 검증: node가 없거나 type이 없으면 null 반환
  if (!node || typeof node !== 'object' || !('type' in node)) {
    return null;
  }

  switch (node.type) {
    case 'root': {
      const _node = node as SerializedRootNode;
      return (
        <div className="w-full">
          {(_node.children || []).map((child, childIndex) => (
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
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </HeadingTag>
      );
    }
    case 'quote': {
      const _node = node as SerializedQuoteNode;
      return (
        <blockquote className="mb-4 border-l-2 border-neutral-80 pl-4 text-neutral-40">
          {(_node.children || []).map((child, childIndex) => (
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
      const children = _node.children || [];
      return (
        <div className={`mb-4 ${textAlign}`}>
          {children.length === 0 ? (
            <br />
          ) : (
            children.map((child, childIndex) => (
              <LexicalContent key={childIndex} node={child} />
            ))
          )}
        </div>
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
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </ListTag>
      );
    }
    case 'listitem': {
      const _node = node as SerializedListItemNode;
      const children = _node.children || [];
      const isNested = children.some((child) => child.type === 'list');
      return (
        <li className={twMerge('ml-4', isNested && 'list-none')}>
          {children.map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </li>
      );
    }
    case 'link': {
      const _node = node as SerializedLinkNode;
      const origin = 'https://www.letscareer.co.kr'; // SSR으로 window 객체 사용 불가

      return (
        <a
          href={_node.url}
          target={_node.url.includes(origin) ? '_self' : '_blank'}
          rel="noreferrer"
          className="text-system-positive-blue hover:underline"
        >
          {(_node.children || []).map((child, childIndex) => (
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
            {(_node.children || []).map((child, childIndex) => (
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
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'layout-item': {
      const _node = node as SerializedLayoutItemNode;
      return (
        <div className="w-full border border-dashed p-3">
          {(_node.children || []).map((child, childIndex) => (
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
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </details>
      );
    }
    case 'collapsible-title': {
      const _node = node as SerializedCollapsibleTitleNode;
      return (
        <summary className="Collapsible__title py-2">
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </summary>
      );
    }
    case 'collapsible-content': {
      const _node = node as SerializedCollapsibleContentNode;
      return (
        <div className="Collapsible__content">
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </div>
      );
    }
    case 'table': {
      const _node = node as SerializedTableNode;
      return (
        <table className="my-4 w-full table-auto">
          <tbody>
            {(_node.children || []).map((child, childIndex) => (
              <LexicalContent key={childIndex} node={child} />
            ))}
          </tbody>
        </table>
      );
    }
    case 'tablerow': {
      const _node = node as SerializedTableRowNode;
      return (
        <tr>
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </tr>
      );
    }
    case 'tablecell': {
      const _node = node as SerializedTableCellNode;
      return (
        <td className="border border-neutral-80 p-2">
          {(_node.children || []).map((child, childIndex) => (
            <LexicalContent key={childIndex} node={child} />
          ))}
        </td>
      );
    }
    case 'text': {
      const _node = node as SerializedTextNode;

      let className = '';
      if (_node.format & 1) className += 'font-bold ';
      if (_node.format & 2) className += 'italic ';
      if (_node.format & 4) className += 'line-through ';
      if (_node.format & 8) className += 'underline ';
      if (_node.format & 16) className += 'font-mono bg-gray-100 px-1';

      const style = parseStyle(_node.style);

      return (
        <span
          className={clsx(className.trim(), 'leading-[25px]')}
          style={style}
        >
          {_node.text}
        </span>
      );
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
      const imageSources: {
        media: string;
        srcSet: string;
        type: string;
      }[] = [];

      if (_node.jpegDesktop) {
        imageSources.push({
          media: '(min-width: 768px)',
          srcSet: `${_node.jpegDesktop}`,
          type: 'image/jpeg',
        });
      }

      if (_node.webpDesktop) {
        imageSources.push({
          media: '(min-width: 768px)',
          srcSet: `${_node.webpDesktop}`,
          type: 'image/webp',
        });
      }

      if (_node.jpegMobile) {
        imageSources.push({
          media: '(max-width: 767px)',
          srcSet: `${_node.jpegMobile}`,
          type: 'image/jpeg',
        });
      }

      if (_node.webpMobile) {
        imageSources.push({
          media: '(max-width: 767px)',
          srcSet: `${_node.webpMobile}`,
          type: 'image/webp',
        });
      }

      // caption 안전하게 처리
      const captionNode =
        _node.showCaption &&
        _node.caption &&
        _node.caption.editorState &&
        _node.caption.editorState.root
          ? _node.caption.editorState.root
          : null;

      return (
        <span className="image">
          <div className="inline-block">
            <picture>
              {imageSources.map((source, index) => (
                <source
                  key={index}
                  media={source.media}
                  srcSet={source.srcSet}
                  type={source.type}
                />
              ))}
              <img
                src={_node.src}
                alt={_node.altText}
                draggable={false}
                className="h-auto"
                // Lexical에서 이미지 크기를 조정하지 않으면 width가 0으로 넘어옴 --> 원본 크기대로 넣기
                style={{ width: _node.width === 0 ? 'auto' : _node.width }}
              />
            </picture>
            {captionNode ? (
              <div className="image-caption-container mb-4 mt-3 w-full text-center text-xsmall14 text-neutral-50">
                <div
                  role="textbox"
                  className="w-full whitespace-pre-wrap break-keep"
                >
                  <LexicalContent node={captionNode} />
                </div>
              </div>
            ) : null}
          </div>
        </span>
      );
    }
    case 'youtube': {
      const _node = node as SerializedYouTubeNode;
      return (
        <div className="youtube my-4 flex w-full items-center justify-center">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            {/* 16:9 비율 */}
            <iframe
              className="absolute left-0 top-0 h-full w-full"
              src={`https://www.youtube.com/embed/${_node.videoID}?autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
    }
    default:
      console.warn(`Unsupported node type: ${node.type}`);
      return <span>{`${node.type} is not supported`}</span>;
  }
};

export default LexicalContent;
