import { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

import {
  convertReportPriceType,
  useGetReportDetail,
} from '../../../api/report';
import { UserInfo } from '../../../components/common/program/program-detail/section/ApplySection';
import Card from '../../../components/common/report/Card';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import BottomSheet from '../../../components/common/ui/BottomSheeet';
import Input from '../../../components/common/ui/input/Input';
import useReportApplicationStore from '../../../store/useReportApplicationStore';
import { ICouponForm } from '../../../types/interface';

const programName = '포트폴리오 조지기';

const ReportPaymentPage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    email: '',
    phoneNumber: '',
    contactEmail: '',
    question: '',
  });
  const [coupon, setCoupon] = useState<ICouponForm>({
    id: null,
    price: 0,
  });

  const {
    data: reportApplication,
    setReportApplication,
    validate,
  } = useReportApplicationStore();

  const onClickPayButton = () => {
    //  payInfo 결제정보: application 정보로부터 가져오기
    // 프로그램 신청 정보 가져오기
    // setProgramApplicationForm({});

    navigate(`/payment`);
  };

  /** application으로부터 user 정보 초기화 */
  useEffect(() => {
    console.log('get user info');
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
  const { reportId } = useParams();

  const [options, setOptions] = useState<string[]>([]);

  const { data: reportDetailData } = useGetReportDetail(Number(reportId));
  const { data: reportApplication } = useReportApplicationStore();

  const product = reportApplication.isFeedbackApplied
    ? `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)}), 맞춤 첨삭`
    : `서류 진단서 (${convertReportPriceType(reportApplication.reportPriceType)})`;
  const option =
    reportApplication.optionIds.length === 0 ? '없음' : options.join(', ');

  return (
    <section>
      <Heading2>프로그램 정보</Heading2>
      <Card
        imgSrc="/images/report-thumbnail.png"
        imgAlt="서류 진단서 프로그램 썸네일"
        title={reportDetailData?.title || ''}
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
  return (
    <section>
      <Heading2>결제 정보</Heading2>
      <div className="mt-6 flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 번호를 입력해주세요."
        />
        <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-xsmall14 font-medium text-neutral-100">
          쿠폰 등록
        </button>
      </div>
      <hr className="my-5" />
      <div className="flex flex-col">
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>서류 진단서 (베이직 + 옵션)</span>
          <span>30,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>맞춤첨삭</span>
          <span>15,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-neutral-0">
          <span>20% 할인</span>
          <span>-9,000원</span>
        </div>
        <div className="flex h-10 items-center justify-between px-3 text-primary">
          <span>쿠폰할인</span>
          <span className="font-bold">-10,000원</span>
        </div>
        <hr className="my-5" />
        <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
          <span>결제금액</span>
          <span>26,000원</span>
        </div>
      </div>
    </section>
  );
};
