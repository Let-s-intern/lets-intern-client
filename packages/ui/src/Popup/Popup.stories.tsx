import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popup } from './Popup';

const TRIGGER_CLASSES =
  'inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-xsmall14 font-medium text-white transition-colors hover:bg-primary-hover';

const CARD_CLASSES = 'w-[20rem] rounded-2xl bg-white p-6 shadow-2xl';

const meta = {
  title: 'UI/Popup',
  component: Popup,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

// 아래 스토리들은 render에서 자체 open 상태를 관리하며 args를 쓰지 않는다.
// open/onOpenChange/children이 필수 prop이라 타입 요구사항 충족용 더미값.
const DUMMY_ARGS = { open: false, onOpenChange: () => {}, children: null };

// 헤드리스 셸이라 카드 배경/여백은 children이 책임진다.
export const Default: Story = {
  args: DUMMY_ARGS,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          팝업 열기
        </button>
        <Popup
          open={open}
          onOpenChange={setOpen}
          title="뉴스레터 구독 안내"
          className={CARD_CLASSES}
        >
          <h2 className="text-small18 text-neutral-0 font-semibold">
            뉴스레터를 구독하시겠어요?
          </h2>
          <p className="text-xsmall14 text-neutral-30 mt-2">
            매주 커리어 인사이트를 이메일로 받아보세요.
          </p>
          <button
            className={`${TRIGGER_CLASSES} mt-4 w-full`}
            onClick={() => setOpen(false)}
          >
            구독하기
          </button>
        </Popup>
      </>
    );
  },
};

// 닫기 X 버튼을 숨긴 변형 (오버레이 클릭·ESC로만 닫힘)
export const WithoutCloseButton: Story = {
  args: DUMMY_ARGS,
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          X 없는 팝업 열기
        </button>
        <Popup
          open={open}
          onOpenChange={setOpen}
          title="이벤트 안내"
          className={CARD_CLASSES}
          showCloseButton={false}
        >
          <h2 className="text-small18 text-neutral-0 font-semibold">
            오버레이나 ESC로 닫아보세요
          </h2>
          <p className="text-xsmall14 text-neutral-30 mt-2">
            닫기 버튼이 없는 팝업 변형입니다.
          </p>
        </Popup>
      </>
    );
  },
};
