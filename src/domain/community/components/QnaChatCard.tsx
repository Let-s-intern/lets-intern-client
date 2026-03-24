import { type KakaoRoom } from '../data/kakao';

type Props = {
  room: KakaoRoom;
};

export default function QnaChatCard({ room }: Props) {
  return (
    <article className="flex flex-col gap-4 rounded-sm border border-neutral-80 bg-white p-5 md:gap-5 md:p-6">
      {/* Host row */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-5 text-xsmall14 font-bold text-primary-90 md:h-11 md:w-11">
          {room.hostLabel}
        </div>
        <div>
          <p className="text-xsmall14 font-bold text-static-0 md:text-xsmall16">
            {room.name}
          </p>
          <p className="text-xxsmall12 text-neutral-40">{room.subtitle}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {room.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-xxs bg-primary-5 px-2.5 py-1 text-xxsmall12 font-medium text-primary-90"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="flex-1 break-keep text-xsmall14 leading-[1.7] text-neutral-40 md:text-xsmall16">
        {room.description}
      </p>

      {/* CTA button */}
      <a
        href={room.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center rounded-xs bg-neutral-900 py-3 text-xsmall14 font-bold text-white transition-colors hover:bg-neutral-800 md:text-xsmall16"
      >
        참여하기
      </a>

      {/* Notice */}
      <p className="border-t border-dashed border-neutral-80 pt-3 text-center text-xxsmall12 text-neutral-45">
        {room.notice}
      </p>
    </article>
  );
}
