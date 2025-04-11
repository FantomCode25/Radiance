import { useState } from 'react';
import { Star, Clock, Award, VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const TherapistCard = ({
  id,
  name,
  age,
  image,
  rating,
  specialization,
  experience,
  education,
  languages,
  pricePerSession,
  availability
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleBookSession = () => {
    navigate(`/therapists/${id}/session`);
  };

  const handleViewProfile = () => {
    navigate(`/therapists/${id}`);
  };

  // Render stars for rating
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 half-filled" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    
    return stars;
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
        isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover object-center"
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center">
            <div className="flex">{renderStars()}</div>
            <span className="ml-1 text-white text-sm">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{age} years old</p>
          </div>
          <Badge className="bg-oasis-primary hover:bg-oasis-primary/90">{specialization}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Available: {availability}</span>
          </div>
          <div className="flex items-center">
            <Award className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{experience} years experience</span>
          </div>
          <div className="flex items-center">
            <VideoIcon className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">${pricePerSession} per session</span>
          </div>
          <div className="pt-2">
            <div className="flex flex-wrap gap-1">
              {languages.map((language, index) => (
                <span 
                  key={index}
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-shrink-0 pt-0">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="outline" 
            className="w-full border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button 
            className="w-full bg-oasis-primary hover:bg-oasis-primary/90 text-white"
            onClick={handleBookSession}
          >
            Book Session
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TherapistCard;
