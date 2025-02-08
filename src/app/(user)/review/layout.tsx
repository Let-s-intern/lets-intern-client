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
      <div className="mx-auto flex w-full max-w-[1140px] flex-col md:flex-row md:px-5 md:py-8">
        <ReviewNavBar />
        <main className="w-full pb-12 md:pb-[7rem]">{children}</main>
      </div>
    </>
  );
}
