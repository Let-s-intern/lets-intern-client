import OutlinedButton from '@components/ui/button/OutlinedButton';

const NoCareerView = ({ handleCreateNew }: { handleCreateNew: () => void }) => {
  return (
    <section className="flex h-[28rem] flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center text-sm text-neutral-20">
        <p>아직 등록된 커리어가 없어요.</p>
        <p>지금까지의 경력을 기록해두면, 서류 준비가 훨씬 쉬워져요.</p>
      </div>
      <OutlinedButton size="xs" onClick={handleCreateNew} className="w-fit">
        커리어 기록하기
      </OutlinedButton>
    </section>
  );
};

export default NoCareerView;
