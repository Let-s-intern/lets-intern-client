import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const CardBlock = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: #f1f4f9;
  border-radius: 8px;
  width: 15rem;
  aspect-ratio: 3/4;
  padding: 2rem;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CardSubSpan = styled.span`
  display: block;
  color: #36337f;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const CardBadge = styled.div`
  border-radius: 4px;
  background-color: #36337f;
  color: #ffffff;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
`;

export const CardMiddle = styled.div`
  flex-grow: 1;
`;

export const CardTitle = styled.h2`
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const CardBottom = styled.div`
  display: flex;
  justify-content: end;
`;

export const CardBottomLink = styled.span`
  display: block;
  text-decoration: underline;
  color: #a5a5a5;
`;
