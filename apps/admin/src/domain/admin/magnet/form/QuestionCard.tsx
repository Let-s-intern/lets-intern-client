import QuestionItemList from '@/domain/admin/magnet/form/QuestionItemList';
import {
  FormQuestion,
  FormQuestionItem,
  FormQuestionType,
  FormResponseRequired,
  FormSelectionMethod,
} from '@/domain/admin/magnet/types';
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Trash } from 'lucide-react';

interface QuestionCardProps {
  questionNumber: number;
  question: FormQuestion;
  onUpdate: (patch: Partial<FormQuestion>) => void;
  onRemove: () => void;
}

const QuestionCard = ({
  questionNumber,
  question,
  onUpdate,
  onRemove,
}: QuestionCardProps) => {
  const handleQuestionTypeChange = (value: string) => {
    onUpdate({ questionType: value as FormQuestionType });
  };

  const handleRequiredChange = (value: string) => {
    onUpdate({ isRequired: value as FormResponseRequired });
  };

  const handleSelectionMethodChange = (value: string) => {
    onUpdate({ selectionMethod: value as FormSelectionMethod });
  };

  const handleItemsChange = (items: FormQuestionItem[]) => {
    onUpdate({ items });
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-lg font-semibold">질문 {questionNumber}</span>
        <IconButton size="small" onClick={onRemove}>
          <Trash size={18} />
        </IconButton>
      </div>

      <div className="flex flex-col gap-5">
        {/* 질문 유형 */}
        <div>
          <label className="mb-1 block text-sm font-medium">질문 유형</label>
          <RadioGroup
            row
            value={question.questionType}
            onChange={(e) => handleQuestionTypeChange(e.target.value)}
          >
            <FormControlLabel
              value="SUBJECTIVE"
              control={<Radio size="small" />}
              label="주관식"
            />
            <FormControlLabel
              value="OBJECTIVE"
              control={<Radio size="small" />}
              label="객관식"
            />
          </RadioGroup>
        </div>

        {/* 응답 설정 */}
        <div>
          <label className="mb-1 block text-sm font-medium">응답 설정</label>
          <RadioGroup
            row
            value={question.isRequired}
            onChange={(e) => handleRequiredChange(e.target.value)}
          >
            <FormControlLabel
              value="REQUIRED"
              control={<Radio size="small" />}
              label="필수"
            />
            <FormControlLabel
              value="OPTIONAL"
              control={<Radio size="small" />}
              label="선택"
            />
          </RadioGroup>
        </div>

        {/* 질문 */}
        <TextField
          label="질문 *"
          placeholder="질문을 입력하세요"
          fullWidth
          size="small"
          value={question.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
        />

        {/* 설명 */}
        <TextField
          label="설명"
          placeholder="질문에 대한 설명을 입력하세요 (선택사항)"
          fullWidth
          size="small"
          multiline
          minRows={2}
          value={question.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />

        {/* 객관식 전용 영역 */}
        {question.questionType === 'OBJECTIVE' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">
                선택 방식
              </label>
              <RadioGroup
                row
                value={question.selectionMethod}
                onChange={(e) => handleSelectionMethodChange(e.target.value)}
              >
                <FormControlLabel
                  value="SINGLE"
                  control={<Radio size="small" />}
                  label="단일선택"
                />
                <FormControlLabel
                  value="MULTIPLE"
                  control={<Radio size="small" />}
                  label="다중선택"
                />
              </RadioGroup>
            </div>

            <QuestionItemList
              items={question.items}
              onUpdateItems={handleItemsChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
