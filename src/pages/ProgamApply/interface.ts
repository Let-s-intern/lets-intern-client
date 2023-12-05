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

export interface ModalProps {
  position: 'bottom' | 'center';
  nextButtonText?: string;
  isNextButtonDisabled?: boolean;
  onNextButtonClick: () => void;
  children: React.ReactNode;
  onFoldButtonClick?: () => void;
  hasFoldButton?: boolean;
}

export interface CautionContentProps {
  cautionChecked: boolean;
  notice: string;
  onCautionChecked: () => void;
}
