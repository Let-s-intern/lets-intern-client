import { memo } from 'react';

import { twMerge } from '@/lib/twMerge';
import { parseLink } from '../utils/parseLink';

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
