import { render, screen } from '@testing-library/react';
import UsageTabs from './UsageTabs';

// 탭 바는 라벨만 그린다. 탭 내용은 이 테스트의 관심 밖이다
jest.mock('@letscareer/ui', () => ({
  CategoryChips: ({ options }: { options: { label: string }[] }) => (
    <ul>
      {options.map((o) => (
        <li key={o.label}>{o.label}</li>
      ))}
    </ul>
  ),
  CategoryTabs: () => null,
}));
jest.mock('./UsageChallengeTab', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./UsageGuidebookTab', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./UsageLiveTab', () => ({ __esModule: true, default: () => null }));
jest.mock('./UsageMentoringTab', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('./UsageVodTab', () => ({ __esModule: true, default: () => null }));

const renderTabs = (
  privileges: { programType: string }[],
  vodOptionOnSale: boolean,
) =>
  render(
    <UsageTabs privileges={privileges} vodOptionOnSale={vodOptionOnSale} />,
  );

describe('UsageTabs VOD 탭 노출', () => {
  it('판매가 켜진 패스면 플랜 권한에 VOD 가 없어도 VOD 탭을 보여준다', () => {
    renderTabs([{ programType: 'CHALLENGE' }], true);
    expect(screen.getByText('VOD')).toBeInTheDocument();
  });

  it('판매가 꺼진 패스면 플랜 권한에 VOD 가 있어도 VOD 탭이 없다', () => {
    renderTabs([{ programType: 'CHALLENGE' }, { programType: 'VOD' }], false);
    expect(screen.queryByText('VOD')).toBeNull();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
  });
});
