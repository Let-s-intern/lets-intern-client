import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import Card from '../../../components/common/report/Card';
import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import BottomSheet from '../../../components/common/ui/BottomSheeet';
import Input from '../../../components/common/ui/input/Input';
import useReportProgramInfo from '../../../hooks/useReportProgramInfo';
import useReportApplicationStore from '../../../store/useReportApplicationStore';
import { ReportPaymentSection } from './ReportApplyPage';

const ReportPaymentPage = () => {
  const navigate = useNavigate();

  const { setReportApplication } = useReportApplicationStore();

  const onClickPayButton = () => {
    //  payInfo 결제정보: application 정보로부터 가져오기
    // 프로그램 신청 정보 가져오기
    // setProgramApplicationForm({});

    navigate(`/payment`);
  };

  return (
    <div className="px-5 md:px-32">
      <Heading1>결제하기</Heading1>
      <main className="mb-8 flex flex-col gap-10">
        <ProgramInfoSection />
        <UsereInfoSection />
        <ReportPaymentSection />
      </main>
      <BottomSheet>
        <button
          onClick={() => {
            setReportApplication({ applyUrl: null, recruitmentUrl: null }); // 이력서, 채용공고 초기화
            navigate(-1);
          }}
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
