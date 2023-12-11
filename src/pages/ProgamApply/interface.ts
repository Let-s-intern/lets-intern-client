export interface Pages {
  position: 'bottom' | 'center';
  content: React.ReactNode;
  nextButtonText?: string;
}

export interface GetPageDefault {
  (cautionChecked: boolean, handleCautionChecked: () => void): Pages[];
}

export interface ListItemProps {
  checked?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface CautionContentProps {
  cautionChecked: boolean;
  notice: string;
  onCautionChecked: () => void;
}
