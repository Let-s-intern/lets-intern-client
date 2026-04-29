import { forwardRef, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type OmittedProps = 'touchRippleRef' | 'focusRipple' | 'centerRipple';

interface GridActionLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  to: LinkProps['to'];
  children?: ReactNode;
  // MUI ButtonBase-related props we want to silently drop
  [key: string]: unknown;
}

const MUI_BUTTON_BASE_PROPS: Array<OmittedProps> = [
  'touchRippleRef',
  'focusRipple',
  'centerRipple',
];

/**
 * DataGrid `type: 'actions'` 컬럼 안에서 사용하는 Link 래퍼.
 * MUI의 GridActionsCell이 자식에게 ButtonBase props(touchRippleRef 등)를
 * forward하는데, react-router-dom Link는 이를 DOM으로 흘려 경고를 발생시킨다.
 * 이 래퍼가 해당 props를 제거한 뒤 Link로 전달한다.
 */
const GridActionLink = forwardRef<HTMLAnchorElement, GridActionLinkProps>(
  function GridActionLink({ to, children, ...rest }, ref) {
    const sanitized: Record<string, unknown> = { ...rest };
    for (const key of MUI_BUTTON_BASE_PROPS) {
      delete sanitized[key];
    }

    return (
      <Link ref={ref} to={to} {...sanitized}>
        {children}
      </Link>
    );
  },
);

export default GridActionLink;
