import type { ReactNode } from 'react';

const VodPassPurchaseCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <main className="bg-neutral-95 flex min-h-screen justify-center px-4 py-6">
    <section className="flex h-fit w-full max-w-[480px] flex-col gap-4 rounded-md bg-white p-5">
      <h1 className="text-medium22 text-neutral-0 font-bold">{title}</h1>
      {children}
    </section>
  </main>
);

export default VodPassPurchaseCard;
