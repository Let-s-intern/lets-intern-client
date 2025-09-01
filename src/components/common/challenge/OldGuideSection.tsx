import { ChallengeGuide } from '@/schema';
import { Link } from 'react-router-dom';

interface Props {
  guides: ChallengeGuide[];
}

const OldGuideSection = ({ guides }: Props) => {
  return (
    <div className="flex w-[12rem] flex-col">
      <ul className="flex h-full flex-col gap-4">
        {guides.map((guide) => (
          <li className="flex-1" key={guide.id}>
            <Link
              key={guide.id}
              to={guide.link ?? ''}
              className="flex h-full items-center justify-center rounded-xl border border-[#E4E4E7] font-medium duration-150 hover:bg-neutral-90"
              target="_blank"
              rel="noopenner noreferrer"
            >
              {guide.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OldGuideSection;
