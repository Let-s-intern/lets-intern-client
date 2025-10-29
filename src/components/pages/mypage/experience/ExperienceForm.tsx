import { XIcon } from 'lucide-react';

interface ExperienceFormProps {
  onClose: () => void;
}

export const ExperienceForm = (props: ExperienceFormProps) => {
  return (
    <div>
      <header>
        <h1>경험 작성</h1>
        <button onClick={props.onClose}>
          <XIcon />
        </button>
      </header>
    </div>
  );
};
