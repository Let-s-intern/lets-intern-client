import { ProgramApplicationFormInfo } from '@/api/application';
import { AccountType } from '@/schema';
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

// TODO: 다른 곳으로 옮기기
export const getPayInfo = (
  application: ProgramApplicationFormInfo,
): null | {
  priceId: number;
  price: number;
  discount: number;
  accountNumber: string;
  deadline: string;
  accountType?: AccountType | null;
  challengePriceType: string | undefined;
  livePriceType: string | undefined;
} => {
  const item = application.priceList?.[0];
  if (item) {
    return {
      priceId: item.priceId ? item.priceId : -1,
      price: item.price ? item.price : 0,
      discount: item.discount ? item.discount : 0,
      accountNumber: item.accountNumber ? item.accountNumber : '',
      deadline: item.deadline ? item.deadline : '',
      accountType: item.accountType ? item.accountType : null,
      challengePriceType: item.challengePriceType,
      livePriceType: undefined,
    };
  }

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
