import Link from 'next/link';
import { MouseEvent } from 'react';

function HybridLink({
  href = '#',
  children,
  onClick,
  target,
  rel,
  ...restProps
}: React.ComponentProps<'a'>) {
  // 외부 링크 감지 (http/https로 시작하거나 다른 도메인)
  const isExternalLink = href.startsWith('http') || href.startsWith('//');

  const linkProps = {
    ...restProps,
    href,
    target,
    rel,
    onClick: (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e);

      // 외부 링크인 경우 기본 브라우저 동작 사용
      if (isExternalLink) {
        e.preventDefault();
        if (target === '_blank') {
          window.open(href, '_blank', rel ? 'noopener,noreferrer' : undefined);
        } else {
          window.location.href = href;
        }
      }
      // 내부 링크인 경우 Next.js Link가 처리
    },
  };

  return <Link {...linkProps}>{children}</Link>;
}

export default HybridLink;
