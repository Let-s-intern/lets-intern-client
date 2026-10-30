import { render, screen } from '@testing-library/react';
import BenefitDetailSection from './BenefitDetailSection';
import { BENEFIT_TABS } from './benefitDetail';

// VOD 탭만 보이게 하고 카드 fetch 는 막는다
jest.mock('./useBenefitTabs', () => ({
  useBenefitTabs: () => ({
    visibleTabs: BENEFIT_TABS.filter((t) => t.key === 'vod'),
    tabData: { vod: { cards: [], loading: false } },
    countFor: () => 20,
  }),
}));

jest.mock('@/common/lexical/LexicalContent', () => ({
  __esModule: true,
  default: () => null,
}));

const VOD_OPTION_NOTE =
  '*VOD 옵션을 추가하면 이용권 기간 동안 시청할 수 있어요';

const renderSection = (vodOptionOnSale: boolean) =>
  render(
    <BenefitDetailSection
      passTitle="올인원패스"
      plans={[]}
      vods={[{ title: '면접 VOD', thumbnail: '/t.png', description: '설명' }]}
      vodCount={20}
      playbookLexical=""
      benefitLexical=""
      vodOptionOnSale={vodOptionOnSale}
    />,
  );

describe('BenefitDetailSection VOD 탭 안내', () => {
  it('VOD 옵션 판매가 켜져 있으면 옵션 추가 안내를 보여준다', () => {
    renderSection(true);
    expect(screen.getByText(VOD_OPTION_NOTE)).toBeInTheDocument();
    expect(screen.queryByText(/패스에 포함된 VOD/)).toBeNull();
  });

  it('판매가 꺼져 있으면 안내를 숨기고 카드는 그대로 보여준다', () => {
    renderSection(false);
    expect(screen.queryByText(VOD_OPTION_NOTE)).toBeNull();
    expect(screen.getByText('면접 VOD')).toBeInTheDocument();
  });
});
