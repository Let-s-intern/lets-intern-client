import { render, screen } from '@testing-library/react';
import BenefitDetailSection from './BenefitDetailSection';
import { BENEFIT_TABS } from './benefitDetail';

// 보이는 탭을 테스트마다 정하고 카드 fetch 는 막는다
let mockTabKeys = ['vod'];
jest.mock('./useBenefitTabs', () => ({
  useBenefitTabs: () => ({
    visibleTabs: BENEFIT_TABS.filter((t) => mockTabKeys.includes(t.key)),
    tabData: {
      vod: { cards: [], loading: false },
      mentoring: { cards: [], loading: false },
    },
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

const subHeaderText = (text: string) =>
  screen.getByText(
    (_, el) => el?.children.length === 0 && el.textContent === text,
  );

describe('BenefitDetailSection 머리말', () => {
  beforeEach(() => {
    mockTabKeys = ['vod'];
  });

  it('VOD 옵션 판매 중이면 VOD 를 옵션으로 말한다', () => {
    renderSection(true);
    expect(
      subHeaderText(
        '챌린지부터 가이드북, 멘토링까지.\n패스에 포함된 혜택과 VOD 옵션을 한눈에 확인해 보세요.',
      ),
    ).toBeInTheDocument();
  });

  it('판매가 꺼졌어도 플랜 권한으로 VOD 탭이 있으면 기존 머리말이다', () => {
    renderSection(false);
    expect(
      subHeaderText(
        '챌린지부터 가이드북, VOD, 멘토링까지.\n패스에 포함된 혜택을 한눈에 확인해 보세요.',
      ),
    ).toBeInTheDocument();
  });

  it('VOD 탭이 없으면 머리말에서 VOD 를 뺀다', () => {
    mockTabKeys = ['mentoring'];
    renderSection(false);
    expect(
      subHeaderText(
        '챌린지부터 가이드북, 멘토링까지.\n패스에 포함된 혜택을 한눈에 확인해 보세요.',
      ),
    ).toBeInTheDocument();
  });
});
