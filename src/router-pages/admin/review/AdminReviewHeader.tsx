import { NavLink, NavLinkRenderProps } from 'react-router-dom';

const getNavLinkClassName: (
  props: NavLinkRenderProps,
) => string | undefined = ({ isActive }) => {
  const defaultClassName = 'text-gray-500 px-4 py-2';
  if (isActive) {
    return `${defaultClassName} font-bold text-primary`;
  }
  return `${defaultClassName}`;
};

export default function AdminReviewHeader() {
  return (
    <header className="mx-2 my-1">
      <h1 className="mb-2 font-bold text-medium22">후기 관리</h1>
      <nav>
        <ul className="flex">
          <li>
            <NavLink
              to="/admin/review/challenge"
              className={getNavLinkClassName}
            >
              챌린지
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/review/live" className={getNavLinkClassName}>
              라이브
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/review/blog" className={getNavLinkClassName}>
              블로그
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/review/report" className={getNavLinkClassName}>
              리포트
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
