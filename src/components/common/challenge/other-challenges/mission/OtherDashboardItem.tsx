import { Link } from 'react-router-dom';

interface Props {
  dashboard: any;
}

const OtherDashboardItem = ({ dashboard }: Props) => {
  return (
    <article>
      <Link
        to={`/challenge/others/${dashboard.applicationId}`}
        className="block aspect-square rounded-xl border border-[#D9D9D9] bg-white p-8 transition-colors duration-150 hover:bg-[#F8F8F8]"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{dashboard.name}</h2>
          {dashboard.isMine && (
            <span className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white">
              나
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center">
          <span className="rounded-lg bg-[#D9D9D9] px-2 py-1 text-xs font-medium text-black">
            {dashboard.wishJob}
          </span>
        </div>
        <p className="mt-2 text-black">{dashboard.introduction}</p>
      </Link>
    </article>
  );
};

export default OtherDashboardItem;
