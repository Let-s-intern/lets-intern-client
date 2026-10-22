'use client';

import { useGetMyMembershipApplication } from '@/domain/all-in-one-pass/api/dashboard';
import MaterialsView from '@/domain/all-in-one-pass/ui/materials/MaterialsView';
import { useParams } from 'next/navigation';

export default function AllInOnePassMaterialsPage() {
  const params = useParams<{ applicationId: string }>();
  const { data: base } = useGetMyMembershipApplication(
    Number(params.applicationId),
  );

  return (
    <main className="flex flex-col px-5 pb-16 md:gap-10 md:pb-0 md:pl-12 md:pr-0 md:pt-0">
      <header>
        <h1 className="text-medium22 hidden font-semibold md:block">
          {base?.title
            ? `오직 ${base.title}에서만 볼 수 있는 자료집`
            : '패스 ONLY 자료집'}
        </h1>
      </header>
      <MaterialsView applicationId={Number(params.applicationId)} />
    </main>
  );
}
