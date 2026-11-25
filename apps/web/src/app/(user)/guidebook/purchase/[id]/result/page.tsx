import GuidebookPurchaseResult from '@/domain/guidebook-purchase/ui/GuidebookPurchaseResult';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const GuidebookResultPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const guidebookId = Number((await params).id);
  if (!Number.isInteger(guidebookId) || guidebookId <= 0) notFound();

  return (
    <Suspense>
      <GuidebookPurchaseResult guidebookId={guidebookId} />
    </Suspense>
  );
};

export default GuidebookResultPage;
