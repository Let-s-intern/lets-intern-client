'use client';

type Props = { onClick?: () => void; href?: string };

export default function FinalCTA({ onClick, href }: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm md:p-12">
      <h3 className="text-1.5-semibold">
        여러분의 기관에 맞춘 취업 교육, 지금 바로 제안 받아보세요.
      </h3>
      <p className="text-1.125 mt-2 text-neutral-40">
        간단한 정보를 남겨주시면 담당자가 빠르게 연락드릴게요.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <a
          href="#"
          className="text-1-medium rounded-lg border border-neutral-200 bg-white px-4 py-2.5 hover:bg-neutral-50"
        >
          기업소개서 받기
        </a>
        {href ? (
          <a
            href={href}
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-2.5 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            맞춤 교육 문의
          </a>
        ) : (
          <button
            onClick={onClick}
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-2.5 text-xsmall16 font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            맞춤 교육 문의
          </button>
        )}
      </div>
    </div>
  );
}
