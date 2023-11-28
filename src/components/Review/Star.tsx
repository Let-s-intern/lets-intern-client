import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

interface StarProps {
  onClick: () => void;
  isActive: boolean;
}

interface StarIconProps {
  isActive: boolean;
}

const Star = ({ onClick, isActive }: StarProps) => {
  return (
    <StarBlock onClick={onClick}>
      <StarIcon isActive={isActive}>
        <FaStar />
      </StarIcon>
    </StarBlock>
  );
};

export default Star;

const StarBlock = styled.div`
  height: 1.75rem;
  width: 1.75rem;
  cursor: pointer;
`;

const StarIcon = styled.i<StarIconProps>`
  font-size: 1.5rem;
  color: ${({ isActive }) => (isActive ? '#ffd700' : '#d1d1d1')};
  cursor: pointer;
`;
