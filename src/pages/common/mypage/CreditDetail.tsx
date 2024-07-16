import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { usePaymentDetailQuery } from '../../../api/payment';
import { useUserQuery } from '../../../api/user';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import Input from '../../../components/common/ui/input/Input';

const convertDateFormat = (date: string) => {
  return dayjs(date).format('YYYY.MM.DD');
};

const calPercent = (price: number, discount: number) => {
  return Math.floor((discount / price) * 100);
};

const CreditDetail = () => {
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

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">결제상세</h1>
      </div>
      <div>
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
            <div>
              <div>프로그램 정보</div>
              <div>
                <img
                  src={paymentDetail.programInfo.thumbnail || ''}
                  alt="thumbnail"
                />
                <div>
                  <div>{paymentDetail.programInfo.title}</div>
                  <div>
                    <div>진행 기간</div>
                    <div>{`${convertDateFormat(paymentDetail.programInfo.startDate || '')} - ${convertDateFormat(paymentDetail.programInfo.endDate || '')}`}</div>
                  </div>
                  <div>
                    <div>진행 방식</div>
                    <div>{`${paymentDetail.programInfo.programType}`}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>참여자 정보</div>
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
                <div className="flex flex-col gap-3 pb-4">
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
                      가입한 이메일
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
            <div>
              <div>결제 정보</div>
              <div>
                <div>
                  <div>총 결제금액</div>
                  <div>
                    {paymentDetail.paymentInfo.finalPrice?.toLocaleString()}원
                  </div>
                </div>
                <div>
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
                </div>
              </div>
            </div>
            <hr />
            <div>
              <PaymentInfoRow
                title="결제일자"
                content={dayjs(paymentDetail.tossInfo.approvedAt).format(
                  'YYYY.MM.DD (ddd)',
                )}
              />
              <PaymentInfoRow
                title="결제수단"
                content={paymentDetail.tossInfo.method || ''}
              />
              <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                <div className="text-neutral-40">영수증</div>
                <div className="flex grow items-center justify-end text-neutral-0">
                  <button
                    className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-3 py-2 text-sm font-medium"
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
          </>
        )}
      </div>
    </section>
  );
};

export default CreditDetail;
