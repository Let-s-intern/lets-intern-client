import styled from 'styled-components';
import '../../../styles/github-markdown-light.css';

interface DetailTabProps {
  content: string;
}

const DetailTab = ({ content }: DetailTabProps) => {
  return (
    <DetailTabBlock>
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </DetailTabBlock>
  );
};

export default DetailTab;

const DetailTabBlock = styled.div`
  padding-top: 1rem;
`;
