import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

interface StarProps {
  onClick?: () => void;
  isActive?: boolean;
  size?: string;
}

interface StarIconProps {
  $isActive?: boolean;
  $size?: string;
}

const Star = ({ onClick, isActive, size = '1.5rem' }: StarProps) => {
  return (
    <StarBlock onClick={onClick}>
      <StarIcon $isActive={isActive} $size={size}>
        <FaStar />
      </StarIcon>
    </StarBlock>
  );
};

export default Star;

const StarBlock = styled.div`
  cursor: pointer;
`;

const StarIcon = styled.i<StarIconProps>`
  font-size: ${({ $size }) => $size};
  color: ${({ $isActive }) => ($isActive ? '#6963F6' : '#d1d1d1')};
  cursor: pointer;
`;
