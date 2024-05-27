import TextArea from '../../ui/input/TextArea';

const TextAreaSection = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">
        렛츠커리어에게 하고 싶은 말이나, 전반적인 후기를 남겨주세요!
      </h1>
      <TextArea rows={3} placeholder="이곳에 후기를 작성해주세요!" />
    </div>
  );
};

export default TextAreaSection;
