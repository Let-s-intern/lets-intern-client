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
  pricePlan: ChallengePricePlan | undefined, // 챌린지만
): null | {
  priceId: number;
  price: number;
  discount: number;
  accountNumber: string;
  deadline: string;
  accountType?: AccountType | null;
  challengePriceType: string | undefined;
  livePriceType: string | undefined;
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
      challengePricePlanType: item.challengePricePlanType, // 챌린지만 가격 플랜 있음
    };
  }

  // 라이브
  if (application.price) {
    return {
      priceId: application.price.priceId ? application.price.priceId : -1,
      price: application.price.price ? application.price.price : 0,
      discount: application.price.discount ? application.price.discount : 0,
      accountNumber: application.price.accountNumber ?? '',
      deadline: application.price.deadline ?? '',
      accountType: application.price.accountType,
      challengePriceType: undefined,
      livePriceType: application.price.livePriceType,
    };
  }

  return null;
};
