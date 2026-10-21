import { useAdminMentorReviewListQuery } from '@/api/mentor/mentor';
import MentorReviewExposureRow from './MentorReviewExposureRow';

const COLUMNS = [
  '종류',
  '프로그램',
  '점수',
  '후기 내용',
  '작성일',
  '노출',
  '관리',
];

interface Props {
  mentorId: number;
}

export default function MentorReviewExposureSection({ mentorId }: Props) {
  const { data: reviews = [], isLoading } =
    useAdminMentorReviewListQuery(mentorId);

  const exposedCount = reviews.filter((review) => review.isExposed).length;

  return (
    <div className="border-neutral-80 rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-medium18 font-semibold">멘토 페이지 후기</h2>
        <span className="text-xsmall14 text-neutral-40">
          노출 {exposedCount} / 전체 {reviews.length}
        </span>
      </div>

      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-4 text-center">
          불러오는 중...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-xsmall14 text-neutral-40 py-4 text-center">
          이 멘토의 공개 후기가 없습니다
        </div>
      ) : (
        // 좁은 화면에서는 페이지가 아니라 이 영역만 가로로 스크롤한다
        <div className="max-h-[40rem] overflow-auto">
          <table className="text-xsmall14 w-full min-w-[60rem]">
            <thead>
              <tr className="text-neutral-30 text-left">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-3 py-2 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <MentorReviewExposureRow
                  key={`${review.source}-${review.sourceId}`}
                  mentorId={mentorId}
                  review={review}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
