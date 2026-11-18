import { Link, useLocation } from 'react-router-dom';
import { testNavData } from './testNavData';

/** /test 아래에서만 쓰는 개발자 테스트 사이드바. 어드민 사이드바와 같은 모양에 색만 달리 한다 */
const TestSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside>
      <nav className="sticky left-0 top-0 z-50 flex h-screen w-48 flex-col gap-4 overflow-y-auto bg-[#1F2A37] py-20 pt-4 text-white shadow-xl">
        <div className="border-b border-b-neutral-600 px-4 pb-3">
          <Link to="/test" className="text-xsmall16 font-semibold">
            개발자 테스트
          </Link>
          <p className="mt-1 text-xs text-neutral-50">조회만 하는 화면입니다</p>
        </div>
        <ul>
          {testNavData.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.url}>
                <Link
                  to={item.url}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block py-2 pl-6 text-xsmall14 hover:bg-[#2A3644]${
                    isActive ? ' bg-[#2A3644] font-semibold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/"
          className="mt-auto px-4 text-xsmall14 text-neutral-50 hover:text-white"
        >
          어드민으로 돌아가기
        </Link>
      </nav>
    </aside>
  );
};

export default TestSidebar;
