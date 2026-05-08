import { type KakaoRoom } from '../data/kakao';

type Props = {
  room: KakaoRoom;
};

export default function QnaChatCard({ room }: Props) {
  return (
    <article className="border-neutral-80 flex flex-col gap-4 rounded-sm border bg-white p-5 md:gap-5 md:p-6">
      {/* Host row */}
      <div className="flex items-center gap-3">
        <div className="bg-primary-5 text-xsmall14 text-primary-90 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold md:h-11 md:w-11">
          {room.hostLabel}
        </div>
        <div>
          <p className="text-xsmall14 text-static-0 md:text-xsmall16 font-bold">
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
            className="rounded-xxs bg-primary-5 text-xxsmall12 text-primary-90 px-2.5 py-1 font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-xsmall14 text-neutral-40 md:text-xsmall16 flex-1 break-keep leading-[1.7]">
        {room.description}
      </p>

      {/* CTA button */}
      <a
        href={room.link}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xs text-xsmall14 md:text-xsmall16 flex w-full items-center justify-center bg-neutral-900 py-3 font-bold text-white transition-colors hover:bg-neutral-800"
      >
        참여하기
      </a>

      {/* Notice */}
      <p className="border-neutral-80 text-xxsmall12 text-neutral-45 border-t border-dashed pt-3 text-center">
        {room.notice}
      </p>
    </article>
  );
}
