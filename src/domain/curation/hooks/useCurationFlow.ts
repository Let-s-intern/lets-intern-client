import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PERSONA_IDS, QUESTION_MAP } from '../data/constants';
import { computeCurationResult } from '../model/curationEngine';
import {
  CurationQuestion,
  CurationResult,
  FormValues,
  PersonaId,
} from '../types/types';

interface UseCurationFlowParams {
  defaultPersonaId: PersonaId;
  questionMap?: Record<PersonaId, CurationQuestion[]>;
  personaIds?: PersonaId[];
}

export const useCurationFlow = ({
  questionMap = QUESTION_MAP,
  personaIds = PERSONA_IDS,
}: UseCurationFlowParams) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<CurationResult | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);

  const personaEnum = z.enum(personaIds as [PersonaId, ...PersonaId[]]);
  const formSchema = z.object({
    personaId: personaEnum.optional(),
    step1: z.string().min(1, '옵션을 선택해주세요.'),
    step2: z.string().min(1, '옵션을 선택해주세요.'),
  });

  type CurationFormValues = FormValues & { personaId?: PersonaId };

  const {
    setValue,
    watch,
    reset,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CurationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personaId: undefined,
      step1: '',
      step2: '',
    },
    mode: 'onChange',
  });

  const personaId = watch('personaId');
  const questionSet = useMemo(
    () => (personaId ? questionMap[personaId] : undefined),
    [personaId, questionMap],
  );

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    setValue('step1', '');
    setValue('step2', '');
    setResult(null);
    // currentStep is handled by goNext() to avoid double increment
  }, [personaId, setValue]);

  const scrollToForm = () => {
    if (!formRef.current) return;

    const navHeight = 60; // sticky nav 높이
    const offset = navHeight + 20; // 여유 공간
    const elementPosition = formRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const onSubmit = (values: FormValues) => {
    const computed = computeCurationResult(values);
    setResult(computed);
    setCurrentStep(3);
  };

  useEffect(() => {
    if (result) {
      requestAnimationFrame(() => {
        const target = document.getElementById('curation-result');
        if (target) {
          const isMobile = window.innerWidth < 768;
          const navHeight = 60; // sticky nav 높이
          const offset = navHeight + (isMobile ? 20 : 40); // 모바일은 더 적은 여유
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      });
    }
  }, [result]);

  const requiredFieldsByStep: (keyof CurationFormValues)[][] = [
    ['personaId'],
    ['personaId', 'step1'],
    ['personaId', 'step1', 'step2'],
  ];

  const goNext = async () => {
    const fields = requiredFieldsByStep[Math.min(currentStep, 2)];
    const valid = await trigger(fields);
    if (!valid) return;
    if (currentStep >= 2) {
      handleSubmit(onSubmit)();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const goToStep = (targetStep: number) => {
    if (targetStep >= currentStep) return; // only allow back navigation
    const clamped = Math.max(0, Math.min(targetStep, 3));
    setCurrentStep(clamped);
  };

  const handleRestart = () => {
    reset({ personaId: undefined, step1: '', step2: '' });
    setResult(null);
    setCurrentStep(0);
  };

  return {
    formRef,
    currentStep,
    setCurrentStep,
    personaId,
    questionSet,
    errors,
    watch,
    setValue,
    goNext,
    goToStep,
    handleRestart,
    result,
    scrollToForm,
  };
};
