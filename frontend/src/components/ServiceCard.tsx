import { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
}

const ServiceCard = ({ icon, title, description, features, image }: ServiceCardProps) => {
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full">
      {/* Image Header */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Floating Icon */}
        <div className="absolute -bottom-8 left-8 z-20">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-accent transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 border border-gray-50">
            <div className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full">
              {icon}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 pb-8 px-8 flex-grow flex flex-col relative z-10 bg-white">
        <h3 className="text-2xl font-bold font-heading text-primary mb-3 tracking-tight group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-gray-700 leading-relaxed font-medium mb-8 flex-grow">{description}</p>

        <div className="pt-6 border-t border-gray-100">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm font-medium text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
