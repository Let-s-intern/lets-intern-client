import LoadingContainer from '@components/common/ui/loading/LoadingContainer';

export default function Loading() {
  return (
    <LoadingContainer
      className="mt-[20%]"
      text="블로그를 불러오는 중입니다.."
    />
  );
}
