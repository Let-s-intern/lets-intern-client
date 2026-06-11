export default function CardStatus({ status }: { status: string }) {
  return (
    <div
      className={`rounded-xs flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold ${status === 'DONE' ? 'bg-primary-20 text-primary-dark' : status === 'REFUNDED' ? 'bg-point text-primary' : 'bg-neutral-80 text-neutral-40'}`}
    >
      {convertPaymentStatus(status)}
    </div>
  );
}

const convertPaymentStatus = (status: string) => {
  switch (status) {
    case 'REFUNDED':
      return '페이백 완료';
    case 'DONE':
      return '결제완료';
    case 'CANCELED':
      return '결제취소';
    case 'PARTIAL_CANCELED':
      return '결제취소';
    case 'ZERO':
      return '결제취소';
    default:
      return '상태없음';
  }
};
