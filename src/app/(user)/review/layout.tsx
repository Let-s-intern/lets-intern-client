import ReviewBanner from '@components/common/review/ReviewBanner';
import ReviewNavBar from '@components/common/review/ReviewNavBar';

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReviewBanner />
      <div className="flex flex-col max-w-[1100px] md:py-8 w-full mx-auto md:flex-row">
        <ReviewNavBar />
        <main className="w-full overflow-x-hidden">{children}</main>
      </div>
    </>
  );
}
