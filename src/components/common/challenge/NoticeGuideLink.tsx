import { TabMenu } from '@components/pages/challenge/ChallengeGuidePage';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Props {
  tab?: TabMenu;
}

function NoticeGuideLink({ tab }: Props) {
  const params = useParams<{ programId: string; applicationId: string }>();

  return (
    <Link
      href={`/challenge/${params.applicationId}/${params.programId}/guides?tab=${tab}`}
      aria-label="전체 공지사항/가이드 보기"
    >
      <ChevronRight width={20} height={20} color="#989BA2" />
    </Link>
  );
}

export default NoticeGuideLink;
