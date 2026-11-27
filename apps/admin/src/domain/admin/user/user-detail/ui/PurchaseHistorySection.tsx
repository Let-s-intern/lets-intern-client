import type { UserAdminDetail } from '@/schema';
import { useMemo } from 'react';
import { splitPurchaseHistory } from '../utils/purchaseHistory';
import PurchaseHistoryRow from './PurchaseHistoryRow';

interface Props {
  data: UserAdminDetail;
}

/**
 * 구매·참여 이력. 신청 하나당 한 행이고 참여중과 참여했던으로 나눈다.
 * 서버 배포 전 응답에는 상세가 없으므로 그때는 기존 제목 목록을 그대로 보인다.
 */
const PurchaseHistorySection = ({ data }: Props) => {
  const detailList = data.applicationDetailInfo;
  const { current, past } = useMemo(
    () => splitPurchaseHistory(detailList ?? []),
    [detailList],
  );

  if (!detailList || detailList.length === 0) {
    return (
      <div className="flex flex-col gap-y-1">
        {data.applicationInfo.length < 1 ? (
          <div>신청 내역이 없습니다.</div>
        ) : (
          data.applicationInfo.map((applicationInfo, idx) => (
            <div key={data.userInfo.id + applicationInfo.programId + idx}>
              {applicationInfo.programTitle}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-8">
      {[
        { title: '참여중', list: current },
        { title: '참여했던', list: past },
      ].map(({ title, list }) => (
        <section key={title}>
          <h2 className="border-b pb-2 text-lg font-semibold">
            {title} ({list.length})
          </h2>
          {list.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-500">
              {title} 내역이 없습니다.
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-y-3">
              {list.map(({ item, status }, idx) => (
                <PurchaseHistoryRow
                  key={`${item.applicationId ?? 'm'}-${item.membershipApplicationId ?? idx}`}
                  item={item}
                  status={status}
                />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
};

export default PurchaseHistorySection;
