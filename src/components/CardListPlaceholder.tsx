import './CardListPlaceholder.scss';

interface CardListPlaceholderProps {
  children?: React.ReactNode;
}

const CardListPlaceholder = ({ children }: CardListPlaceholderProps) => {
  return <div className="card-list-placeholder">{children}</div>;
};

export default CardListPlaceholder;
