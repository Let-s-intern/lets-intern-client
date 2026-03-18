'use client';

import { memo, useState } from 'react';
import type { FeedbackOption } from '../types';

interface FeedbackOptionCardProps {
  option: FeedbackOption;
}

const FeedbackOptionCard = memo(function FeedbackOptionCard({
  option,
}: FeedbackOptionCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-5 md:p-6">
      <h3 className="mb-4 text-center text-lg font-bold text-white md:text-xl">
        {option.tier}
      </h3>

      <table className="w-full text-sm">
        <tbody>
          <tr className="border-t border-white/10">
            <td className="whitespace-nowrap py-3 pr-4 font-medium text-gray-400">
              피드백 횟수
            </td>
            <td className="py-3 text-white">
              <p className="font-semibold">[{option.feedbackCount}]</p>
              {option.feedbackDetails.map((d, i) => (
                <p key={i} className="mt-1 text-gray-300">
                  · {d.round}: {d.description}
                </p>
              ))}
            </td>
          </tr>
          {option.feedbackScope && (
            <tr className="border-t border-white/10">
              <td className="whitespace-nowrap py-3 pr-4 font-medium text-gray-400">
                피드백 개수
              </td>
              <td className="py-3 text-white">{option.feedbackScope}</td>
            </tr>
          )}
          <tr className="border-t border-white/10">
            <td className="whitespace-nowrap py-3 pr-4 font-medium text-gray-400">
              진행 방식
            </td>
            <td className="py-3 text-white">{option.method}</td>
          </tr>
          <tr className="border-t border-white/10">
            <td className="whitespace-nowrap py-3 pr-4 font-medium text-gray-400">
              멘토
            </td>
            <td className="py-3 text-white">
              <p className="font-medium text-[#B49AFF]">
                렛츠커리어 현직자 멘토단
              </p>
              {option.mentorInfo
                .split('·')
                .slice(1)
                .map((m, i) => (
                  <p key={i} className="mt-0.5 text-gray-300">
                    · {m.trim()}
                  </p>
                ))}
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() => setShowDetail(!showDetail)}
        className="mt-4 w-full text-center text-sm font-medium text-[#B49AFF] transition-colors hover:text-[#D4C4FF]"
      >
        피드백 자세히 보기 {showDetail ? '↑' : '→'}
      </button>

      {showDetail && (
        <div className="mt-4 rounded-md bg-white/5 p-4 text-sm text-gray-300">
          <p>서면 피드백 예시 이미지가 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
});

export default FeedbackOptionCard;
