import { fireEvent, render, screen } from '@testing-library/react';
import VersionSelectSection from './VersionSelectSection';

const VERSION_LIST = [
  { challengeVersionId: 1, title: '대학생', sortOrder: 1 },
  { challengeVersionId: 2, title: '이직자', sortOrder: 2 },
];

const renderSection = (
  selectedVersionId: number | null,
  onSelect = jest.fn(),
) =>
  render(
    <VersionSelectSection
      versionList={VERSION_LIST}
      selectedVersionId={selectedVersionId}
      onSelect={onSelect}
    />,
  );

describe('VersionSelectSection', () => {
  it('제목과 버전 선택지를 받은 순서대로 그린다', () => {
    renderSection(null);

    expect(screen.getByText('버전 선택')).toBeInTheDocument();
    expect(
      screen
        .getAllByRole('radio')
        .map((radio) => radio.closest('label')?.textContent),
    ).toEqual(['대학생', '이직자']);
  });

  it('선택지를 누르면 그 버전 id 로 콜백을 부른다', () => {
    const onSelect = jest.fn();
    renderSection(null, onSelect);

    fireEvent.click(screen.getByRole('radio', { name: '이직자' }));

    expect(onSelect).toHaveBeenCalledWith(2);
  });

  it('선택한 버전만 체크되고 선택 스타일이 붙는다', () => {
    renderSection(1);

    const selected = screen.getByRole('radio', { name: '대학생' });
    const unselected = screen.getByRole('radio', { name: '이직자' });

    expect(selected).toBeChecked();
    expect(unselected).not.toBeChecked();
    expect(selected.closest('label')).toHaveClass(
      'border-primary',
      'bg-primary-5',
    );
    expect(unselected.closest('label')).toHaveClass('border-neutral-85');
    expect(unselected.closest('label')).not.toHaveClass('border-primary');
  });

  it('아무것도 고르지 않았으면 체크된 선택지가 없다', () => {
    renderSection(null);

    screen
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).not.toBeChecked());
  });
});
