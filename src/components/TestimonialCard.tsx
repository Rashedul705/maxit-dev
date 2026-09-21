import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  company: string;
  testimonial: string;
  rating: number;
  image: string;
}

const TestimonialCard = ({ name, company, testimonial, rating, image }: TestimonialCardProps) => {
  return (
    <div className="group relative bg-[#1E293B] p-10 rounded-3xl transition-all duration-500 border border-white/10 hover:border-accent/50 transform hover:-translate-y-2 overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px] group-hover:bg-accent/20 transition-colors duration-500 pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      {/* Background Quote */}
      <div className="absolute -top-4 -left-4 text-white/5 group-hover:text-accent/10 transition-colors duration-500 transform -scale-x-100">
        <Quote size={120} />
      </div>

      <div className="flex items-center mb-8 relative z-10">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 mr-1.5 ${i < rating ? 'text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-gray-800'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <p className="text-gray-300 mb-10 leading-relaxed font-medium text-lg relative z-10 flex-grow italic">
        "{testimonial}"
      </p>
      
      <div className="flex items-center space-x-4 relative z-10 pt-6 border-t border-white/10 mt-auto">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent transition-colors duration-300 shadow-lg">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-bold font-heading text-white text-lg">{name}</div>
          <div className="text-sm text-accent font-medium tracking-wide uppercase">{company}</div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
