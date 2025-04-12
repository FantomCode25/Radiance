import { Client } from "@gradio/client";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizResult from '@/components/quiz/QuizResult';
import { useAuth } from '@/hooks/useAuth';

const quizQuestions = [
  {
    id: 1,
    text: "I often feel hopeless",
    options: [
      { id: "1-0", text: "Disagree", value: 1 },
      { id: "1-1", text: "Neutral", value: 0.7 },
      { id: "1-2", text: "Slightly Agree", value: 0.3 },
      { id: "1-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 2,
    text: "I avoid public places due to fear",
    options: [
      { id: "2-0", text: "Disagree", value: 1 },
      { id: "2-1", text: "Neutral", value: 0.7 },
      { id: "2-2", text: "Slightly Agree", value: 0.3 },
      { id: "2-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 3,
    text: "I feel anxious for no reason",
    options: [
      { id: "3-0", text: "Disagree", value: 1 },
      { id: "3-1", text: "Neutral", value: 0.7 },
      { id: "3-2", text: "Slightly Agree", value: 0.3 },
      { id: "3-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 4,
    text: "I can't control my worries",
    options: [
      { id: "4-0", text: "Disagree", value: 1 },
      { id: "4-1", text: "Neutral", value: 0.7 },
      { id: "4-2", text: "Slightly Agree", value: 0.3 },
      { id: "4-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 5,
    text: "I have experienced trauma",
    options: [
      { id: "5-0", text: "Disagree", value: 1 },
      { id: "5-1", text: "Neutral", value: 0.7 },
      { id: "5-2", text: "Slightly Agree", value: 0.3 },
      { id: "5-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 6,
    text: "I have trouble sleeping",
    options: [
      { id: "6-0", text: "Disagree", value: 1 },
      { id: "6-1", text: "Neutral", value: 0.7 },
      { id: "6-2", text: "Slightly Agree", value: 0.3 },
      { id: "6-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 7,
    text: "I feel tired most days",
    options: [
      { id: "7-0", text: "Disagree", value: 1 },
      { id: "7-1", text: "Neutral", value: 0.7 },
      { id: "7-2", text: "Slightly Agree", value: 0.3 },
      { id: "7-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 8,
    text: "I avoid conversations",
    options: [
      { id: "8-0", text: "Disagree", value: 1 },
      { id: "8-1", text: "Neutral", value: 0.7 },
      { id: "8-2", text: "Slightly Agree", value: 0.3 },
      { id: "8-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 9,
    text: "I prefer isolation",
    options: [
      { id: "9-0", text: "Disagree", value: 1 },
      { id: "9-1", text: "Neutral", value: 0.7 },
      { id: "9-2", text: "Slightly Agree", value: 0.3 },
      { id: "9-3", text: "Strongly Agree", value: 0 },
    ],
  },
  {
    id: 10,
    text: "I get nervous in social settings",
    options: [
      { id: "10-0", text: "Disagree", value: 1 },
      { id: "10-1", text: "Neutral", value: 0.7 },
      { id: "10-2", text: "Slightly Agree", value: 0.3 },
      { id: "10-3", text: "Strongly Agree", value: 0 },
    ],
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [therapistsResult, setTherapistsResult] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: '/quiz' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAnswerQuestion = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

const handleNextQuestion = async () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else {
    const totalScore = answers.reduce((sum, value) => sum + value, 0);
    setScore(Math.round(totalScore));
    setShowResults(true);

    console.log('Quiz completed. Answers:', answers);
    console.log('Final score:', totalScore);

    // Convert answer values back to original option labels
    const selectedLabels = quizQuestions.map((q, i) => {
      const selectedValue = answers[i];
      const matchedOption = q.options.find(o => o.value === selectedValue);
      return matchedOption?.text || "Neutral";
    });

    // Call Gradio AI model
    try {
      const client = await Client.connect("SrujanBillava/ML_Matching");
      const result = await client.predict("/predict", {
        email: "user@example.com", // Or fetch from user's auth profile
        param_1: selectedLabels[0],
        param_2: selectedLabels[1],
        param_3: selectedLabels[2],
        param_4: selectedLabels[3],
        param_5: selectedLabels[4],
        param_6: selectedLabels[5],
        param_7: selectedLabels[6],
        param_8: selectedLabels[7],
        param_9: selectedLabels[8],
        param_10: selectedLabels[9],
      });

      console.log("Recommended Therapists:", result.data[0].therapists);

      setTherapistsResult(result.data[0].therapists)

      console.log("Recommended Therapists:", result.data[0].specialization);

      setSpecialization(result.data[0].specialization)
    } catch (err) {
      console.error("AI Matching failed:", err);
    }
  }
};


  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          {!showResults ? (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-oasis-dark mb-4">Mental Health Assessment</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  This assessment helps evaluate your current mental well-being. 
                  Please answer honestly—there are no right or wrong answers.
                </p>
              </div>
              
              <QuizQuestion
                questionNumber={currentQuestionIndex + 1}
                questionText={quizQuestions[currentQuestionIndex].text}
                options={quizQuestions[currentQuestionIndex].options}
                onAnswer={handleAnswerQuestion}
                onNext={handleNextQuestion}
                isLastQuestion={currentQuestionIndex === quizQuestions.length - 1}
              />
            </div>
          ) : (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-oasis-dark mb-4">Your Assessment Results</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Based on your responses, we've prepared a personalized evaluation of your mental well-being.
                </p>
              </div>
              
              <QuizResult
                score={score}
                totalQuestions={quizQuestions.length}
                onRetake={handleRetakeQuiz}
                therapists={therapistsResult}
                specialization={specialization}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
