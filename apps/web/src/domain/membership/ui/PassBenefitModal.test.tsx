import { fireEvent, render, screen } from '@testing-library/react';

import PassBenefitModal from './PassBenefitModal';

const PROPS = {
  badge: 'PASS BENEFIT 01',
  eyebrow: '10 CHALLENGES',
  title: '취준 필수 챌린지 참여 10종 - 베이직',
  subLines: ['첫 줄', '둘째 줄'],
};

function renderModal(open: boolean, onClose = jest.fn()) {
  render(
    <PassBenefitModal {...PROPS} onClose={onClose} open={open}>
      <p>본문 슬롯</p>
    </PassBenefitModal>,
  );
  return onClose;
}

describe('PassBenefitModal (개편 시안 6-1~6-4)', () => {
  it('닫혀 있으면 아무것도 그리지 않는다', () => {
    renderModal(false);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('본문 슬롯')).not.toBeInTheDocument();
  });

  it('열리면 배지·아이브로우·제목·부제와 본문을 그린다', () => {
    renderModal(true);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(PROPS.badge)).toBeInTheDocument();
    expect(screen.getByText(PROPS.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(PROPS.title)).toBeInTheDocument();
    for (const line of PROPS.subLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    expect(screen.getByText('본문 슬롯')).toBeInTheDocument();
  });

  it('닫기 버튼으로 닫힌다', () => {
    const onClose = renderModal(true);

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Esc 로 닫힌다', () => {
    const onClose = renderModal(true);

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /*
   * 모달 뒤 랜딩이 같이 스크롤되면 닫고 나서 엉뚱한 위치에 있게 된다. 되돌릴 때는
   * 원래 값으로 돌려야 한다 — 빈 문자열로 덮으면 결제 시트 같은 다른 잠금이 풀린다.
   */
  it('열려 있는 동안 배경 스크롤을 잠그고 닫으면 되돌린다', () => {
    const { unmount } = render(
      <PassBenefitModal {...PROPS} onClose={jest.fn()} open>
        <p>본문 슬롯</p>
      </PassBenefitModal>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
