import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import Card from '../../../components/common/report/Card';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';

const isSuccess = true;
const programName = '포트폴리오 조지기';

const ReportPaymentResult = () => {
  return (
    <div
      className="w-full px-5"
      //   data-program-text={program.query.data?.title}
    >
      <div className="mx-auto max-w-5xl">
        <Heading1>결제 확인하기</Heading1>
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          <>
            <DescriptionBox type={isSuccess ? 'SUCCESS' : 'FAIL'} />
            <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
              <div className="flex w-full flex-col items-start justify-center gap-6">
                <Heading2>결제 프로그램</Heading2>
                <Card
                  imgSrc=""
                  imgAlt=""
                  title={programName}
                  content={[
                    { label: '상품', text: '서류 진단서 (베이직), 맞춤 첨삭' },
                    { label: '옵션', text: '현직자 피드백' },
                  ]}
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-6">
                <Heading2>결제 상세</Heading2>
                <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
                  <div className="font-bold">총 결제금액</div>
                  <div className="font-bold">26,000원</div>
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                  <PaymentInfoRow
                    title="서류 진단서 (베이직 + 옵션)"
                    content="30,000d원"
                  />
                  <PaymentInfoRow title="맞춤첨삭" content="15,000원" />
                  <PaymentInfoRow title="할인" content="-9,000원" />
                  <PaymentInfoRow title="쿠폰할인" content="-10,000원" />
                </div>
                <hr className="border-neutral-85" />
                <div className="flex w-full flex-col items-center justify-center">
                  {!isSuccess ? (
                    <PaymentInfoRow title="결제수단" content="네이버페이" />
                  ) : (
                    <>
                      <PaymentInfoRow
                        title="결제일자"
                        //   토스에서 날짜 생성
                        content={dayjs(new Date()).format(
                          'YYYY.MM.DD(ddd) HH:mm',
                        )}
                      />
                      <PaymentInfoRow title="결제수단" content="네이버페이" />

                      <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                        <div className="text-neutral-40">영수증</div>
                        <div className="flex grow items-center justify-end text-neutral-0">
                          <Link
                            to="#"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-3 py-2 text-sm font-medium"
                          >
                            영수증 보기
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {isSuccess && (
                  <Link
                    to="/mypage/application"
                    className="mypage_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
                  >
                    서류 진단서 확인하기
                  </Link>
                )}
                {!isSuccess && (
                  <Link
                    to="#"
                    className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
                  >
                    다시 결제하기
                  </Link>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default ReportPaymentResult;
