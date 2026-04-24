import { ProgramApplicationFormInfo } from '@/api/application';
import { AccountType, ChallengePricePlan } from '@/schema';
import { generateRandomNumber, generateRandomString } from '@/utils/random';

export const generateOrderId = () => {
  return 'lets' + generateRandomString() + generateRandomNumber();
};

export interface UserInfo {
  name: string;
  email: string;
  phoneNumber: string;
  contactEmail: string;
  question: string;
  initialized?: boolean;
}

export const getPayInfo = (
  application: ProgramApplicationFormInfo,
  pricePlan?: ChallengePricePlan, // 챌린지만
): null | {
  priceId: number;
  price: number;
  discount: number;
  accountNumber: string;
  deadline: string;
  accountType?: AccountType | null;
  challengePriceType: string | undefined;
  livePriceType: string | undefined;
  guideBookPriceType: string | undefined;
  vodPriceType: string | undefined;
  challengePricePlanType?: ChallengePricePlan;
} => {
  const item = application.priceList?.find(
    (item) => item.challengePricePlanType === pricePlan,
  );

  // 챌린지
  if (item) {
    return {
      priceId: item.priceId ? item.priceId : -1,
      price: item.price ? item.price + (item.refund ?? 0) : 0, // 최종 결제 금액에 보증금 금액 포함해야 함
      discount: item.discount ? item.discount : 0,
      accountNumber: item.accountNumber ? item.accountNumber : '',
      deadline: item.deadline ? item.deadline : '',
      accountType: item.accountType ? item.accountType : null,
      challengePriceType: item.challengePriceType,
      livePriceType: undefined,
      guideBookPriceType: undefined,
      vodPriceType: undefined,
      challengePricePlanType: item.challengePricePlanType, // 챌린지만 가격 플랜 있음
    };
  }

  // 라이브
  if (application.price && 'livePriceType' in application.price) {
    const livePrice = application.price as {
      priceId?: number | null;
      price?: number | null;
      discount?: number | null;
      accountNumber?: string | null;
      deadline?: string | null;
      accountType?: AccountType | null;
      livePriceType?: string;
    };
    return {
      priceId: livePrice.priceId ?? -1,
      price: livePrice.price ?? 0,
      discount: livePrice.discount ?? 0,
      accountNumber: livePrice.accountNumber ?? '',
      deadline: livePrice.deadline ?? '',
      accountType: livePrice.accountType,
      challengePriceType: undefined,
      guideBookPriceType: undefined,
      vodPriceType: undefined,
      livePriceType: livePrice.livePriceType,
    };
  }

  // VOD
  if (application.price && 'vodPriceType' in application.price) {
    const vodPrice = application.price as {
      priceId?: number | null;
      price?: number | null;
      discount?: number | null;
      vodPriceType?: string;
    };
    return {
      priceId: vodPrice.priceId ?? -1,
      price: vodPrice.price ?? 0,
      discount: vodPrice.discount ?? 0,
      accountNumber: '',
      deadline: '',
      challengePriceType: undefined,
      livePriceType: undefined,
      guideBookPriceType: undefined,
      vodPriceType: vodPrice.vodPriceType,
    };
  }

  // 가이드북
  if (application.price && 'guideBookPriceType' in application.price) {
    const guidebookPrice = application.price as {
      priceId?: number | null;
      price?: number | null;
      discount?: number | null;
      guideBookPriceType?: string;
    };
    return {
      priceId: guidebookPrice.priceId ?? -1,
      price: guidebookPrice.price ?? 0,
      discount: guidebookPrice.discount ?? 0,
      accountNumber: '',
      deadline: '',
      challengePriceType: undefined,
      livePriceType: undefined,
      guideBookPriceType: guidebookPrice.guideBookPriceType,
      vodPriceType: undefined,
    };
  }
  return null;
};
