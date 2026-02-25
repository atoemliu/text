import type { RegionData } from '../types/region';
import { SpecialtyCard } from './SpecialtyCard';

export function RegionSection({ data, index }: { data: RegionData, index: number }) {
  return (
    <section className="relative">
      <div className="flex items-baseline mb-10 border-b border-gray-200/60 pb-6">
        <span className="text-gray-300 font-serif text-3xl mr-6 italic font-light tracking-tighter">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#1a1a1a] tracking-tight">
          {data.region}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {data.specialties.map((specialty, idx) => (
          <SpecialtyCard key={idx} name={specialty} />
        ))}
      </div>
    </section>
  );
}
