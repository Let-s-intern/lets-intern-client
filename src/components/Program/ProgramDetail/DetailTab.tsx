import '../../../styles/github-markdown-light.css';

interface DetailTabProps {
  content: string;
}

const DetailTab = ({ content }: DetailTabProps) => {
  return (
    <div
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default DetailTab;
