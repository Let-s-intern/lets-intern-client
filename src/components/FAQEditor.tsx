import styled, { css } from 'styled-components';

interface FAQEditorProps {
  faqList: any[];
  faqIdList: any[];
  onFAQAdd: () => void;
  onFAQDelete: (faqId: number) => void;
  onFAQChange: (e: any, faqId: number) => void;
  onFAQCheckChange: (e: any, faqId: number) => void;
}

const FAQEditor = (props: FAQEditorProps) => {
  return (
    <FAQEditorBlock>
      <Title>FAQ</Title>
      {props.faqList.map((faq: any) => (
        <InputControl key={faq.id}>
          <input
            type="checkbox"
            checked={props.faqIdList.includes(faq.id)}
            onChange={(e) => props.onFAQCheckChange(e, faq.id)}
          />
          <InputGroup>
            <Input
              type="text"
              name="question"
              placeholder="질문을 입력하세요."
              value={faq.question}
              onChange={(e) => props.onFAQChange(e, faq.id)}
              autoComplete="off"
            />
            <Input
              type="text"
              name="answer"
              placeholder="답변을 입력하세요."
              value={faq.answer}
              onChange={(e) => props.onFAQChange(e, faq.id)}
              autoComplete="off"
            />
          </InputGroup>
          <DeleteButton type="button" onClick={() => props.onFAQDelete(faq.id)}>
            삭제
          </DeleteButton>
        </InputControl>
      ))}
      <BottomButtonGroup>
        <AddButton type="button" onClick={props.onFAQAdd}>
          추가
        </AddButton>
      </BottomButtonGroup>
    </FAQEditorBlock>
  );
};

export default FAQEditor;

const buttonStyle = css`
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  outline: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
`;

const FAQEditorBlock = styled.div`
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.125);
  padding: 1.25rem 1.5rem;
`;

const Title = styled.h3`
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const InputControl = styled.div`
  display: flex;
  gap: 0.5rem;

  & + & {
    margin-top: 1rem;
  }
`;

const InputGroup = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  outline: none;
  font-size: 0.875rem;

  & + & {
    margin-top: 0.5rem;
  }
`;

const DeleteButton = styled.button`
  width: 5rem;
  ${buttonStyle}
`;

const BottomButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const AddButton = styled.button`
  ${buttonStyle}
`;
