import styled from 'styled-components';
import { Link } from 'react-router-dom';

import TD from '../TD';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
`;

const LinkButton = styled(Link)`
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  padding: 0.25rem 0.75rem;
  color: white;
  background-color: #4f45e4;
`;

const TableBody = () => {
  return (
    <thead>
      <tr>
        <TD>챌린지 1기</TD>
        <TD>등록 일자</TD>
        <TD>
          <ButtonGroup>
            <LinkButton to="/admin/reviews/1">상세</LinkButton>
          </ButtonGroup>
        </TD>
      </tr>
    </thead>
  );
};

export default TableBody;
