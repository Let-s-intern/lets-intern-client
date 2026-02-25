import QuestionCard from '@/domain/admin/blog/magnet/form/QuestionCard';
import { FormQuestion } from '@/domain/admin/blog/magnet/types';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';

interface FormBuilderSectionProps {
  questions: FormQuestion[];
  onUpdateQuestion: (
    questionId: string,
    patch: Partial<FormQuestion>,
  ) => void;
  onRemoveQuestion: (questionId: string) => void;
  onAddQuestion: () => void;
}

const FormBuilderSection = ({
  questions,
  onUpdateQuestion,
  onRemoveQuestion,
  onAddQuestion,
}: FormBuilderSectionProps) => {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.questionId}
            questionNumber={index + 1}
            question={question}
            onUpdate={(patch) =>
              onUpdateQuestion(question.questionId, patch)
            }
            onRemove={() => onRemoveQuestion(question.questionId)}
          />
        ))}
      </div>

      <div className="mt-4">
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={onAddQuestion}
        >
          질문 추가
        </Button>
      </div>
    </div>
  );
};

export default FormBuilderSection;
