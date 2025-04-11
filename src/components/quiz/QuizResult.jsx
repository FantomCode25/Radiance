import { Link } from 'react-router-dom';
import { Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// The QuizResult component receives an object with properties: score, totalQuestions, and onRetake
const QuizResult = ({ score, totalQuestions, onRetake, therapists, specialization }) => {
  const percentage = (score / totalQuestions) * 100;
  
  // Determine result category based on score
  let resultCategory = '';
  let resultColor = '';
  let resultIcon = null;
  let resultMessage = '';
  let recommendation = '';
  
  if (specialization==='No Need For Therapy') {
    resultCategory = 'Good Mental Health';
    resultColor = 'text-green-600';
    resultIcon = <Check className="w-8 h-8 text-green-600" />;
    resultMessage = 'Your responses indicate good mental well-being. You appear to be managing stress effectively and maintaining a positive outlook.';
    recommendation = 'Continue your current self-care practices and check in regularly to maintain your mental wellness.';
  }else {
    resultCategory = 'Needs Attention';
    resultColor = 'text-red-600';
    resultIcon = <AlertCircle className="w-8 h-8 text-red-600" />;
    resultMessage = 'Your responses suggest you may be experiencing significant mental health challenges that deserve professional attention.';
    recommendation = 'We recommend speaking with a mental health professional who can provide personalized guidance and support.';
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-3 mb-4">
          {resultIcon}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Mental Health Assessment</h2>
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
        <h3 className={`text-xl font-bold mb-3 ${resultColor}`}>{resultCategory}</h3>
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
        
        {percentage < 60 && (
          <Link to="/therapists">
            <Button className="bg-oasis-primary hover:bg-oasis-primary/90 w-full sm:w-auto">
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
  );
};

export default QuizResult;
