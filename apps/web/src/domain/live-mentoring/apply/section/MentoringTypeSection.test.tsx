import { fireEvent, render, screen } from '@testing-library/react';

import AgreementSection from './AgreementSection';
import MentoringTypeSection from './MentoringTypeSection';

/*
  목록은 서버 detailPage.mentoringTypes.items 를 그대로 쓴다 (PRD 7-3).
  시안 5종을 하드코딩하면 신청 생성 DTO 의 mentoringTypeIds 를 만들 수 없다.
*/
const ITEMS = [
  {
    id: 1,
    typeName: '자기소개서',
    title: '지원 동기를 점검받고 싶다면',
    description: '설명',
    tags: ['직무 적합성'],
  },
  {
    id: 2,
    typeName: '이력서',
    title: '경력 정리를 하고 싶다면',
    description: '설명',
    tags: [],
  },
];

describe('MentoringTypeSection', () => {
  it('처음에는 접혀 있고 헤더를 누르면 펴진다', () => {
    render(
      <MentoringTypeSection
        items={ITEMS}
        selectedIds={[]}
        onToggle={jest.fn()}
      />,
    );

    const header = screen.getByRole('button', { name: /멘토링 유형 선택/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('checkbox')).toBeNull();

    fireEvent.click(header);

    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    fireEvent.click(header);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  it('서버가 준 유형 이름을 그대로 쓴다', () => {
    render(
      <MentoringTypeSection
        items={ITEMS}
        selectedIds={[]}
        onToggle={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /멘토링 유형 선택/ }));

    expect(screen.getByRole('checkbox', { name: '자기소개서' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '이력서' })).toBeInTheDocument();
    // 시안에만 있고 서버에는 없는 유형은 그리지 않는다
    expect(screen.queryByText('커피챗')).not.toBeInTheDocument();
  });

  it('여러 개를 동시에 고를 수 있다', () => {
    const onToggle = jest.fn();
    render(
      <MentoringTypeSection
        items={ITEMS}
        selectedIds={[1]}
        onToggle={onToggle}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /멘토링 유형 선택/ }));

    expect(screen.getByRole('checkbox', { name: '자기소개서' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '이력서' })).not.toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: '이력서' }));
    expect(onToggle).toHaveBeenCalledWith(2);
  });

  it('멘토가 등록한 유형이 없으면 안내 문구를 보여준다', () => {
    render(
      <MentoringTypeSection items={[]} selectedIds={[]} onToggle={jest.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /멘토링 유형 선택/ }));

    expect(
      screen.getByText('멘토가 등록한 멘토링 유형이 없습니다.'),
    ).toBeInTheDocument();
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
