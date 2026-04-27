import { MessageSquareQuote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  rating: number;
}

const TestimonialCard = ({ name, company, testimonial, rating }: TestimonialCardProps) => {
  return (
    <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 relative overflow-hidden transform hover:-translate-y-1">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[50px] group-hover:bg-accent/10 transition-colors duration-500 pointer-events-none translate-x-1/2 -translate-y-1/2" />
      
      <div className="absolute top-6 right-6 text-accent/10 group-hover:text-accent/20 transition-colors duration-500">
        <MessageSquareQuote size={48} />
      </div>

      <div className="flex items-center mb-6 relative z-10">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 mr-1 ${i < rating ? 'text-[#F59E0B] drop-shadow-sm' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-600 mb-8 leading-relaxed font-light relative z-10 min-h-[80px]">
        "{testimonial}"
      </p>
      
      <div className="flex items-center space-x-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center text-white font-bold font-heading text-lg shadow-inner">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-bold font-heading text-primary">{name}</div>
          <div className="text-sm text-gray-500 font-medium">{company}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
