'use client';
import { useGetChallengeFaq } from '@/api/challenge/challenge';
import FaqDropdown from '@/common/dropdown/FaqDropdown';
import { Faq } from '@/schema';
import { MEMBERSHIP_CHALLENGE_ID } from '../constants';

const FALLBACK_FAQ: Faq[] = [
  {
    id: 0,
    question: '멤버십 이용 기간은 언제까지인가요?',
    answer:
      '모든 플랜은 2026년 7월 1일부터 9월 30일까지, 3개월간 이용할 수 있어요. 기간 내 모든 혜택을 자유롭게 사용하세요.',
  },
  {
    id: 1,
    question: '렛츠런 스터디는 페이백이 있나요?',
    answer:
      '멤버십에 포함된 렛츠런 스터디는 무료 참여 혜택으로, 별도 페이백은 제공되지 않아요.',
  },
  {
    id: 2,
    question: '1:1 현직자 멘토링은 어떻게 신청하나요?',
    answer:
      '프리미엄 플랜 가입 후 마이페이지에서 희망 직무·일정을 선택하면, 매칭된 현직자 멘토와 월 1회씩 총 3회 진행됩니다.',
  },
  {
    id: 3,
    question: '환불 규정이 궁금해요.',
    answer:
      '이용 시작 전에는 전액 환불이 가능하며, 이용 시작 후에는 콘텐츠 이용 내역에 따라 관련 법령 기준으로 환불돼요.',
  },
  {
    id: 4,
    question: '중간에 상위 플랜으로 업그레이드할 수 있나요?',
    answer:
      '네, 멤버십 기간 중 차액 결제로 상위 플랜 전환이 가능해요. 자세한 내용은 고객센터로 문의해 주세요.',
  },
];

export default function FaqSection() {
  const { data } = useGetChallengeFaq(MEMBERSHIP_CHALLENGE_ID);

  const items =
    data?.faqList && data.faqList.length > 0 ? data.faqList : FALLBACK_FAQ;

  return (
    <section className="faq">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">자주 묻는 질문</span>
          <h2>궁금한 점이 있으신가요?</h2>
        </div>
        <div className="faqlist">
          {items.map((item) => (
            <FaqDropdown key={item.id} faq={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
