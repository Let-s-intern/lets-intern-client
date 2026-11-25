import GuidebookPurchaseView from '@/domain/guidebook-purchase/ui/GuidebookPurchaseView';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const GuidebookPurchasePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const guidebookId = Number((await params).id);
  if (!Number.isInteger(guidebookId) || guidebookId <= 0) notFound();

  return (
    <Suspense>
      <GuidebookPurchaseView guidebookId={guidebookId} />
    </Suspense>
  );
};

export default GuidebookPurchasePage;
