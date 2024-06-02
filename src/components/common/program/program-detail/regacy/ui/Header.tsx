import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <HeaderBlock>
      <BackButton onClick={() => navigate('/program')}>
        <i>
          <img src="/icons/back-icon.svg" alt="이전 버튼" className="w-full" />
        </i>
      </BackButton>
      <Heading>{title}</Heading>
    </HeaderBlock>
  );
};

export default Header;

const HeaderBlock = styled.header`
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const BackButton = styled.button`
  width: 2rem;
  height: 2rem;

  i {
    img {
      width: 100%;
    }
  }
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 500;
`;
