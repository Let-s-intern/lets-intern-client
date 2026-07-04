import PlanBenefits from './PlanBenefits';
import PriceView from './PriceView';
import { PriceInfo } from './types';

const PlanRow = ({ plan }: { plan: PriceInfo }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-3.5">
      <div className="flex-1">
        <div className="text-xsmall16 text-neutral-0 font-semibold">
          {plan.title}
        </div>
        <PlanBenefits
          description={plan.description}
          isBasic={plan.planType === 'BASIC'}
          showBasicIncluded={plan.planType !== 'LIGHT'}
        />
      </div>
      <PriceView
        originalPrice={plan.originalPrice}
        discountAmount={plan.discountAmount}
      />
    </div>
  );
};

export default PlanRow;
