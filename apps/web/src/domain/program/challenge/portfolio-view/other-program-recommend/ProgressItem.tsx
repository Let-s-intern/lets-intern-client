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
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xsmall14 font-semibold text-white"
        style={{ backgroundColor: bgColor }}
      >
        {item.index}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="whitespace-pre-line text-xsmall16 font-bold text-neutral-0">
          {item.title}
        </span>
        {item.subTitle && (
          <span className="whitespace-pre-line text-xsmall14 text-neutral-45">
            {item.subTitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProgressItem;
