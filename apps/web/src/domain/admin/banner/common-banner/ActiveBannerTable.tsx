import { CommonBannerAdminListItemType, CommonBannerType } from '@/api/banner';
import dayjs from '@/lib/dayjs';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

// 배너 위치 타입별 한글 이름 매핑
const BANNER_TYPE_LABELS: Record<CommonBannerType, string> = {
  HOME_TOP: '홈 상단',
  HOME_BOTTOM: '홈 하단',
  PROGRAM: '프로그램',
  MY_PAGE: '마이페이지',
};

const BANNER_TYPE_ORDER: CommonBannerType[] = [
  'HOME_TOP',
  'HOME_BOTTOM',
  'PROGRAM',
  'MY_PAGE',
];

interface ActiveBannerTableProps {
  groupedData: Record<CommonBannerType, CommonBannerAdminListItemType[]>;
  onDeleteClick: (bannerId: number) => void;
}

const ActiveBannerTable = ({
  groupedData,
  onDeleteClick,
}: ActiveBannerTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-200 bg-gray-50">
          <th className="w-[150px] px-4 py-3 text-left font-medium">
            배너 위치
          </th>
          <th className="px-4 py-3 text-left font-medium text-gray-600">
            제목
          </th>
          <th className="w-[300px] px-4 py-3 text-left font-medium text-gray-600">
            랜딩 URL
          </th>
          <th className="w-[160px] px-4 py-3 text-left font-medium text-gray-600">
            노출 시작일
          </th>
          <th className="w-[160px] px-4 py-3 text-left font-medium text-gray-600">
            노출 종료일
          </th>
          <th className="w-[80px] px-4 py-3 text-center font-medium text-gray-600">
            관리
          </th>
        </tr>
      </thead>
      <tbody>
        {BANNER_TYPE_ORDER.map((type) => {
          const banners = groupedData[type] ?? [];
          const label = BANNER_TYPE_LABELS[type];

          if (banners.length === 0) {
            // 배너 없는 위치: 빈 행으로 표시
            return (
              <tr key={type} className="border-b border-gray-100">
                <td className="bg-gray-50 px-4 py-4 align-middle font-bold text-gray-800">
                  {label}
                </td>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                  -
                </td>
              </tr>
            );
          }

          return banners.map((banner, index) => (
            <tr
              key={`${type}-${banner.commonBannerId}-${index}`}
              className="border-b border-gray-100"
            >
              {/* 첫 번째 행에만 위치명 표시 */}
              {index === 0 && (
                <td
                  className="bg-gray-50 px-4 py-4 align-top font-bold text-gray-800"
                  rowSpan={banners.length}
                >
                  {label}
                </td>
              )}
              <td className="px-4 py-4 text-gray-700">{banner.title || '-'}</td>
              <td className="max-w-[300px] truncate px-4 py-4 text-gray-500">
                {banner.landingUrl || '-'}
              </td>
              <td className="whitespace-pre-line px-4 py-4 text-gray-700">
                {dayjs(banner.startDate).format('YYYY-MM-DD\nHH:mm:ss')}
              </td>
              <td className="whitespace-pre-line px-4 py-4 text-gray-700">
                {dayjs(banner.endDate).format('YYYY-MM-DD\nHH:mm:ss')}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href={`/admin/banner/common-banners/${banner.commonBannerId}/edit`}
                  >
                    <Pencil
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    />
                  </Link>
                  <Trash
                    size={16}
                    className="cursor-pointer text-gray-400 hover:text-red-500"
                    onClick={() => onDeleteClick(Number(banner.commonBannerId))}
                  />
                </div>
              </td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
};

export default ActiveBannerTable;
