import { convertPaymentStatus } from '../../../api/payment/paymentSchema';

const CardStatus = ({ status }: { status: string }) => {
  return (
    <div
      className={`flex items-center justify-center rounded-xs px-2.5 py-0.5 text-xs font-semibold ${status === 'DONE' ? 'bg-primary-20 text-primary-dark' : status === 'REFUNDED' ? 'bg-point text-primary' : 'bg-neutral-80 text-neutral-40'}`}
    >
      {convertPaymentStatus(status)}
    </div>
  );
};

export default CardStatus;
