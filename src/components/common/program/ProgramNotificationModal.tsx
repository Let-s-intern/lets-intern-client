import CheckboxActive from '@/assets/icons/checkbox-active.svg?react';
import CheckboxInActive from '@/assets/icons/checkbox-inactive.svg?react';
import ResponsiveModal from '@components/ui/ResponsiveModal';
import { X } from 'lucide-react';
import { memo, ReactNode } from 'react';
import Input from '../ui/input/Input';
import Select from '../ui/Select';

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

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  isLoading?: boolean;
}

function ProgramNotificationModal({ isOpen, isLoading, onClose }: Props) {
  return (
    <ResponsiveModal
      className="max-w-[45rem] overflow-y-auto md:h-full md:w-full"
      wrapperClassName="md:py-[6.5rem]"
      isOpen={isOpen}
      isLoading={isLoading}
    >
      {/* 헤더 */}
      <section className="flex items-center justify-between px-5 py-6">
        <p>프로그램 출시 알림 신청</p>
        <X onClick={onClose} />
      </section>
      {/* 본문 */}
      <div className="px-5">
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
        <section>약관 동의</section>
      </div>
      {/* 하단 */}
      <section>버튼</section>
    </ResponsiveModal>
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

export default ProgramNotificationModal;
