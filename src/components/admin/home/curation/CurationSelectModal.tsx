import { useBlogListQuery } from '@/api/blog';
import { CurationType } from '@/api/curation';
import { useGetProgramAdminQuery } from '@/api/program';
import { useGetReportsForAdmin } from '@/api/report';
import { convertCurationTypeToText } from '@/utils/convert';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { getReportThumbnail } from '@components/common/mypage/credit/CreditListItem';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Modal, Paper } from '@mui/material';

type CurationSelectItemType = {
  id: number;
  title: string;
  thumbnail: string;
};

interface CurationSelectModalProps {
  isOpen: boolean;
  type: CurationType | null;
  onSelect: ({ id, title }: { id: number; title: string }) => void;
  onClose: () => void;
}

const CurationSelectModal = ({
  isOpen,
  type,
  onSelect,
  onClose,
}: CurationSelectModalProps) => {
  const { data: challengeData, isLoading: challengeDataIsLoading } =
    useGetProgramAdminQuery({
      type: 'CHALLENGE',
      page: 1,
      size: 100,
      enabled: type === 'CHALLENGE',
    });
  const { data: liveData, isLoading: liveDataIsLoading } =
    useGetProgramAdminQuery({
      type: 'LIVE',
      page: 1,
      size: 100,
      enabled: type === 'LIVE',
    });

  const { data: vodData, isLoading: vodDataIsLoading } =
    useGetProgramAdminQuery({
      type: 'VOD',
      page: 1,
      size: 100,
      enabled: type === 'VOD',
    });

  const { data: reportData, isLoading: reportDataIsLoading } =
    useGetReportsForAdmin({
      enabled: type === 'REPORT',
    });

  const { data: blogData, isLoading: blogDataIsLoading } = useBlogListQuery({
    pageable: {
      page: 1,
      size: 100,
    },
    enabled: type === 'BLOG',
  });

  const isLoading =
    challengeDataIsLoading ||
    liveDataIsLoading ||
    vodDataIsLoading ||
    reportDataIsLoading ||
    blogDataIsLoading;

  const data = (): CurationSelectItemType[] => {
    switch (type) {
      case 'CHALLENGE':
        return (
          challengeData?.programList.map((program) => ({
            id: program.programInfo.id || 0,
            title: program.programInfo.title || '',
            thumbnail: program.programInfo.thumbnail || '',
          })) || []
        );
      case 'LIVE':
        return (
          liveData?.programList.map((program) => ({
            id: program.programInfo.id || 0,
            title: program.programInfo.title || '',
            thumbnail: program.programInfo.thumbnail || '',
          })) || []
        );
      case 'VOD':
        return (
          vodData?.programList.map((program) => ({
            id: program.programInfo.id || 0,
            title: program.programInfo.title || '',
            thumbnail: program.programInfo.thumbnail || '',
          })) || []
        );
      case 'REPORT':
        return (
          reportData?.reportForAdminInfos.map((report) => ({
            id: report.reportId || 0,
            title: report.title || '',
            thumbnail: getReportThumbnail(report.reportType || null),
          })) || []
        );
      case 'BLOG':
        return (
          blogData?.blogInfos.map((blog) => ({
            id: blog.blogThumbnailInfo.id || 0,
            title: blog.blogThumbnailInfo.title || '',
            thumbnail: blog.blogThumbnailInfo.thumbnail || '',
          })) || []
        );
      default:
        return [];
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper className="absolute left-1/2 top-1/2 max-h-[90vh] w-3/5 -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-9">
        <Heading3>{convertCurationTypeToText(type)} 큐레이션 선택</Heading3>
        {isLoading ? (
          <LoadingContainer />
        ) : data().length === 0 ? (
          <EmptyContainer text="등록된 데이터가 없습니다." />
        ) : (
          <div className="mt-5 grid w-full grid-cols-4 gap-5">
            {data().map((item) => (
              <div
                key={item.id}
                className="flex w-full flex-1 cursor-pointer flex-col items-center gap-y-2 transition-all hover:scale-110"
                onClick={() => onSelect({ id: item.id, title: item.title })}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="aspect-[3/2] w-full rounded-xxs object-cover"
                />
                <span className="line-clamp-2 w-full text-center">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </Paper>
    </Modal>
  );
};

export default CurationSelectModal;
