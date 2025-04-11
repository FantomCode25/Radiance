
import { Users, Calendar, Award, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      title: "Clients Helped",
      value: "15,000+",
      icon: <Users className="w-10 h-10 text-oasis-accent" />,
      description: "Individuals who found support through our platform"
    },
    {
      title: "Therapy Sessions",
      value: "50,000+",
      icon: <Calendar className="w-10 h-10 text-oasis-accent" />,
      description: "Successful sessions conducted by our therapists"
    },
    {
      title: "Certified Therapists",
      value: "200+",
      icon: <Award className="w-10 h-10 text-oasis-accent" />,
      description: "Licensed professionals ready to support you"
    },
    {
      title: "Years of Service",
      value: "8+",
      icon: <Clock className="w-10 h-10 text-oasis-accent" />,
      description: "Providing quality mental health support"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-oasis-primary/10 to-oasis-secondary/10">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-oasis-dark">Our Impact</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Making a difference in mental wellness every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md text-center"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-oasis-primary/10 p-3 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-oasis-primary mb-2">{stat.value}</h3>
              <h4 className="text-xl font-medium text-gray-800 mb-2">{stat.title}</h4>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
