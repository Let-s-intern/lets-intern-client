import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';
import { Toaster } from './Toaster';
import { useToast } from './useToast';

const BUTTON_CLASSES =
  'inline-flex h-10 items-center justify-center rounded-sm px-4 text-xsmall14 font-medium transition-colors';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// useToast는 Toaster 하위에서만 호출 가능하므로 트리거를 내부 컴포넌트로 분리한다.
function ToastTriggers() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`${BUTTON_CLASSES} bg-green-500 text-white hover:bg-green-600`}
        onClick={() => toast.success('정보가 수정되었습니다')}
      >
        success
      </button>
      <button
        className={`${BUTTON_CLASSES} bg-red-500 text-white hover:bg-red-600`}
        onClick={() =>
          toast.error('정보 수정에 실패했습니다', {
            description: '잠시 후 다시 시도해주세요.',
          })
        }
      >
        error
      </button>
      <button
        className={`${BUTTON_CLASSES} bg-neutral-90 text-neutral-0 hover:bg-neutral-80`}
        onClick={() =>
          toast.toast({
            variant: 'default',
            title: '안내',
            description: '기본 톤 토스트입니다.',
          })
        }
      >
        default
      </button>
    </div>
  );
}

// 권장 사용법 — 앱 루트에 Toaster를 마운트하고 useToast로 imperative 발화
export const Imperative: Story = {
  // render가 args를 쓰지 않지만, title이 필수 prop이라 타입 요구사항 충족용 더미값
  args: { title: '' },
  render: () => (
    <Toaster>
      <ToastTriggers />
    </Toaster>
  ),
};
