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

let mockPasses: { status: string; startsAt: string; endsAt: string }[] = [];
jest.mock('@/api/vodPass', () => ({
  useVodPassListQuery: () => ({ data: { passes: mockPasses } }),
}));

const passWith = (status: string) => ({
  status,
  startsAt: '2026-10-01T10:00:00+09:00',
  endsAt: '2026-11-01T10:00:00+09:00',
});

describe('UsageTabs VOD 탭 노출', () => {
  it.each(['ACTIVE', 'SCHEDULED'])(
    '이용권이 %s 면 플랜 권한에 VOD 가 없어도 VOD 탭을 보여준다',
    (status) => {
      mockPasses = [passWith(status)];
      render(<UsageTabs privileges={[{ programType: 'CHALLENGE' }]} />);
      expect(screen.getByText('VOD')).toBeInTheDocument();
    },
  );

  it('이용권이 없으면 플랜 권한에 VOD 가 있어도 VOD 탭이 없다', () => {
    mockPasses = [];
    render(
      <UsageTabs
        privileges={[{ programType: 'CHALLENGE' }, { programType: 'VOD' }]}
      />,
    );
    expect(screen.queryByText('VOD')).toBeNull();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
  });

  it.each(['EXPIRED', 'CANCELED'])(
    '이용권이 %s 뿐이면 VOD 탭이 없다',
    (status) => {
      mockPasses = [passWith(status)];
      render(<UsageTabs privileges={[{ programType: 'CHALLENGE' }]} />);
      expect(screen.queryByText('VOD')).toBeNull();
    },
  );
});
