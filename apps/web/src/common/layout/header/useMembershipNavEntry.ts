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
 * 헤더 올인원패스 진입 메뉴의 문구·링크를 결정한다.
 * 현재 판매 중인(노출 ON + 판매기간 내) 패스가 있으면 그 패스의 제목을 띄우고 랜딩으로,
 * 없으면 "올인원패스" 문구로 프로그램 목록(올인원패스 필터)으로 연결한다.
 * 어느 패스를 띄울지는 서버가 정한다(GET /membership/open/privilege: 조건 충족 중 최신 1건).
 */
export function useMembershipNavEntry(): MembershipNavEntry {
  const { data: open } = useGetOpenMembershipPrivilege();
  const membershipId = open?.exists ? (open.membershipId ?? 0) : 0;
  const { data: landing } = useGetAllInOnePassLanding(membershipId);

  if (membershipId > 0 && landing?.title) {
    return {
      title: landing.title,
      href: `/all-in-one-pass/${membershipId}`,
      activePath: `/all-in-one-pass/${membershipId}`,
      isOpen: true,
    };
  }

  return FALLBACK_ENTRY;
}
