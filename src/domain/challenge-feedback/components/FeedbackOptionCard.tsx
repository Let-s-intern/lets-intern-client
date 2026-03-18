import { memo } from 'react';
import type { FeedbackOption } from '../types';

interface FeedbackOptionCardProps {
  option: FeedbackOption;
}

const FeedbackOptionCard = memo(function FeedbackOptionCard({
  option,
}: FeedbackOptionCardProps) {
  return (
    <div
      className={`rounded-lg border p-5 md:p-6 ${
        option.tier === 'PREMIUM'
          ? 'border-[#7C6BFF]/50 bg-gradient-to-b from-[#7C6BFF]/10 to-transparent shadow-[0_0_24px_rgba(124,107,255,0.2)]'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <h3
        className={`mb-4 text-center text-lg font-bold md:text-xl ${
          option.tier === 'PREMIUM' ? 'text-[#B49AFF]' : 'text-white'
        }`}
      >
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
    </div>
  );
});

export default FeedbackOptionCard;
