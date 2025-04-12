
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-oasis-dark">
              Your Journey To <span className="text-oasis-primary">Mental Wellness</span> Starts Here
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Take control of your mental health with accessible therapy sessions, 
              wellness resources, and professional guidance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/quiz">
                <Button className="bg-oasis-primary hover:bg-oasis-primary/90 text-white">
                  Take a Mental Assessment
                </Button>
              </Link>
              <Link to="/therapists">
                <Button variant="outline" className="border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white">
                  Find a Therapist
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/hero-image.png" 
              alt="Mental wellness therapy session" 
              className="rounded-lg shadow-xl object-cover h-[400px] w-full"
            />
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md max-w-[200px]">
              <p className="text-sm font-medium text-oasis-primary">
                "ZenZone helped me find my balance again. The therapists are amazing!"
              </p>
              <p className="text-xs text-gray-500 mt-2">- Sarah T., Client</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-oasis-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-oasis-secondary/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default HeroSection;
