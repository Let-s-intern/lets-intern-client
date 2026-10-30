import { useGetAllInOnePassLanding } from '@/domain/all-in-one-pass/api/landing';
import { useGetOpenMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';

export interface MembershipNavEntry {
  title: string;
  href: string;
  /** 활성 밑줄 판정용 경로 prefix (쿼리 제외) */
  activePath: string;
  /** 현재 판매 중인 패스가 있는지 */
  isOpen: boolean;
}

// 열린 패스가 없을 때: 문구는 "올인원패스", 클릭 시 프로그램 목록의 올인원패스 필터로 이동
const FALLBACK_ENTRY: MembershipNavEntry = {
  title: '올인원패스',
  href: '/program?type=MEMBERSHIP',
  activePath: '/program',
  isOpen: false,
};

/**
 *  * 현재 판매 중인(노출 ON + 판매기간 내) 패스가 1개면 그 패스의 제목을 띄우고 랜딩으로,
 * 0개거나 2개 이상(어느 패스인지 모호)이면 "올인원패스" 문구로 프로그램 목록으로 연결
 *  */
export function useMembershipNavEntry(): MembershipNavEntry {
  const { data: open } = useGetOpenMembershipPrivilege();
  const multiOpen = (open?.openCount ?? 0) >= 2;
  const membershipId = open?.exists ? (open.membershipId ?? 0) : 0;
  const { data: landing } = useGetAllInOnePassLanding(
    multiOpen ? 0 : membershipId,
  );

  if (!multiOpen && membershipId > 0 && landing?.title) {
    return {
      title: landing.title,
      href: `/all-in-one-pass/${membershipId}`,
      activePath: `/all-in-one-pass/${membershipId}`,
      isOpen: true,
    };
  }

  return FALLBACK_ENTRY;
}
