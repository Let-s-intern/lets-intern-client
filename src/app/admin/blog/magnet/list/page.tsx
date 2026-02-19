import MagnetListPage from '@/domain/admin/blog/magnet/MagnetListPage';
import { fetchMagnetList } from '@/domain/admin/blog/magnet/mock';

// TODO: API 준비 후 실제 API fetch로 교체. ISR은 revalidate 옵션 추가
// export const revalidate = 60; // ISR: 60초마다 재생성
export default async function MagnetListRoute() {
  const initialData = await fetchMagnetList({});

  return <MagnetListPage initialData={initialData} />;
}
