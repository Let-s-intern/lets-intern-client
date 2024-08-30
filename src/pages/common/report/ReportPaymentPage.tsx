import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import {
  convertReportPriceType,
  useGetReportPriceDetail,
} from '../../../api/report';
import Card from '../../../components/common/report/Card';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import BottomSheet from '../../../components/common/ui/BottomSheeet';
import Input from '../../../components/common/ui/input/Input';
import useReportApplicationStore from '../../../store/useReportApplicationStore';
import useReportProgramInfo from './useProgramInfo';

const ReportPaymentPage = () => {
  const navigate = useNavigate();

  const onClickPayButton = () => {
    //  payInfo 결제정보: application 정보로부터 가져오기
    // 프로그램 신청 정보 가져오기
    // setProgramApplicationForm({});

    navigate(`/payment`);
  };

  /* application으로부터 user 정보 초기화 */
  useEffect(() => {
    // console.log('get user info');
  }, []);

  return (
    <div className="px-5 md:px-32">
      <Heading1>결제하기</Heading1>
      <main className="mb-8 flex flex-col gap-10">
        <ProgramInfoSection />
        <UsereInfoSection />
        <PaymentSection />
      </main>
      <BottomSheet>
        <button
          onClick={() => navigate(-1)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border-2 border-primary bg-neutral-100"
        >
          <FaArrowLeft size={20} />
        </button>
        <button
          onClick={onClickPayButton}
          className="text-1.125-medium w-full rounded-md bg-primary py-3 text-center font-medium text-neutral-100"
        >
          결제하기
        </button>
      </BottomSheet>
    </div>
  );
};

export default ReportPaymentPage;

const ProgramInfoSection = () => {
  const { title, product, option } = useReportProgramInfo();

  return (
    <section>
      <Heading2>프로그램 정보</Heading2>
      <Card
        imgSrc="/images/report-thumbnail.png"
        imgAlt="서류 진단서 프로그램 썸네일"
        title={title!}
        content={[
          {
            label: '상품',
            text: product,
          },
          {
            label: '옵션',
            text: option,
          },
        ]}
      />
    </section>
  );
};

const UsereInfoSection = () => {
  return (
    <section>
      {/* TODO: 서류 진단 application 정보 불러오기 */}
      <Heading2>참여자 정보</Heading2>
      <div className="mb-4 mt-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Label>이름</Label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <Label>휴대폰 번호</Label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="ml-3 text-xsmall14 font-semibold">
            가입한 이메일
          </label>
          <Input disabled readOnly className="text-sm" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="contactEmail">렛츠커리어 정보 수신용 이메일</Label>
          <p className="text-[0.5625rem] font-light text-neutral-0 text-opacity-[52%]">
            * 결제정보 및 프로그램 신청 관련 알림 수신을 위해,
            <br />
            &nbsp;&nbsp; 자주 사용하는 이메일 주소를 입력해주세요!
          </p>
          <label className="flex cursor-pointer items-center gap-1 text-xxsmall12 font-medium">
            <img className="h-auto w-5" src="/icons/checkbox-fill.svg" />
            가입한 이메일과 동일
          </label>
          <Input name="contactEmail" placeholder="example@example.com" />
        </div>
      </div>
    </section>
  );
};

const PaymentSection = () => {
  const { reportId } = useParams();

  const [priceInfo, setPriceInfo] = useState({
    report: 0,
    feedback: 0,
    discount: 0,
    coupon: 0,
    total: 0,
  });

  const { data: reportApplication } = useReportApplicationStore();
  const { data: reportPriceDetail } = useGetReportPriceDetail(Number(reportId));

  // 결제 가격 계산
  useEffect(() => {
    const reportPriceInfo = reportPriceDetail?.reportPriceInfos?.find(
      (info) => info.reportPriceType === reportApplication.reportPriceType,
    );
    const feedbackPriceInfo = reportPriceDetail?.feedbackPriceInfo;

    const report = reportPriceInfo?.price as number;
    const feedback = feedbackPriceInfo?.feedbackPrice as number;
    let discount = 0;
    let total = 0;

    discount += reportPriceInfo?.discountPrice as number;
    reportApplication.optionIds.forEach((optionId) => {
      discount += reportPriceDetail?.reportOptionInfos?.find(
        (info) => info.reportOptionId === optionId,
      )?.discountPrice as number;
    });

    if (reportApplication.isFeedbackApplied)
      discount += feedbackPriceInfo?.feedbackDiscountPrice as number;

    total = report + feedback - discount;

    setPriceInfo({
      report,
      feedback,
      discount,
      coupon: 0,
      total,
    });
  }, [reportPriceDetail]);

  return (
    <section>
      <Heading2>결제 정보</Heading2>
      {/* <div className="mt-6 flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 번호를 입력해주세요."
        />
        <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-xsmall14 font-medium text-neutral-100">
          쿠폰 등록
        </button>
      </div> */}
      <hr className="my-5" />
      <div className="flex flex-col">
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>
            서류 진단서 (
            {reportApplication.optionIds.length === 0
              ? convertReportPriceType(reportApplication.reportPriceType)
              : `${convertReportPriceType(reportApplication.reportPriceType)} + 옵션`}
            )
          </span>
          {/* 서류 진단 + 사용자가 선택한 모든 옵션 가격을 더한 값 */}
          <span>{priceInfo.report.toLocaleString()}원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>1:1 피드백</span>
          {/* 1:1 피드백 가격 */}
          <span>{priceInfo.feedback.toLocaleString()}원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          {/* 서류진단 + 사용자가 선택한 모든 옵션 + 1:1 피드백의 할인 가격을 모두 더한 값 */}
          <span>
            {Math.ceil(
              (priceInfo.discount / (priceInfo.report + priceInfo.feedback)) *
                100,
            )}
            % 할인
          </span>
          <span>-{priceInfo.discount.toLocaleString()}원</span>
        </div>
        {/* <div className="flex h-10 items-center justify-between px-3 text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">
            -{priceInfo.coupon.toLocaleString()}원
          </span>
        </div> */}
        <hr className="my-5" />
        <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
          <span>결제금액</span>
          <span>{priceInfo.total.toLocaleString()}원</span>
        </div>
      </div>
    </section>
  );
};
