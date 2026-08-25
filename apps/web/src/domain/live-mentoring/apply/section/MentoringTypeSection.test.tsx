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
  it('접히지 않고 처음부터 펼쳐져 있다', () => {
    render(
      <MentoringTypeSection
        items={ITEMS}
        selectedIds={[]}
        onToggle={jest.fn()}
      />,
    );

    // 아코디언을 없앴다. 여는 동작 없이 바로 보여야 한다 —
    // 필수 항목인데 접혀 있으면 유형이 있는지조차 알 수 없다.
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(
      screen.queryByRole('button', { name: /멘토링 유형 선택/ }),
    ).toBeNull();
  });

  it('서버가 준 유형 이름을 그대로 쓴다', () => {
    render(
      <MentoringTypeSection
        items={ITEMS}
        selectedIds={[]}
        onToggle={jest.fn()}
      />,
    );

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

    expect(screen.getByRole('checkbox', { name: '자기소개서' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '이력서' })).not.toBeChecked();

    fireEvent.click(screen.getByRole('checkbox', { name: '이력서' }));
    expect(onToggle).toHaveBeenCalledWith(2);
  });

  it('멘토가 등록한 유형이 없으면 안내 문구를 보여준다', () => {
    render(
      <MentoringTypeSection items={[]} selectedIds={[]} onToggle={jest.fn()} />,
    );

    expect(
      screen.getByText('멘토가 멘토링 유형을 아직 등록하지 않았습니다.'),
    ).toBeInTheDocument();
    // 버튼이 왜 잠기는지까지 알려야 한다. 사실만 적으면 막다른 길이 된다.
    expect(
      screen.getByText(/지금은 신청을 완료할 수 없습니다/),
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
