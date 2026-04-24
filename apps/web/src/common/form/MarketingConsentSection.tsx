'use client';

import CheckBox from '@/common/box/CheckBox';
import { ReactNode } from 'react';

interface MarketingConsentSectionProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children?: ReactNode;
}

const MarketingConsentSection = ({
  checked,
  onCheckedChange,
  children,
}: MarketingConsentSectionProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-xsmall16 font-semibold text-neutral-0 md:text-small18">
        마케팅 활용 동의
      </h2>
      <div className="rounded-xxs bg-neutral-95 p-3 text-xsmall14 leading-relaxed text-neutral-10">
        {children || <DefaultMarketingDescription />}
      </div>
      <button
        type="button"
        onClick={() => onCheckedChange(!checked)}
        className="mt-2 flex items-center gap-1"
      >
        <CheckBox checked={checked} width="w-6" showCheckIcon />
        <span className="text-xsmall14 text-neutral-0">
          마케팅 활용에 동의합니다.
        </span>
      </button>
    </div>
  );
};

function DefaultMarketingDescription() {
  return (
    <>
      렛츠커리어(아이엔지)가 제공하는 유저 맞춤형 취업 정보, 자료집 추천, 각종
      이벤트 및 프로그램(챌린지 등) 광고성 정보를 이메일, SMS(문자), 카카오
      알림톡 등으로 받아보는 데 동의합니다.
      <br />
      <br />
      ✓ 수집 목적: 유저 맞춤형 서비스 및 프로그램 추천, 각종 경품 행사 및 이벤트
      광고성 정보 제공
      <br />
      ✓ 수집 항목: 이름, 이메일 주소, 휴대폰 번호, 마케팅 수신 동의 여부
      <br />
      ✓ 보유 및 이용 기간: 회원 탈퇴 후 30일 또는 동의 철회 시까지
      <br />
      <br />※ 본 동의는 자료집 신청을 위한 필수 사항입니다. 동의 거부 시 자료집
      신청 및 관련 서비스 이용이 제한됩니다.
    </>
  );
}

export default MarketingConsentSection;
