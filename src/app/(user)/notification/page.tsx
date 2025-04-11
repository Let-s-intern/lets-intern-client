import CheckListItem from '@components/common/notification/CheckListItem';
import TermsAgreement from '@components/common/notification/TermsAgreement';
import BaseButton from '@components/common/ui/button/BaseButton';
import Input from '@components/common/ui/input/Input';
import Label from '@components/common/ui/input/Label';
import NextBackHeader from '@components/common/ui/NextBackHeader';
import Select from '@components/common/ui/Select';
import { ReactNode } from 'react';

const programs = [
  '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
  '[피드백] 이력서 진단 REPORT, 자기소개서 진단 REPORT ',
  '[챌린지] 자기소개서 2주 완성 / 포트폴리오 2주 완성 챌린지',
  '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
];

const jobOptions = {
  business: '경영/인사/재무',
  strategy: '전략/기획/관리',
  engineering: '기술/개발/엔지니어링',
  design: '디자인/크리에이티브',
  marketing: '마케팅/영업',
  operation: '운영/CX',
  other: '기타',
};

const terms = [
  {
    title: '개인정보 수집 및 이용 동의 (필수)',
    description: (
      <>
        렛츠커리어는 앞서와 같이 귀하로부터 수집한 개인정보를 이용하여{' '}
        <UnderlineText>수집일로부터 고객 동의 철회 시까지</UnderlineText> 앱 내
        푸쉬 알림, 이메일, 문자메시지(SMS, MMS, 모바일 메시징 서비스 포함) 등을
        통하여 귀하에게 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의
        광고성 정보를 전달할 수 있습니다. 귀하는 이에 대한 동의를 거절할 수
        있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수
        없습니다.
      </>
    ),
  },
  {
    title: '마케팅 및 광고 수신 동의 (필수)',
    description: (
      <>
        렛츠커리어는 귀하의 개인정보를 다음과 같이 수집 및 이용하고자 합니다.{' '}
        <br />
        수집 및 이용 목적: 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택
        등의 광고성 정보 전달 <br />
        수집하는 개인정보 항목: 성명, 취업 상태, 연락처(휴대전화번호, 이메일
        주소 등) 등 앞의 문답 절차를 통해 제출한 개인정보 일체 <br />
        개인정보의 보유 및 이용기간,{' '}
        <UnderlineText>
          렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의 광고성 정보
          전달을 위해 수집일로부터 고객 동의 철회 시까지 보관됩니다.
        </UnderlineText>{' '}
        동의거부권 및 거부 시 불이익: 위와 같은 개인정보의 수집 및 이용을 거부할
        권리가 있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수
        없습니다.
      </>
    ),
  },
];

// TODO: 쿼리로 프로그램 아이디 받기
export default function Page() {
  return (
    <>
      <section className="mw-720 px-5">
        <NextBackHeader hideBack>프로그램 출시 알림 신청</NextBackHeader>

        {/* 프로그램 리스트 */}
        <section className="mb-8">
          <InstructionText>
            출시 알림을 받고 싶은 프로그램을 <br className="md:hidden" />
            모두 선택해 주세요.
          </InstructionText>
          <ul className="mt-5 flex flex-col gap-4">
            {programs.map((item, index) => (
              <CheckListItem key={index}>{item}</CheckListItem>
            ))}
          </ul>
        </section>
        <hr />

        {/* 사용자 정보 */}
        <section className="flex flex-col gap-5 py-8">
          <InstructionText>
            출시 알림을 받을 수 있도록 <br className="md:hidden" />
            아래 정보를 입력해주세요
          </InstructionText>
          {/* 이름 */}
          <div>
            <Label htmlFor="name" required>
              이름
            </Label>
            <Input
              id="name"
              className="mt-1 w-full"
              required
              name="name"
              placeholder="이름을 입력해주세요"
            />
          </div>
          {/* 휴대폰 번호 */}
          <div>
            <Label required>휴대폰 번호</Label>
            <div className="mt-1 flex items-center gap-1.5">
              <Input
                className="w-14"
                defaultValue="010"
                required
                name="phoneNumber-1"
              />
              <Input className="w-14" required name="phoneNumber-2" />
              <Input className="w-14" required name="phoneNumber-3" />
            </div>
          </div>
          {/* 관심 직무 */}
          <Select
            label="관심 직무"
            required
            options={jobOptions}
            placeholder="관심 직무를 선택해주세요"
          />
        </section>
        <hr />

        {/* 약관 동의 */}
        <section className="flex flex-col gap-2 pt-8">
          {terms.map((item, index) => (
            <TermsAgreement
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </section>

        {/* 버튼 */}
        <BaseButton disabled className="mb-6 mt-16 w-full">
          신청하기
        </BaseButton>
      </section>
    </>
  );
}

function InstructionText({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-neutral-0">{children}</p>;
}

function UnderlineText({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold underline decoration-neutral-40 underline-offset-2">
      {children}
    </span>
  );
}
