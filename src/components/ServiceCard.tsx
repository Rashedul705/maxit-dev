import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

const ServiceCard = ({ icon, title, description, features }: ServiceCardProps) => {
  return (
    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 relative overflow-hidden flex flex-col h-full">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/15 transition-colors duration-500 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500 pointer-events-none" />

      <div className="mb-6 relative z-10 flex-grow">
        <div className="w-16 h-16 bg-accent/10 group-hover:bg-accent rounded-2xl flex items-center justify-center mb-6 text-accent group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:shadow-accent/40 rotate-0 group-hover:rotate-12">
          {/* Note: Icon passed as prop needs to have styling or we clone it to inject colors. We assume the parent passes appropriately sizing but doesn't hardcode text color. */}
          <div className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold font-heading text-primary mb-3 tracking-tight">{title}</h3>
        <p className="text-gray-600 leading-relaxed font-light">{description}</p>
      </div>

      <div className="pt-6 border-t border-gray-100 mt-auto relative z-10">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/5 text-primary mr-3 text-xs">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceCard;
