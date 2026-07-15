import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDialog } from './ConfirmDialog';
import { EditConfirmDialog } from './EditConfirmDialog';
import { DangerConfirmDialog } from './DangerConfirmDialog';

const TRIGGER_CLASSES =
  'inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-xsmall14 font-medium text-white transition-colors hover:bg-primary-hover';

const meta = {
  title: 'UI/AlertDialog',
  component: ConfirmDialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// Layer 1 — generic ConfirmDialog (default variant)
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          다이얼로그 열기
        </button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="변경 사항을 저장할까요?"
          description="지금까지 입력한 내용이 저장됩니다."
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

// Layer 1 — destructive variant (빨간 톤 액션 버튼)
export const Destructive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          삭제 다이얼로그 열기
        </button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          variant="destructive"
          title="정말 삭제할까요?"
          description="이 작업은 되돌릴 수 없습니다."
          confirmLabel="삭제"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

// onConfirm이 Promise를 반환하면 pending 동안 버튼이 비활성화되고 await 후 닫힘
export const AsyncConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const handleConfirm = () =>
      new Promise<void>((resolve) => setTimeout(resolve, 1200));
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          비동기 확인 열기
        </button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="서버에 저장 중"
          description="확인을 누르면 1.2초간 저장 후 자동으로 닫힙니다."
          onConfirm={handleConfirm}
        />
      </>
    );
  },
};

// Layer 2a — 수정/편집 preset (variant='default' 고정, confirmLabel 기본 '수정')
export const Edit: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          수정 확인 열기
        </button>
        <EditConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="기본 정보를 수정하시겠어요?"
          description="변경한 프로필 정보가 저장됩니다."
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

// Layer 2b — 위험 작업 preset (variant='destructive' 고정)
export const Danger: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          로그아웃 확인 열기
        </button>
        <DangerConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="로그아웃 하시겠어요?"
          confirmLabel="로그아웃"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

// Layer 2b — type-to-confirm (지정 문구를 정확히 입력해야 확인 버튼 활성화)
export const DangerTypeToConfirm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button className={TRIGGER_CLASSES} onClick={() => setOpen(true)}>
          회원 탈퇴 확인 열기
        </button>
        <DangerConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="회원 탈퇴 하시겠어요?"
          description="탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다."
          confirmLabel="탈퇴"
          requireTypedConfirmation="회원탈퇴"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};
