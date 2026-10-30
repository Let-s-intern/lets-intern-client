import type { AllInOnePassPlan } from '../types';
import { getBenefitCards } from './landingContent';

const COUNTS = { challenge: 4, guidebook: 7, vod: 15 };

const planWith = (programTypes: string[]) =>
  ({
    privileges: programTypes.map((programType) => ({ programType })),
  }) as unknown as AllInOnePassPlan;

const vodCard = (plans: AllInOnePassPlan[], vodOptionOnSale: boolean) =>
  getBenefitCards(plans, [], COUNTS, vodOptionOnSale).find(
    (card) => card.name === 'VOD 15종',
  );

describe('getBenefitCards VOD 카드', () => {
  it('판매가 꺼지고 플랜 권한에도 VOD 가 없으면 VOD 카드가 없다', () => {
    expect(vodCard([planWith(['CHALLENGE'])], false)).toBeUndefined();
  });

  it('판매가 켜지면 플랜 권한이 없어도 옵션 설명으로 보인다', () => {
    expect(vodCard([planWith(['CHALLENGE'])], true)?.description).toBe(
      'VOD 옵션을 추가하면 시청할 수 있어요',
    );
  });

  it('판매가 꺼져도 플랜 권한에 VOD 가 있으면 기존 설명으로 보인다', () => {
    expect(vodCard([planWith(['VOD'])], false)?.description).toBe(
      '현직자가 알려주는 직무·취업 노하우',
    );
  });
});
