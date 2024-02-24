import { Link, useParams } from 'react-router-dom';
import { wishJobToText } from '../../../../../utils/convert';

interface Props {
  dashboard: any;
}

const MyDashboard = ({ dashboard }: Props) => {
  const params = useParams();

  return (
    <section>
      <h2 className="mt-4 text-lg font-semibold">나의 기록장</h2>
      <article className="mt-2">
        <Link
          to={`/challenge/${params.programId}/others/${dashboard.applicationId}`}
          className="block rounded-xl border border-[#D9D9D9] bg-white p-8 transition-colors duration-150 hover:bg-[#F8F8F8]"
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
              {wishJobToText[dashboard.wishJob]}
            </span>
          </div>
          <p className="mt-2 text-black">{dashboard.introduction}</p>
        </Link>
      </article>
    </section>
  );
};

export default MyDashboard;
