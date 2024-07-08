import { ProgramType } from './ProgramDetail';

interface PaymentInfoProps {
  programType: ProgramType;
}

const PaymentInfo = ({ programType }: PaymentInfoProps) => {
  return <div>결제정보페이지입니다.</div>;
};

export default PaymentInfo;
