import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';
import {
  convertReportPriceType,
  useGetReportDetailQuery,
} from '../../../api/report';
import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import Card from '../../../components/common/report/Card';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import {
  getPaymentMethodLabel,
  paymentResultSearchParamsSchema,
} from '../../../data/getPaymentSearchParams';
import useReportPayment from '../../../hooks/useReportPayment';
import useReportProgramInfo from '../../../hooks/useReportProgramInfo';
import useReportApplicationStore from '../../../store/useReportApplicationStore';
import { searchParamsToObject } from '../../../utils/network';

const ReportPaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpTo1280 = useMediaQuery('(max-width: 1280px)');

  const [result, setResult] = useState<any>(null);
  const [urlRedirect, setUrlRedirect] = useState<string | null>(null);

  const { data: reportApplication } = useReportApplicationStore();
  const { title, product, option } = useReportProgramInfo();
  const { data: reportDetail } = useGetReportDetailQuery(
    reportApplication.reportId!,
  );
  const payment = useReportPayment();

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = paymentResultSearchParamsSchema.safeParse(obj);

    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error(result.error);
      alert('잘못된 접근입니다.');
      return;
    }
    return result.data;
  }, []);

  const paymentLink = useMemo(() => {
    // 여기서 왜 쿼리 파라미터를 붙이지?
    const base = isUpTo1280
      ? `report/payment/${reportDetail?.reportType?.toLocaleLowerCase()}/${reportApplication.reportId}`
      : `/report/apply/${reportDetail?.reportType?.toLocaleLowerCase()}/${reportApplication.reportId}`;

    // if (!params) return base;
    // return `${base}?${searchParams.toString()}`;
    return base;
  }, [params]);

  const subTitle =
    reportApplication.optionIds.length === 0
      ? convertReportPriceType(reportApplication.reportPriceType)
      : `${convertReportPriceType(reportApplication.reportPriceType)} + 옵션`;
  const isSuccess = typeof result === 'object' && result !== null;

  return (
    <div className="w-full px-5" data-program-text={title}>
      <div className="mx-auto max-w-5xl">
        <Heading1>결제 확인하기</Heading1>
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          <>
            <DescriptionBox type={isSuccess ? 'SUCCESS' : 'FAIL'} />
            <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
              <div className="flex w-full flex-col items-start justify-center gap-6">
                <Heading2>결제 프로그램</Heading2>
                <Card
                  imgSrc="/images/report-thumbnail.png"
                  imgAlt="서류 진단서 프로그램 썸네일"
                  title={title ?? ''}
                  content={[
                    { label: '상품', text: product },
                    { label: '옵션', text: option },
                  ]}
                />
              </div>
              <div className="flex w-full flex-col justify-center gap-6">
                <Heading2>결제 상세</Heading2>
                <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
                  <div className="font-bold">총 결제금액</div>
                  {Number(searchParams.get('amount')).toLocaleString() + '원'}
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                  <PaymentInfoRow
                    title={`서류 진단서 (${subTitle})`}
                    content={payment.report + '원'}
                  />
                  <PaymentInfoRow
                    title="1:1 피드백"
                    content={payment.feedback + '원'}
                  />
                  <PaymentInfoRow
                    title={`할인 (${Math.ceil(
                      (payment.discount / (payment.report + payment.feedback)) *
                        100,
                    )}%)`}
                    content={`-${payment.discount}원`}
                  />
                  <PaymentInfoRow
                    title="쿠폰할인"
                    content={`-${payment.coupon}원`}
                  />
                </div>
                <hr className="border-neutral-85" />
                <div className="flex w-full flex-col items-center justify-center">
                  {payment.total === 0 ? (
                    <PaymentInfoRow
                      title="결제일자"
                      content={dayjs(new Date()).format(
                        'YYYY.MM.DD(ddd) HH:mm',
                      )}
                    />
                  ) : !isSuccess ? (
                    <PaymentInfoRow
                      title="결제수단"
                      content={
                        result?.tossInfo?.method ??
                        (params
                          ? getPaymentMethodLabel(params.paymentMethodKey)
                          : '')
                      }
                    />
                  ) : (
                    <>
                      <PaymentInfoRow
                        title="결제일자"
                        content={dayjs(result?.tossInfo.approvedAt).format(
                          'YYYY.MM.DD(ddd) HH:mm',
                        )}
                      />
                      <PaymentInfoRow
                        title="결제수단"
                        content={
                          result?.tossInfo?.method ??
                          (params
                            ? getPaymentMethodLabel(params.paymentMethodKey)
                            : '')
                        }
                      />

                      <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                        <div className="text-neutral-40">영수증</div>
                        <div className="flex grow items-center justify-end text-neutral-0">
                          <Link
                            to={result?.tossInfo.receipt.url ?? '#'}
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
                    to="/report/management"
                    className="mypage_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
                  >
                    서류 진단서 확인하기
                  </Link>
                )}
                {!isSuccess && (
                  <Link
                    to={paymentLink}
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
