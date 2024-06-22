
const EmptyListItemContainer = ({thumbnail, title, desc, link, buttonCaption, buttonColor}:{thumbnail: string; title: string; desc: string; link: string; buttonCaption: string; buttonColor: string}) => {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='w-full md:max-w-[50%] bg-neutral-100 flex items-center justify-center p-2.5 rounded-md gap-x-4 border border-neutral-85'>
        <img src={thumbnail} alt='프로그램 썸네일' className='w-[120px] h-[120px] md:w-[179px] md:h-[150px] rounded-md object-cover'/>
        <div className='grow flex flex-col items-start py-2 justify-between'>
          <div className='w-full flex flex-col items-start justify-center gap-y-[6px]'>
            <div className='w-full flex flex-col gap-y-[2px] items-start justify-center py-1'>
              <div className='font-semibold'>
                {title}
              </div>
              <div className='text-sm font-medium text-neutral-30'>
                {desc}
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-end">
          <button
            className={`text-0.875-medium rounded-sm border border-neutral-0 px-4 py-1.5 ${buttonColor}`}
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