
import { Link } from 'react-router-dom';
import { Brain, Calendar, ShoppingBag, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FeaturesSection = () => {
  const features = [
    {
      title: "Take a Mental Assessment",
      description: "Complete our comprehensive quiz to understand your mental health state and get personalized recommendations.",
      icon: <Brain className="w-12 h-12 text-oasis-primary" />,
      link: "/quiz",
      linkText: "Start Assessment"
    },
    {
      title: "Book a Therapy Session",
      description: "Connect with licensed therapists for one-on-one video sessions tailored to your specific needs.",
      icon: <Calendar className="w-12 h-12 text-oasis-primary" />,
      link: "/therapists",
      linkText: "Find Therapists"
    },
    {
      title: "Buy Wellness Products",
      description: "Explore our curated collection of products designed to support your mental wellness journey.",
      icon: <ShoppingBag className="w-12 h-12 text-oasis-primary" />,
      link: "/products",
      linkText: "Shop Products"
    },
    {
      title: "Know About Mental Health",
      description: "Access educational resources and expert insights about various mental health topics.",
      icon: <BookOpen className="w-12 h-12 text-oasis-primary" />,
      link: "#mental-health-section",
      linkText: "Learn More"
    }
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-oasis-dark">Our Services</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive mental health support tailored to your unique journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center h-full">
                <div className="rounded-full bg-oasis-primary/10 p-4 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-oasis-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{feature.description}</p>
                <Link to={feature.link}>
                  <Button 
                    variant="outline" 
                    className="w-full border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white"
                  >
                    {feature.linkText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
