import styles from './CardListPlaceholder.module.scss';

interface CardListPlaceholderProps {
  children?: React.ReactNode;
}

const CardListPlaceholder = ({ children }: CardListPlaceholderProps) => {
  return <div className={styles.placeholder}>{children}</div>;
};

export default CardListPlaceholder;
