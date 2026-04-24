const ReviewBanner = ({ cnt }: { cnt: number }) => {
  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-primary-light p-5 font-medium text-static-100">
      <div className="grow">
        작성하지 않은 <span className="font-bold">{cnt}건</span>의 후기가
        있어요!
      </div>
      <img src="/icons/arrow-circle.svg" alt="move" className="h-6 w-6" />
    </div>
  );
};

export default ReviewBanner;
