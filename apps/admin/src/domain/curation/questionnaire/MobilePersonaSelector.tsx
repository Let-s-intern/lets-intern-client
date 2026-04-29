import { motion } from 'motion/react';
import { PersonaId } from '../types';
import { PERSONAS } from './data/personas';

interface MobilePersonaSelectorProps {
  selected?: PersonaId;
  onSelect: (id: PersonaId) => void;
}

const MobilePersonaSelector = ({
  selected,
  onSelect,
}: MobilePersonaSelectorProps) => {
  return (
    <div className="flex w-full flex-col gap-3">
      {PERSONAS.filter((p) => p.id !== 'dontKnow').map((persona) => {
        const isActive = selected === persona.id;
        return (
          <motion.button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            className={`relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 bg-gradient-to-br px-4 py-3 text-center transition-all duration-300 ${
              isActive
                ? 'border-primary from-primary-5 shadow-primary/10 to-white shadow-lg'
                : 'border-neutral-85 from-white to-gray-50 shadow-sm active:scale-[0.98]'
            }`}
            whileTap={{ scale: 0.98 }}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                className="bg-primary absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className="text-xsmall12">✓</span>
              </motion.div>
            )}
            <span
              className={`truncate text-xs font-semibold ${
                isActive ? 'text-primary' : 'text-neutral-0'
              }`}
            >
              {persona.title}
            </span>
          </motion.button>
        );
      })}
      {(() => {
        const dontKnow = PERSONAS.find((p) => p.id === 'dontKnow');
        if (!dontKnow) return null;
        const isActive = selected === dontKnow.id;
        return (
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={() => onSelect(dontKnow.id)}
              className={`text-medium16 underline underline-offset-4 transition-colors ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-neutral-35 active:text-neutral-0 font-normal'
              }`}
            >
              {dontKnow.title}
            </button>
          </div>
        );
      })()}
    </div>
  );
};

export default MobilePersonaSelector;
