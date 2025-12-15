import TextArea from '../../ui/input/TextArea';

interface TextAreaSectionProps {
  content: string;
  setContent: (content: string) => void;
}

const TextAreaSection = ({ content, setContent }: TextAreaSectionProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-semibold">
        렛츠커리어에게 하고 싶은 말이나, 전반적인 후기를 남겨주세요!
      </h1>
      <TextArea
        rows={3}
        placeholder="이곳에 후기를 작성해주세요!"
        value={content}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default TextAreaSection;
