import { useParams } from 'react-router-dom';

const CreditDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">결제상세</h1>
    </section>
  );
};

export default CreditDetail;
