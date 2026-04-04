'use client';

import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LexicalContent from '@/domain/blog/ui/LexicalContent';
import { useMentorGuideListQuery } from '@/api/challenge-mentor-guide/challengeMentorGuide';

export default function NoticeDetailPage({ noticeId }: { noticeId: string }) {
  const { data, isLoading } = useMentorGuideListQuery();
  const guides = data?.challengeMentorGuideList ?? [];
  const guide = guides.find(
    (g) => g.challengeMentorGuideId === Number(noticeId),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <h1 className="text-medium22 font-semibold text-neutral-0">
          공지사항
        </h1>
        <div className="py-20 text-center text-xsmall16 text-neutral-40">
          불러오는 중...
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col gap-10">
        <h1 className="text-medium22 font-semibold text-neutral-0">
          공지사항
        </h1>
        <div className="py-20 text-center text-xsmall16 text-neutral-40">
          공지를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-medium22 font-semibold text-neutral-0">공지사항</h1>

      <div className="flex flex-col gap-4">
        <Link
          href="/mentor/notice"
          className="flex items-center gap-1 text-xsmall14 text-neutral-40 hover:text-neutral-10"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          뒤로 가기
        </Link>

        <div className="flex flex-col gap-6 rounded-[16px] border border-neutral-80 p-6 md:gap-8 md:p-10">
          <h2 className="text-medium24 font-bold text-neutral-0">
            {guide.title}
          </h2>

          {guide.contents && (() => {
            try {
              const parsed = JSON.parse(guide.contents);
              return (
                <div className="flex w-full flex-col gap-1 break-words text-xsmall16">
                  <LexicalContent node={parsed.root} />
                </div>
              );
            } catch {
              // JSON이 아니면 마크다운으로 렌더링
              return (
                <div className="prose prose-neutral max-w-none leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>{guide.contents}</Markdown>
                </div>
              );
            }
          })()}

          {guide.link && (
            <a
              href={guide.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xsmall16 text-primary hover:underline"
            >
              링크 바로가기
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
