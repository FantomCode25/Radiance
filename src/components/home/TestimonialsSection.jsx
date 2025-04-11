
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Mental Oasis transformed my approach to therapy. The online sessions are convenient, and my therapist truly understands my needs. I've made more progress in 3 months than in years of traditional therapy.",
    name: "Emma Thompson",
    role: "Teacher, 34",
    image: "/no-profile.png"
  },
  {
    quote: "After struggling with anxiety for years, taking the mental health assessment was eye-opening. It connected me with resources I didn't know existed, and now I finally have tools to manage my symptoms.",
    name: "Michael Chen",
    role: "Software Engineer, 28",
    image: "/no-profile.png"
  },
  {
    quote: "The wellness products recommended to me have become essential to my daily routine. Combined with my therapy sessions, I've seen a remarkable improvement in my sleep and overall stress levels.",
    name: "Sophia Rodriguez",
    role: "Marketing Director, 42",
    image: "/no-profile.png"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-oasis-dark">Client Stories</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from people who found support through Mental Oasis
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote size={80} className="text-oasis-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-oasis-primary to-oasis-secondary opacity-20"></div>
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="rounded-full w-full h-full object-cover border-4 border-white shadow"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 text-center md:text-left">
                <p className="text-gray-700 italic text-lg mb-6">
                  "{testimonials[activeIndex].quote}"
                </p>
                <div>
                  <h4 className="text-xl font-medium text-oasis-dark">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-oasis-primary/10 text-oasis-primary hover:bg-oasis-primary hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex space-x-2 items-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    activeIndex === index ? 'bg-oasis-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-oasis-primary/10 text-oasis-primary hover:bg-oasis-primary hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;