import { motion } from 'motion/react';
import { PERSONAS } from '../constants';
import { PersonaId } from '../types';

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
      {PERSONAS.map((persona) => {
        const isActive = selected === persona.id;
        return (
          <motion.button
            key={persona.id}
            type="button"
            onClick={() => onSelect(persona.id)}
            className={`relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 bg-gradient-to-br px-5 py-4 text-center transition-all duration-300 ${
              isActive
                ? 'border-primary from-primary-5 to-white shadow-lg shadow-primary/10'
                : 'border-neutral-85 from-white to-gray-50 shadow-sm active:scale-[0.98]'
            }`}
            whileTap={{ scale: 0.98 }}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.div
                className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className="text-xsmall12">✓</span>
              </motion.div>
            )}
            <span
              className={`text-medium16 font-bold ${
                isActive ? 'text-primary' : 'text-neutral-0'
              }`}
            >
              {persona.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default MobilePersonaSelector;
