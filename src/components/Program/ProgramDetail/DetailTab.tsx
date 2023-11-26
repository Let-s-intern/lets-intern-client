import Markdown from 'react-markdown';

interface DetailTabProps {
  content: string;
}

const DetailTab = ({ content }: DetailTabProps) => {
  return <Markdown className="markdown-body">{content}</Markdown>;
};

export default DetailTab;
