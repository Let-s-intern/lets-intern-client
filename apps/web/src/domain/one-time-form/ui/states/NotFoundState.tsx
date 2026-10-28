import { CircleAlert } from 'lucide-react';
import Link from 'next/link';
import StateScreen, { lineButtonClass } from './StateScreen';

/** U1 404. 없는 slug 와 비공개 폼이 같은 화면이다 */
const NotFoundState = () => (
  <StateScreen
    icon={<CircleAlert size={28} />}
    heading="신청 페이지를 찾을 수 없어요"
    description="링크가 바뀌었거나 신청을 받지 않는 페이지예요."
    footer={
      <Link href="/" className={lineButtonClass}>
        렛츠커리어 홈으로
      </Link>
    }
  />
);

export default NotFoundState;
