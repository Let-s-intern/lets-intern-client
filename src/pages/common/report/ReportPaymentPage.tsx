import Heading1 from '../../../components/common/report/Heading1';
import Heading2 from '../../../components/common/report/Heading2';
import Label from '../../../components/common/report/Label';
import Input from '../../../components/common/ui/input/Input';

const programName = '포트폴리오 조지기';

const ReportPaymentPage = () => {
  return (
    <div>
      <Heading1>결제하기</Heading1>
      <div className="mb-8 flex flex-col gap-10">
        <section>
          <Heading2>프로그램 정보</Heading2>
          <div className="flex items-center gap-4">
            <div className="h-20 w-28 rounded-sm bg-neutral-60">
              <img className="h-auto w-full" src="" alt="" />
            </div>
            <div>
              <span className="font-semibold">{programName}</span>
              <div className="mt-3">
                <div className="flex gap-4">
                  <span className="text-xxsmall12 font-medium">상품</span>
                  <span className="text-xxsmall12 font-medium text-primary-dark">
                    서류 진단서 (베이직), 맞춤 첨삭
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-xxsmall12 font-medium">옵션</span>
                  <span className="text-xxsmall12 font-medium text-primary-dark">
                    현직자 피드백
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          {/* TODO: 서류 진단 application 정보 불러오기 */}
          <Heading2>참여자 정보</Heading2>
          <div className="mb-4 flex flex-col gap-3">
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
            <div>
              <Label htmlFor="contactEmail">
                렛츠커리어 정보 수신용 이메일
              </Label>
              <p className="break-keep text-xxsmall12 font-light text-neutral-0 text-opacity-[52%]">
                * 결제정보 및 프로그램 신청 관련 알림 수신을 위해, 자주 사용하는
                이메일 주소를 입력해주세요!
              </p>
              <label
                className="flex cursor-pointer items-center gap-2"
                htmlFor="same_email_checkbox"
              >
                <input type="checkbox" />
                가입한 이메일과 동일
              </label>
              <Input name="contactEmail" placeholder="example@example.com" />
            </div>
          </div>
        </section>
        <section>
          <Heading2>결제 정보</Heading2>
          <div className="flex gap-2.5">
            <Input
              className="w-full"
              type="text"
              placeholder="쿠폰 번호를 입력해주세요."
            />
            <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-xsmall14 font-medium text-neutral-100">
              쿠폰 등록
            </button>
          </div>
          <hr />
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
            <hr />
            <div className="flex h-10 items-center justify-between px-3 font-semibold text-neutral-0">
              <span>결제금액</span>
              <span>26,000원</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportPaymentPage;
