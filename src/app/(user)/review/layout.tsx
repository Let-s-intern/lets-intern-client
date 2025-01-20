import ReviewNavBar from '@components/common/review/ReviewNavBar';

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <ReviewNavBar />
      {children}
    </div>
  );
}
