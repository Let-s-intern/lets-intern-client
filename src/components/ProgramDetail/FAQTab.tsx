import { useEffect } from 'react';
import styled from 'styled-components';
import { IoTriangleSharp } from 'react-icons/io5';

interface FAQTabProps {
  faqList: any;
  toggleOpenList: number[];
  onToggleOpenList: (id: number) => void;
  getToggleOpened: (faqId: number) => boolean;
}

interface QuestionProps {
  $open: boolean;
}

const FAQTab = ({
  faqList,
  toggleOpenList,
  onToggleOpenList,
  getToggleOpened,
}: FAQTabProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return faqList.length === 0 || !faqList ? (
    <div className="text-center">FAQ가 없습니다.</div>
  ) : (
    faqList.map((faq: any) => {
      if (!faq) return null;

      const open = getToggleOpened(faq.id);

      return (
        <FAQItem key={faq.id}>
          <Question $open={open} onClick={() => onToggleOpenList(faq.id)}>
            <i>
              <IoTriangleSharp />
            </i>
            {faq.question}
          </Question>
          {toggleOpenList.includes(faq.id) && <Answer>{faq.answer}</Answer>}
        </FAQItem>
      );
    })
  );
};

export default FAQTab;

const FAQItem = styled.div``;

const Question = styled.div<QuestionProps>`
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0.5rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;

  i {
    font-size: 0.75rem;
    display: inline-block;
    transform: rotate(${({ $open }) => ($open ? 180 : 90)}deg);
    transition: transform 0.3s;
  }
`;

const Answer = styled.div`
  padding: 1rem 0.5rem;
`;
