import VodPassPurchaseResult from '@/domain/vod-pass-purchase/ui/VodPassPurchaseResult';
import { Suspense } from 'react';

export default function VodPassPurchaseResultPage() {
  return (
    <Suspense>
      <VodPassPurchaseResult />
    </Suspense>
  );
}
