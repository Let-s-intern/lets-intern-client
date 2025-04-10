import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import Input from '@components/common/ui/input/Input';
import Select from '@components/common/ui/Select';

import { memo, ReactNode } from 'react';

const programs = [
  '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
  '[피드백] 이력서 진단 REPORT, 자기소개서 진단 REPORT ',
  '[챌린지] 자기소개서 2주 완성 / 포트폴리오 2주 완성 챌린지',
  '[LIVE 워크숍] 링크드인 시작 방법부터 아티클 작성 계획까지 세우고 싶다면?',
];

const jobOptions = [
  {
    value: 'developer',
    caption: '웹 개발자',
  },
  {
    value: 'marketer',
    caption: '마케터',
  },
  {
    value: 'planner',
    caption: '기획자',
  },
  {
    value: 'designer',
    caption: '디자이너',
  },
  {
    value: 'assetManager',
    caption: '자산운용가',
  },
  {
    value: 'game developer',
    caption: '게임 개발자',
  },
  {
    value: 'accountant',
    caption: '회계사',
  },
  {
    value: 'content marketer',
    caption: '콘텐츠 마케터',
  },
];

const terms = [
  {
    title: '개인정보 수집 및 이용 동의 (필수)',
    description:
      '렛츠커리어는 앞서와 같이 귀하로부터 수집한 개인정보를 이용하여 수집일로부터 고객 동의 철회 시까지 앱 내 푸쉬 알림, 이메일, 문자메시지(SMS, MMS, 모바일 메시징 서비스 포함) 등을 통하여 귀하에게 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의 광고성 정보를 전달할 수 있습니다. 귀하는 이에 대한 동의를 거절할 수 있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수 없습니다.',
  },
  {
    title: '마케팅 및 광고 수신 동의 (필수)',
    description:
      '렛츠커리어는 귀하의 개인정보를 다음과 같이 수집 및 이용하고자 합니다.\n수집 및 이용 목적: 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의 광고성 정보 전달\n수집하는 개인정보 항목: 성명, 취업 상태, 연락처(휴대전화번호, 이메일 주소 등) 등 앞의 문답 절차를 통해 제출한 개인정보 일체\n개인정보의 보유 및 이용기간, 렛츠커리어의 서비스 및 상품 추천, 각종 이벤트/혜택 등의 광고성 정보 전달을 위해 수집일로부터 고객 동의 철회 시까지 보관됩니다. 동의거부권 및 거부 시 불이익: 위와 같은 개인정보의 수집 및 이용을 거부할 권리가 있습니다. 다만, 동의를 거부할 경우 상품 및 이벤트 정보를 받을 수 없습니다.',
  },
];

export default function Page() {
  return (
    <>
      {/* 헤더 */}
      <section className="flex items-center justify-between px-5 py-6">
        <p>프로그램 출시 알림 신청</p>
      </section>
      {/* 본문 */}
      <section className="px-5">
        <section>
          <p>
            출시 알림을 받고 싶은 프로그램을 <br className="md:hidden" />
            모두 선택해 주세요.
          </p>
          <ul>
            {programs.map((item, index) => (
              <CheckListItem key={index}>{item}</CheckListItem>
            ))}
          </ul>
        </section>
        <hr />
        <section>
          <p>
            출시 알림을 받을 수 있도록 <br className="md:hidden" />
            아래 정보를 입력해주세요
          </p>
          <div>
            <label htmlFor="name" className="required-star">
              이름
            </label>
            <Input
              id="name"
              className="w-full"
              required
              name="name"
              placeholder="이름을 입력해주세요"
            />
          </div>
          <div>
            <label className="required-star">휴대폰 번호</label>
            <div className="flex items-center gap-1.5">
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
          <Select label="관심 직무" required options={jobOptions} />
        </section>
        <hr />
        <section>
          <ul>
            {terms.map((item, index) => (
              <TermsAgreement
                key={index}
                title={item.title}
                description={item.description}
              />
            ))}
          </ul>
        </section>
      </section>
      {/* 하단 */}
      <section>버튼</section>
    </>
  );
}

const CheckListItem = memo(function CheckListItem({
  checked = false,
  children,
}: {
  checked?: boolean;
  children?: ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      {checked ? (
        <CheckboxActive className="shrink-0" />
      ) : (
        <CheckboxInActive className="shrink-0" />
      )}
      <span>{children}</span>
    </li>
  );
});

const TermsAgreement = memo(function TermsAgreement({
  checked = false,
  title,
  description,
}: {
  checked?: boolean;
  title: string;
  description: string;
}) {
  return (
    <li>
      <div className="flex items-center gap-2">
        {checked ? (
          <CheckboxActive className="shrink-0" />
        ) : (
          <CheckboxInActive className="shrink-0" />
        )}
        <span>{title}</span>
      </div>
      <p className="whitespace-pre-line">{description}</p>
    </li>
  );
});
