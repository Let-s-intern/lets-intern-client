import { Fragment, ReactNode } from 'react';

/** **굵게** 만 처리한다. HTML 을 주입하지 않고 React 요소로만 만든다 */
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}

const LIST_ITEM = /^\s*(?:[-*•]|\d+\.)\s+/;

/**
 * AI 답변용 최소 마크다운 렌더러.
 * 시스템 프롬프트에서 굵게(**)와 목록(- , 1. )만 쓰도록 제한했으므로 그 둘만 그린다.
 */
const MarkdownText = ({ text }: { text: string }) => {
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul
        key={`list-${blocks.length}`}
        className="flex list-disc flex-col gap-1 pl-5"
      >
        {list.map((item, index) => (
          <li key={index}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const line of text.split('\n')) {
    if (LIST_ITEM.test(line)) {
      list.push(line.replace(LIST_ITEM, ''));
      continue;
    }
    flushList();
    if (line.trim()) {
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
    }
  }
  flushList();

  return <div className="flex flex-col gap-2">{blocks}</div>;
};

export default MarkdownText;
