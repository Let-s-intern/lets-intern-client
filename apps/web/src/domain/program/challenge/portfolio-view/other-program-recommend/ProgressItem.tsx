import { ProgressItemType } from './types';

function ProgressItem({
  item,
  bgColor,
}: {
  item: ProgressItemType;
  bgColor?: string;
}) {
  return (
    <div key={item.index} className="flex gap-2">
      <div
        className="text-xsmall14 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-semibold text-white"
        style={{ backgroundColor: bgColor }}
      >
        {item.index}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xsmall16 text-neutral-0 whitespace-pre-line font-bold">
          {item.title}
        </span>
        {item.subTitle && (
          <span className="text-xsmall14 text-neutral-45 whitespace-pre-line">
            {item.subTitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressItem;
