import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCancelApplicationMutation } from '../../../api/application';
import { usePaymentDetailQuery } from '../../../api/payment';
import { useUserQuery } from '../../../api/user';
import CreditCancelModal from '../../../components/common/mypage/credit/CreditCancelModal';
import MoreButton from '../../../components/common/mypage/ui/button/MoreButton';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import Input from '../../../components/common/ui/input/Input';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const calPercent = (price: number, discount: number) => {
  return Math.floor((discount / price) * 100);
};

const CreditDetail = () => {
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { paymentId } = useParams<{ paymentId: string }>();

  const {
    data: paymentDetail,
    isLoading: paymentDetailIsLoading,
    isError: paymentDetailIsError,
  } = usePaymentDetailQuery(paymentId);

  const {
    data: userData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useUserQuery();

  const { mutate: tryCancelPayment } = useCancelApplicationMutation({
    successCallback: () => {
      setIsCancelModalOpen(false);
      navigate(-1);
    },
    errorCallback: (error) => {
      alert('결제 취소에 실패했습니다.');
      console.error(error);
    },
  });

  return (
    <section
      className="flex w-full flex-col px-5 md:px-0"
      data-program-text={paymentDetail?.programInfo?.title}
    >
      <div className="flex items-center justify-start gap-x-2">
        <img
          src="/icons/Arrow_Left_MD.svg"
          alt="arrow-left"
          className="h-6 w-6 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        />
        <h1 className="text-lg font-medium text-neutral-0">결제상세</h1>
      </div>
      <div className="flex w-full flex-col gap-y-10 py-8">
        {!paymentDetail ? (
          paymentDetailIsLoading ? (
            <p className="text-neutral-0">결제내역을 불러오는 중입니다.</p>
          ) : paymentDetailIsError ? (
            <p className="text-neutral-0">
              결제내역을 불러오는 중 오류가 발생했습니다.
            </p>
          ) : (
            <p className="text-neutral-0">결제내역이 없습니다.</p>
          )
        ) : (
          <>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              {paymentDetail.tossInfo.status === 'CANCELED' &&
                paymentDetail.tossInfo.cancels && (
                  <div className="flex w-full gap-2 rounded-xxs bg-neutral-90 px-4 py-3">
                    <div className="text-sm font-semibold text-system-error">
                      환불 완료
                    </div>
                    <div className="flex grow items-center justify-end">
                      {convertDateFormat(
                        paymentDetail.tossInfo.cancels[0].canceledAt || '',
                      )}
                    </div>
                  </div>
                )}
              <div className="font-semibold text-neutral-0">프로그램 정보</div>
              <div className="flex w-full items-start justify-center gap-x-4">
                <img
                  className="h-[97px] w-[137px] rounded-sm object-cover"
                  src={paymentDetail.programInfo.thumbnail || ''}
                  alt="thumbnail"
                />
                <div className="flex grow flex-col items-start justify-center gap-y-3">
                  <div className="font-semibold">
                    {paymentDetail.programInfo.title}
                  </div>
                  <div className="flex w-full flex-col gap-y-1">
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="text-neutral-30">진행 기간</div>
                      <div className="text-primary-dark">{`${convertDateFormat(paymentDetail.programInfo.startDate || '')} - ${convertDateFormat(paymentDetail.programInfo.endDate || '')}`}</div>
                    </div>
                    <div className="flex w-full items-center justify-start gap-x-4 text-xs font-medium">
                      <div className="text-neutral-30">진행 방식</div>
                      <div className="text-primary-dark">{`${paymentDetail.programInfo.programType}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">참여자 정보</div>
              {!userData ? (
                userDataIsLoading ? (
                  <p className="text-neutral-0">
                    참여자 정보를 불러오는 중입니다.
                  </p>
                ) : userDataIsError ? (
                  <p className="text-neutral-0">
                    참여자 정보를 불러오는 중 오류가 발생했습니다.
                  </p>
                ) : (
                  <p className="text-neutral-0">참여자 정보가 없습니다.</p>
                )
              ) : (
                <div className="flex w-full flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-1-medium">
                      이름
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="김렛츠"
                      value={userData.name || ''}
                      onChange={() => {}}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="phoneNum" className="text-1-medium">
                      휴대폰 번호
                    </label>
                    <Input
                      id="phoneNum"
                      name="phoneNum"
                      placeholder="010-0000-0000"
                      value={userData.phoneNum || ''}
                      onChange={() => {}}
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-1-medium">
                      이메일
                    </label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="example@example.com"
                      value={userData.email || ''}
                      onChange={() => {}}
                      disabled
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-y-6">
              <div className="font-semibold text-neutral-0">
                {paymentDetail.tossInfo.status === 'CANCELED'
                  ? '환불 정보'
                  : '결제 정보'}
              </div>
              <div className="flex w-full flex-col items-start justify-start gap-y-3">
                <div className="flex w-full items-center justify-start gap-3 border-y-[1.5px] border-neutral-0 px-3 py-5 font-bold text-neutral-0">
                  <div>
                    {paymentDetail.tossInfo.status === 'CANCELED'
                      ? '총 환불 금액'
                      : '총 결제 금액'}
                  </div>
                  <div className="flex grow items-center justify-end">
                    {paymentDetail.tossInfo.status === 'CANCELED' &&
                    paymentDetail.tossInfo.cancels
                      ? paymentDetail.tossInfo.cancels[0].cancelAmount?.toLocaleString()
                      : paymentDetail.tossInfo.totalAmount?.toLocaleString()}
                    원
                  </div>
                </div>
                <div className="flex w-full flex-col">
                  <PaymentInfoRow
                    title="참여비용"
                    content={`${paymentDetail.priceInfo.price?.toLocaleString()}원`}
                  />
                  <PaymentInfoRow
                    title={`할인 (${paymentDetail.priceInfo.price && paymentDetail.priceInfo.discount ? calPercent(paymentDetail.priceInfo.price, paymentDetail.priceInfo.discount) : 0}%)`}
                    content={`-${paymentDetail.priceInfo.discount?.toLocaleString()}원`}
                  />
                  <PaymentInfoRow
                    title={`쿠폰할인`}
                    content={`-${paymentDetail.paymentInfo.couponDiscount ? paymentDetail.paymentInfo.couponDiscount?.toLocaleString() : 0}원`}
                  />
                  {paymentDetail.tossInfo.status === 'PARTIAL_CANCELED' && (
                    <PaymentInfoRow
                      title={`부분 환불 (${paymentDetail.programInfo.programType})`}
                      content={`-${paymentDetail.tossInfo.cancels ? paymentDetail.tossInfo.cancels[0].cancelAmount?.toLocaleString() : 0}원`}
                      subInfo={
                        <div className="text-xs font-medium text-primary-dark">
                          *환불 규정은{' '}
                          <span className="underline underline-offset-2">
                            자주 묻는 질문
                          </span>
                          을 참고해주세요
                        </div>
                      }
                    />
                  )}
                </div>
                <hr className="w-full border-neutral-85" />
                <div className="flex w-full flex-col">
                  <PaymentInfoRow
                    title={
                      paymentDetail.tossInfo.status === 'CANCELED'
                        ? '환불일자'
                        : '결제일자'
                    }
                    content={
                      paymentDetail.tossInfo.status === 'CANCELED' &&
                      paymentDetail.tossInfo.cancels
                        ? convertDateFormat(
                            paymentDetail.tossInfo.cancels[0].canceledAt || '',
                          )
                        : convertDateFormat(
                            paymentDetail.tossInfo.requestedAt || '',
                          )
                    }
                  />
                  <PaymentInfoRow
                    title="결제수단"
                    content={paymentDetail.tossInfo.method || ''}
                  />
                  <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                    <div className="text-neutral-40">영수증</div>
                    <div className="flex grow items-center justify-end text-neutral-0">
                      <button
                        className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-2.5 py-1.5 text-sm font-medium"
                        onClick={() => {
                          paymentDetail.tossInfo.receipt &&
                            window.open(
                              paymentDetail.tossInfo.receipt.url || '',
                              '_blank',
                            );
                        }}
                      >
                        영수증 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {paymentDetail.tossInfo.status === 'DONE' ? (
                <button
                  className="flex w-full items-center justify-center rounded-sm bg-neutral-80 px-5 py-2.5 font-medium text-neutral-40"
                  onClick={() => {
                    setIsCancelModalOpen(true);
                  }}
                >
                  결제 취소하기
                </button>
              ) : (
                <MoreButton
                  className="other_program w-full md:flex"
                  onClick={() => {
                    navigate('/program');
                  }}
                >
                  다른 프로그램 둘러보기
                </MoreButton>
              )}
            </div>
          </>
        )}
      </div>
      {isCancelModalOpen && (
        <CreditCancelModal
          title="결제 취소 전 꼭 확인해주세요!"
          text={`결제취소시 환불규정에 따라 부분 환불 처리 될 수 있습니다.\n자세한 내용은 자주 묻는 질문 내 환불규정을 참고해주세요.`}
          onConfirm={() => {
            tryCancelPayment({
              applicationId: paymentDetail?.programInfo.applicationId || 0,
              programType:
                paymentDetail?.programInfo.programType || 'CHALLENGE',
            });
          }}
          onCancel={() => {
            setIsCancelModalOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default CreditDetail;
