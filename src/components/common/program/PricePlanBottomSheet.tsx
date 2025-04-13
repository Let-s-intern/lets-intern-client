import { useProgramApplicationQuery } from '@/api/application';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { ChallengeIdPrimitive } from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import BaseBottomSheet from '@components/ui/BaseBottomSheet';
import { RadioGroup } from '@mui/material';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { OptionFormRadioControlLabel } from '../ui/ControlLabel';
import OptionDropdown from '../ui/OptionDropdown';
import BaseButton from '../ui/button/BaseButton';

const pricePlans = ['프리미엄', '스탠다드', '베이직'];

function PricePlanBottomSheet({
  challenge,
  challengeId,
  isOpen,
  onClose,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  const onApplyClick = useCallback(() => {
    const payInfo = application ? getPayInfo(application) : null;

    if (!payInfo) {
      window.alert('정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const progressType: 'none' | 'ALL' | 'ONLINE' | 'OFFLINE' = 'none';
    const userInfo: UserInfo = {
      name: application?.name ?? '',
      email: application?.email ?? '',
      phoneNumber: application?.phoneNumber ?? '',
      contactEmail: application?.contactEmail ?? '',
      question: '',
      initialized: true,
    };
    const priceId =
      application?.priceList?.[0]?.priceId ?? application?.price?.priceId ?? -1;
    const orderId = generateOrderId();
    const totalPrice = Math.max(payInfo.price - payInfo.discount, 0);
    const isFree =
      payInfo.challengePriceType === 'FREE' ||
      payInfo.livePriceType === 'FREE' ||
      payInfo.price === 0 ||
      totalPrice === 0;

    setProgramApplicationForm({
      priceId,
      price: payInfo.price,
      discount: payInfo.discount,
      couponId: '',
      couponPrice: 0,
      totalPrice,
      contactEmail: userInfo.contactEmail,
      question: userInfo.question,
      email: userInfo.email,
      phone: userInfo.phoneNumber,
      name: userInfo.name,
      programTitle: challenge.title,
      programType: 'challenge',
      progressType,
      programId: Number(challengeId),
      programOrderId: orderId,
      isFree,
      deposit: challenge.priceInfo[0].refund ?? 0,
    });

    router.push(`/payment-input`);
    // navigate(`/payment-input`);
  }, [application, challenge, challengeId, router, setProgramApplicationForm]);

  return (
    <>
      <BaseBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        className="mx-auto max-w-[1000px]"
      >
        {/* 챌린지 플랜 */}
        <span className="required-star mb-4 mt-3 block text-xsmall14 font-semibold">
          챌린지 플랜 선택 (필수)
        </span>
        <OptionDropdown
          label={`${challenge.title} 플랜`}
          wrapperClassName="w-full"
        >
          <RadioGroup
            aria-labelledby="price-plan-group-label"
            defaultValue="프리미엄"
            // value={radioValue}
          >
            {pricePlans.map((item, index) => (
              <OptionFormRadioControlLabel
                key={item}
                label={item}
                value={item}
                wrapperClassName={clsx('py-3 pl-2 pr-3', {
                  'border-b border-neutral-80': index < pricePlans.length - 1,
                })}
              />
            ))}
          </RadioGroup>
        </OptionDropdown>

        {/* 총 결제 금액 */}
        <span className="mt-6 block text-xsmall14 font-semibold">
          총 결제 금액
        </span>
        <hr className="my-3" />
        <span className="block text-right text-small18 font-bold text-neutral-10">
          40,000원
        </span>

        {/* 버튼 */}
        <section className="mt-6 flex items-center gap-3">
          <BaseButton className="flex-1" variant="outlined" onClick={onClose}>
            이전 단계로
          </BaseButton>
          <BaseButton
            className="next_button_click flex-1"
            onClick={onApplyClick}
          >
            신청하기
          </BaseButton>
        </section>
      </BaseBottomSheet>
    </>
  );
}

export default PricePlanBottomSheet;
