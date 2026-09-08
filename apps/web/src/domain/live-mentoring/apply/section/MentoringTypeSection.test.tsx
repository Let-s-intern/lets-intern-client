import { fireEvent, render, screen } from '@testing-library/react';

import AgreementSection from './AgreementSection';
import MentoringTypeSection from './MentoringTypeSection';

/*
  선택지는 멘토가 오픈 설정에서 고른 타입(detail.categories)이다.
  상세 페이지의 유형 카드가 아니다 — 카드는 필수가 아니라 비어 있을 수 있고,
  그러면 고를 것이 없어 신청을 끝낼 수 없는 상품이 판매 중 상태로 열렸다.
*/
const CATEGORIES = ['PERSONAL_STATEMENT', 'RESUME'] as const;

describe('MentoringTypeSection', () => {
  it('접히지 않고 처음부터 펼쳐져 있다', () => {
    render(
      <MentoringTypeSection
        categories={[...CATEGORIES]}
        selected={null}
        onSelect={jest.fn()}
      />,
    );

    // 아코디언을 없앴다. 여는 동작 없이 바로 보여야 한다 —
    // 필수 항목인데 접혀 있으면 유형이 있는지조차 알 수 없다.
    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(
      screen.queryByRole('button', { name: /멘토링 유형 선택/ }),
    ).toBeNull();
  });

  it('멘토가 고른 타입만 그리고 나머지는 그리지 않는다', () => {
    render(
      <MentoringTypeSection
        categories={[...CATEGORIES]}
        selected={null}
        onSelect={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('radio', { name: '자기소개서' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '이력서' })).toBeInTheDocument();
    // 멘토가 고르지 않은 타입은 신청 화면에 뜨면 안 된다.
    expect(screen.queryByText('포트폴리오')).not.toBeInTheDocument();
  });

  it('하나만 고를 수 있고 다시 고르면 그 값을 올려 보낸다', () => {
    const onSelect = jest.fn();
    render(
      <MentoringTypeSection
        categories={[...CATEGORIES]}
        selected="PERSONAL_STATEMENT"
        onSelect={onSelect}
      />,
    );

    expect(screen.getByRole('radio', { name: '자기소개서' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '이력서' })).not.toBeChecked();

    fireEvent.click(screen.getByRole('radio', { name: '이력서' }));
    expect(onSelect).toHaveBeenCalledWith('RESUME');
  });
});

describe('AgreementSection', () => {
  it('체크 상태를 그대로 반영하고 변경을 올려 보낸다', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <AgreementSection checked={false} onChange={onChange} />,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(<AgreementSection checked onChange={onChange} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
