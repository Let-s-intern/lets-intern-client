const EmptyListItemContainer = ({
  thumbnail,
  title,
  desc,
  link,
  buttonCaption,
  buttonColor,
}: {
  thumbnail: string;
  title: string;
  desc: string;
  link: string;
  buttonCaption: string;
  buttonColor: string;
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-full items-center justify-center gap-x-4 rounded-md border border-neutral-85 bg-neutral-100 p-2.5">
        <img
          src={thumbnail}
          alt="프로그램 썸네일"
          className="h-[120px] w-[120px] rounded-md object-cover md:h-[150px] md:w-[179px]"
        />
        <div className="flex grow flex-col items-start justify-between py-2">
          <div className="flex w-full flex-col items-start justify-center gap-y-[6px]">
            <div className="flex w-full flex-col items-start justify-center gap-y-[2px] py-1">
              <div className="font-semibold">{title}</div>
              <div className="text-sm font-medium text-neutral-30">{desc}</div>
            </div>
          </div>
          <div className="flex w-full items-center justify-end">
            <button
              className={`early_button text-0.875-medium rounded-sm border border-neutral-0 px-4 py-1.5 ${buttonColor}`}
              onClick={() => {
                window.open(link, '_blank');
              }}
            >
              {buttonCaption}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyListItemContainer;
