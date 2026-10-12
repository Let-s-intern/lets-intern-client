import AllInOnePassLayout from '@/domain/all-in-one-pass/ui/layout/AllInOnePassLayout';

export default function AllInOnePassRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AllInOnePassLayout>{children}</AllInOnePassLayout>;
}
