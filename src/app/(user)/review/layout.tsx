import ReviewBanner from '@/domain/review/ReviewBanner';
import ReviewNavBar from '@/domain/review/ReviewNavBar';

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ReviewBanner />
      <div className="mx-auto mb-12 flex w-full max-w-[1140px] flex-col md:mb-20 md:flex-row md:px-5 md:pt-11">
        <ReviewNavBar />
        <main className="w-full">{children}</main>
      </div>
    </>
  );
}
