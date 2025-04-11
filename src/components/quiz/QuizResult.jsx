import { Link } from "react-router-dom";
import { Check, AlertTriangle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";
import { Star, Clock, Award, VideoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// The QuizResult component receives an object with properties: score, totalQuestions, and onRetake
const QuizResult = ({
  score,
  totalQuestions,
  onRetake,
  therapists,
  specialization,
}) => {
  const navigate = useNavigate();
  const percentage = (score / totalQuestions) * 100;
  const [isHovered, setIsHovered] = useState(false);

  // Determine result category based on score
  const [showTherapists, setShowTherapists] = useState(false);
  let resultCategory = "";
  let resultColor = "";
  let resultIcon = null;
  let resultMessage = "";
  let recommendation = "";
  let id = 1;

  const handleViewProfile = () => {
    navigate(`/therapists/${id}`);
  };

  const handleBookSession = () => {
    navigate(`/therapists/${id}/session`);
  };

  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(1 * 2) / 2; // Round to nearest 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i - 0.5 === roundedRating) {
        stars.push(
          <Star
            key={i}
            className="w-4 h-4 fill-yellow-400 text-yellow-400 half-filled"
          />
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  if (specialization === "No Need For Therapy") {
    resultCategory = "Good Mental Health";
    resultColor = "text-green-600";
    resultIcon = <Check className="w-8 h-8 text-green-600" />;
    resultMessage =
      "Your responses indicate good mental well-being. You appear to be managing stress effectively and maintaining a positive outlook.";
    recommendation =
      "Continue your current self-care practices and check in regularly to maintain your mental wellness.";
  } else {
    resultCategory = "Needs Attention";
    resultColor = "text-red-600";
    resultIcon = <AlertCircle className="w-8 h-8 text-red-600" />;
    resultMessage =
      "Your responses suggest you may be experiencing significant mental health challenges that deserve professional attention.";
    recommendation =
      "We recommend speaking with a mental health professional who can provide personalized guidance and support.";
  }

  return showTherapists ? (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-3 mb-4">
          {resultIcon}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Your Mental Health Assessment
        </h2>
        <p className="text-gray-600">
          Thank you for completing the assessment. Here's what we found:
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700 font-medium">Your Score</span>
          <span className={`font-bold ${resultColor}`}>
            {score}/{totalQuestions} points
          </span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className={`text-xl font-bold mb-3 ${resultColor}`}>
          {resultCategory}
        </h3>
        <p className="text-gray-700 mb-4">{resultMessage}</p>
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-800 mb-2">Recommendation:</h4>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={onRetake}
          variant="outline"
          className="border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white"
        >
          Retake Assessment
        </Button>

        {therapists.length > 0 && (
          <Link to="/therapists">
            <Button
              className="bg-oasis-primary hover:bg-oasis-primary/90 w-full sm:w-auto"
              onClick={() => setShowTherapists(true)}
            >
              Book Appointment
            </Button>
          </Link>
        )}

        <Link to="/resources">
          <Button
            variant="outline"
            className="border-oasis-secondary text-oasis-secondary hover:bg-oasis-secondary hover:text-white w-full sm:w-auto"
          >
            View Resources
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-oasis-dark mb-4">
              Right Therapists for you
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Therapist cards grid */}
            <div className="flex-grow">
              {therapists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {therapists.map((therapist) => (
                    <Card
                      className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
                        isHovered
                          ? "shadow-lg transform -translate-y-1"
                          : "shadow-md"
                      }`}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div className="relative">
                        <img
                          src={"/therapist-1.jpg"}
                          alt={therapist.name}
                          className="w-full h-48 object-cover object-center"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <div className="flex items-center">
                            <div className="flex">{renderStars()}</div>
                            <span className="ml-1 text-white text-sm">4</span>
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {therapist.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              age years old
                            </p>
                          </div>
                          <Badge className="bg-oasis-primary hover:bg-oasis-primary/90">
                            {specialization}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-grow pb-4">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">
                              Available: availability
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">
                              {therapist.experience} years experience
                            </span>
                          </div>
                          <div className="flex items-center">
                            <VideoIcon className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">
                              $pricePerSession per session
                            </span>
                          </div>
                          <div className="pt-2">
                            <div className="flex flex-wrap gap-1">
                              <span
                                key={parseInt(Math.random() * 10000)}
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                              >
                                languages
                              </span>
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No therapists found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any therapists matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizResult;
