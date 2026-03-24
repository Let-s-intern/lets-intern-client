import { type KakaoRoom } from './const';

type Props = {
  room: KakaoRoom;
};

export default function QnaChatCard({ room }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-sm border border-neutral-80 bg-white p-4 md:gap-3.5 md:p-5">
      {/* Host row */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-85 text-xxsmall12 font-bold text-neutral-30 md:h-10 md:w-10">
          {room.hostLabel}
        </div>
        <div>
          <p className="text-xsmall14 font-bold text-neutral-10">
            {room.name}
          </p>
          <p className="text-xxsmall12 text-neutral-45">{room.subtitle}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {room.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xxs bg-neutral-90 px-2 py-1 text-xxsmall12 text-neutral-20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="flex-1 break-keep text-xxsmall12 leading-[1.65] text-neutral-40 md:text-xsmall14">
        {room.description}
      </p>

      {/* CTA button */}
      <a
        href={room.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-xs bg-neutral-0 py-2.5 text-xsmall14 font-bold text-white transition-colors hover:bg-neutral-10"
      >
        💬 참여하기
      </a>

      {/* Notice */}
      <p className="border-t border-dashed border-neutral-80 pt-2.5 text-center text-xxsmall12 text-neutral-45">
        {room.notice}
      </p>
    </article>
  );
}
