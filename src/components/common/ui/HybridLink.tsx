import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * @param {boolean} force
 *   true로 설정하면 window.location.href으로 라우팅
 *   Next.js App Router <-> React Router로 이동할 때 사용합니다.
 */

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
}

function HybridLink({
  isNextRouter,
  force = false,
  href = '#',
  children,
  onClick,
  target,
  rel,
  ...restProps
}: Props) {
  const LinkComponent: React.ElementType = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        ...restProps,
        href,
        target,
        rel,
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          if (onClick) onClick(e);
          if (force) {
            e.preventDefault();
            // target="_blank"일 때는 새 창에서 열기
            if (target === '_blank') {
              window.open(
                href,
                '_blank',
                rel ? 'noopener,noreferrer' : undefined,
              );
            } else {
              window.location.href = href;
            }
          }
        },
      }
    : {
        ...restProps,
        to: href,
        reloadDocument: force,
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          if (onClick) onClick(e);
          // React Router에서도 target="_blank" 처리
          if (force && target === '_blank') {
            e.preventDefault();
            window.open(
              href,
              '_blank',
              rel ? 'noopener,noreferrer' : undefined,
            );
          }
        },
        target,
        rel,
      };

  return <LinkComponent {...linkProps}>{children}</LinkComponent>;
}

export default HybridLink;
