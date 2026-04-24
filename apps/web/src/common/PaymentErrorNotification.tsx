import { twMerge } from "@/lib/twMerge";

interface IPaymentErrorNotificationProps {
  className?: string;
}

/* 일단 인스타그램 결제 방지 용도로만 사용하는 것 같아서 내용도 그대로 넣겠습니다 */
function PaymentErrorNotification(props: IPaymentErrorNotificationProps) {
  return (
    <div className={twMerge("flex w-full items-start gap-x-2 bg-[#FEFFC8] p-4", props.className)}>
      <img src="/icons/warning.svg" alt="warning" className="h-6 w-6" />
      <div className="flex w-full flex-col text-xsmall14 text-neutral-0">
        <p className="font-bold">
          [결제오류 방지] 외부 브라우저로 접속해주세요
        </p>
        <p>
          상단 더보기 버튼 혹은 하단 공유 버튼을 누르면 외부 브라우저로 이동할
          수 있어요.
        </p>
      </div>
    </div>
  );
}

export default PaymentErrorNotification;
