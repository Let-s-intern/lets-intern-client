import { memo } from 'react';
import { Link } from 'react-router-dom';

import { twMerge } from '@/lib/twMerge';

/** 링크는 Link element로 변경 */
export const parseLink = (text: string, openInNewTab = true) => {
  const regex = /\((.*?)\)\[(.*?)\]/g;
  let startIndex = 0;
  const result = [];

  text.replace(regex, (match, caption, url, offset, string) => {
    const element = (
      <Link
        key={offset}
        to={url}
        className="text-primary underline"
        {...(openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {caption}
      </Link>
    );

    result.push(string.substring(startIndex, offset), element);
    startIndex = offset + match.length;
    return '';
  });
  result.push(text.substring(startIndex));

  return result;
};

interface Props {
  comment?: string;
  className?: string;
  openInNewTab?: boolean;
}

function ParsedCommentBox({ comment, className, openInNewTab = true }: Props) {
  return (
    <div className={twMerge('whitespace-pre-line', className)}>
      {parseLink(comment ?? '', openInNewTab)}
    </div>
  );
}

export default memo(ParsedCommentBox);
