import { GrNext } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { ChallengeGuide } from '../../../../../schema';

interface GuideSection {
  guides: ChallengeGuide[];
}

// 새로운 버전
const ChallengeGuideSection = ({ guides }: GuideSection) => {
  return (
    <section className="relative flex-1 flex-col rounded-xs border border-[#E4E4E7] p-4">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <h2 className="font-semibold text-neutral-10">챌린지 가이드</h2>
          <button>
            {/* 가이드 연결 필요 */}
            <GrNext className="text-sm text-neutral-45" />
          </button>
        </div>
        {guides.length === 0 ? (
          <div className="flex h-[5.75rem] justify-center">
            <span className="mt-2 text-sm">챌린지 가이드가 없습니다.</span>
          </div>
        ) : (
          <ul className="flex flex-1 flex-col gap-1">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                to={guide.link ?? ''}
                className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#333333] hover:underline"
                target="_blank"
                rel="noopenner noreferrer"
              >
                {guide.title}
              </Link>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ChallengeGuideSection;
