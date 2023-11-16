export interface THProps {
  children: React.ReactNode;
}

export interface TDProps {
  children: React.ReactNode;
  className?: string;
}

export interface ActionButtonProps {
  style: 'edit' | 'delete';
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
}
