import HybridLink from '@/common/HybridLink';

/** 코멘트 텍스트 안의 `(캡션)[url]` 패턴을 Link element로 변환 */
export const parseLink = (text: string, openInNewTab = true) => {
  const regex = /\((.*?)\)\[(.*?)\]/g;
  let startIndex = 0;
  const result = [];

  text.replace(regex, (match, caption, url, offset, string) => {
    const element = (
      <HybridLink
        key={offset}
        href={url}
        className="text-primary underline"
        {...(openInNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {caption}
      </HybridLink>
    );

    result.push(string.substring(startIndex, offset), element);
    startIndex = offset + match.length;
    return '';
  });
  result.push(text.substring(startIndex));

  return result;
};
