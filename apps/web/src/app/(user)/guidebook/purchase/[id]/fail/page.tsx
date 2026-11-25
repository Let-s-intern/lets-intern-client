import GuidebookPurchaseFail from '@/domain/guidebook-purchase/ui/GuidebookPurchaseFail';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const GuidebookFailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const guidebookId = Number((await params).id);
  if (!Number.isInteger(guidebookId) || guidebookId <= 0) notFound();

  return (
    <Suspense>
      <GuidebookPurchaseFail guidebookId={guidebookId} />
    </Suspense>
  );
};

export default GuidebookFailPage;
