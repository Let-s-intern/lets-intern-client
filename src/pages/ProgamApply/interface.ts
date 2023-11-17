export interface Pages {
  position: 'bottom' | 'center';
  content: React.ReactNode;
  nextButtonText?: string;
}

export interface ListItemProps {
  checked?: boolean;
  children: React.ReactNode;
}

export interface ModalProps {
  position: 'bottom' | 'center';
  nextButtonText?: string;
  onNextButtonClick: () => void;
  children: React.ReactNode;
}

export interface CautionContentProps {
  cautionChecked: boolean;
  onCautionChecked: () => void;
}
