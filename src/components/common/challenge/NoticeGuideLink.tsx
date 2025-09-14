import { ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

function NoticeGuideLink() {
  const params = useParams();

  return (
    <Link
      to={`/challenge/${params.applicationId}/${params.programId}/guides`}
      aria-label="전체 공지사항/가이드 보기"
    >
      <ChevronRight width={20} height={20} color="#989BA2" />
    </Link>
  );
}

export default NoticeGuideLink;
