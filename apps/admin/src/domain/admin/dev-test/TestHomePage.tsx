import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import { Link } from 'react-router-dom';
import { testNavData } from './testNavData';

/** /test 첫 화면. 테스트 목록만 보여 준다 */
const TestHomePage = () => (
  <div className="mx-3 mb-40 mt-3">
    <Header>
      <Heading>개발자 테스트</Heading>
    </Header>
    <p className="mt-2 text-xsmall14 text-neutral-40">
      주소로만 들어오는 개발자용 화면입니다. 조회만 하며 데이터를 바꾸지
      않습니다.
    </p>
    <ul className="mt-6 flex flex-col gap-3">
      {testNavData.map((item) => (
        <li
          key={item.url}
          className="rounded-sm border border-neutral-80 p-4 hover:bg-neutral-95"
        >
          <Link to={item.url} className="block">
            <p className="font-semibold text-neutral-0">{item.name}</p>
            <p className="mt-1 text-xsmall14 text-neutral-40">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default TestHomePage;
