import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './index';
import { ConfirmDialog } from './ConfirmDialog';
import { ConfirmProvider } from './ConfirmProvider';
import { EditConfirmDialog } from './EditConfirmDialog';
import { DangerConfirmDialog } from './DangerConfirmDialog';
import { useConfirm } from './useConfirm';

function BasicAlertDialog({
  open,
  onOpenChange,
  onActionClick,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  onActionClick?: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>제목</AlertDialogTitle>
        <AlertDialogDescription>설명</AlertDialogDescription>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction onClick={onActionClick}>확인</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog primitive', () => {
  it('open=false 일 때 다이얼로그가 DOM에 없다', () => {
    render(<BasicAlertDialog open={false} onOpenChange={() => {}} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('open=true 일 때 role="alertdialog"와 title/description이 표시된다', () => {
    render(<BasicAlertDialog open={true} onOpenChange={() => {}} />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('제목')).toBeInTheDocument();
    expect(screen.getByText('설명')).toBeInTheDocument();
  });

  it('Cancel 클릭 시 onOpenChange(false)가 호출된다', async () => {
    const onOpenChange = vi.fn();
    render(<BasicAlertDialog open={true} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByText('취소'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('Action 클릭 시 onClick 핸들러가 호출된다', async () => {
    const onActionClick = vi.fn();
    render(
      <BasicAlertDialog
        open={true}
        onOpenChange={() => {}}
        onActionClick={onActionClick}
      />,
    );
    await userEvent.click(screen.getByText('확인'));
    expect(onActionClick).toHaveBeenCalled();
  });

  it('ESC 키 입력 시 onOpenChange(false)가 호출된다', () => {
    const onOpenChange = vi.fn();
    render(<BasicAlertDialog open={true} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: 'Escape',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('ConfirmDialog', () => {
  it('title, description, 두 버튼 라벨이 표시된다', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="정말 진행하시겠어요?"
        description="이 작업은 되돌릴 수 없습니다."
        confirmLabel="진행"
        cancelLabel="취소"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('정말 진행하시겠어요?')).toBeInTheDocument();
    expect(screen.getByText('이 작업은 되돌릴 수 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('진행')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('confirm/cancel 라벨 기본값은 한국어다', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="제목"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('확인')).toBeInTheDocument();
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('Confirm 클릭 시 onConfirm이 호출되고 onOpenChange(false)가 호출된다', async () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        title="제목"
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByText('확인'));
    expect(onConfirm).toHaveBeenCalled();
    // Radix Action 클릭 시 자동으로 onOpenChange(false) 호출됨
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('variant="destructive" 일 때 action 버튼에 destructive 마커가 적용된다', () => {
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="삭제"
        variant="destructive"
        onConfirm={() => {}}
      />,
    );
    const action = screen.getByText('확인');
    expect(action).toHaveAttribute('data-variant', 'destructive');
    expect(action.className).toContain('bg-red-500');
  });

  it('async onConfirm 사용 시 await 후 onOpenChange(false)가 호출된다', async () => {
    let resolveConfirm!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((res) => {
          resolveConfirm = res;
        }),
    );
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        title="제목"
        onConfirm={onConfirm}
      />,
    );
    await userEvent.click(screen.getByText('확인'));
    expect(onConfirm).toHaveBeenCalled();
    // promise 미해결 상태에서는 닫히지 않음
    expect(onOpenChange).not.toHaveBeenCalledWith(false);
    resolveConfirm();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});

describe('ConfirmProvider + useConfirm', () => {
  function ConfirmRunner({
    onResult,
    options,
  }: {
    onResult: (result: boolean) => void;
    options?: Parameters<ReturnType<typeof useConfirm>>[0];
  }) {
    const confirm = useConfirm();
    return (
      <button
        type="button"
        onClick={async () => {
          const result = await confirm(
            options ?? { title: '진행하시겠어요?' },
          );
          onResult(result);
        }}
      >
        trigger
      </button>
    );
  }

  it('ConfirmProvider 마운트 후 useConfirm으로 Promise<boolean>를 받는다 (action → true)', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmProvider>
        <ConfirmRunner onResult={onResult} />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByText('trigger'));
    expect(await screen.findByText('진행하시겠어요?')).toBeInTheDocument();
    await userEvent.click(screen.getByText('확인'));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
  });

  it('Cancel 클릭 시 resolve(false)', async () => {
    const onResult = vi.fn();
    render(
      <ConfirmProvider>
        <ConfirmRunner onResult={onResult} />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByText('trigger'));
    await screen.findByText('진행하시겠어요?');
    await userEvent.click(screen.getByText('취소'));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it('동시 호출 시 이전 promise가 resolve(false)로 정리된다', async () => {
    const results: boolean[] = [];

    function DoubleRunner() {
      const confirm = useConfirm();
      return (
        <button
          type="button"
          onClick={async () => {
            // 두 번 거의 동시에 호출
            const first = confirm({ title: '첫번째' });
            const second = confirm({ title: '두번째' });
            const [a, b] = await Promise.all([first, second]);
            results.push(a, b);
          }}
        >
          trigger
        </button>
      );
    }

    render(
      <ConfirmProvider>
        <DoubleRunner />
      </ConfirmProvider>,
    );
    await userEvent.click(screen.getByText('trigger'));
    // 두번째 호출이 첫번째를 false로 정리, 그 뒤 두번째 다이얼로그가 표시됨
    await screen.findByText('두번째');
    await userEvent.click(screen.getByText('확인'));
    await waitFor(() => expect(results).toEqual([false, true]));
  });

  it('Provider 없이 useConfirm 호출 시 에러를 throw한다', () => {
    function Bad() {
      useConfirm();
      return null;
    }
    // React가 에러를 콘솔로 출력하지 않게 살짝 가린다
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/ConfirmProvider/);
    spy.mockRestore();
  });
});

describe('EditConfirmDialog', () => {
  it('variant=default이 강제되어 destructive 마커가 적용되지 않는다', () => {
    render(
      <EditConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="기본 정보를 수정하시겠어요?"
        onConfirm={() => {}}
      />,
    );
    const action = screen.getByText('수정');
    expect(action).toHaveAttribute('data-variant', 'default');
    expect(action.className).not.toContain('bg-red-500');
  });

  it('confirmLabel 기본값은 "수정"이다', () => {
    render(
      <EditConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="제목"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('수정')).toBeInTheDocument();
  });

  it('confirmLabel을 명시하면 그대로 사용된다', () => {
    render(
      <EditConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="제목"
        confirmLabel="변경"
        onConfirm={() => {}}
      />,
    );
    expect(screen.getByText('변경')).toBeInTheDocument();
  });
});

describe('DangerConfirmDialog', () => {
  it('variant=destructive가 강제 적용된다', () => {
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="정말 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={() => {}}
      />,
    );
    const action = screen.getByRole('button', { name: '삭제' });
    expect(action).toHaveAttribute('data-variant', 'destructive');
    expect(action.className).toContain('bg-red-500');
  });

  it('requireTypedConfirmation 없을 때는 일반 destructive confirm처럼 동작한다', async () => {
    const onConfirm = vi.fn();
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="정말 삭제하시겠어요?"
        confirmLabel="삭제"
        onConfirm={onConfirm}
      />,
    );
    // input 미노출
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    // 클릭 시 onConfirm 호출
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('requireTypedConfirmation 있을 때 input 노출 + 일치 안 하면 confirm 비활성', () => {
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="회원 탈퇴 하시겠어요?"
        confirmLabel="탈퇴"
        requireTypedConfirmation="회원탈퇴"
        onConfirm={() => {}}
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    const action = screen.getByRole('button', { name: '탈퇴' });
    expect(action).toBeDisabled();
  });

  it('정확히 일치하면 confirm 활성 → 클릭 시 onConfirm 호출', async () => {
    const onConfirm = vi.fn();
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="회원 탈퇴 하시겠어요?"
        confirmLabel="탈퇴"
        requireTypedConfirmation="회원탈퇴"
        onConfirm={onConfirm}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '회원탈퇴');
    const action = screen.getByRole('button', { name: '탈퇴' });
    expect(action).not.toBeDisabled();
    await userEvent.click(action);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('일치 후 다시 일치 안 하게 입력 변경하면 다시 비활성화', async () => {
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="회원 탈퇴 하시겠어요?"
        confirmLabel="탈퇴"
        requireTypedConfirmation="회원탈퇴"
        onConfirm={() => {}}
      />,
    );
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '회원탈퇴');
    const action = screen.getByRole('button', { name: '탈퇴' });
    expect(action).not.toBeDisabled();
    await userEvent.type(input, 'x');
    expect(action).toBeDisabled();
  });

  it('다이얼로그 재오픈 시 input이 초기화된다', async () => {
    function Harness() {
      const [open, setOpen] = React.useState(true);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            reopen
          </button>
          <DangerConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title="회원 탈퇴 하시겠어요?"
            confirmLabel="탈퇴"
            requireTypedConfirmation="회원탈퇴"
            onConfirm={() => {}}
          />
        </>
      );
    }
    render(<Harness />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, '회원탈퇴');
    expect(input.value).toBe('회원탈퇴');

    // 다이얼로그 닫기
    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    // 재오픈
    await userEvent.click(screen.getByRole('button', { name: 'reopen' }));
    const newInput = (await screen.findByRole('textbox')) as HTMLInputElement;
    expect(newInput.value).toBe('');
  });

  it('input 미입력 상태에서는 confirm 버튼 disabled (onConfirm 미호출)', async () => {
    const onConfirm = vi.fn();
    render(
      <DangerConfirmDialog
        open={true}
        onOpenChange={() => {}}
        title="회원 탈퇴 하시겠어요?"
        confirmLabel="탈퇴"
        requireTypedConfirmation="회원탈퇴"
        onConfirm={onConfirm}
      />,
    );
    const action = screen.getByRole('button', { name: '탈퇴' });
    expect(action).toBeDisabled();
    // disabled 상태에서 클릭해도 onConfirm 미호출
    await userEvent.click(action);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
