import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// The Option interface is removed in JavaScript because type definitions are not used.
// interface Option {
//   id: string;
//   text: string;
//   value: number;
// }

// The QuestionProps interface is removed in JavaScript because type definitions are not used.
// interface QuestionProps {
//   questionNumber: number;
//   questionText: string;
//   options: Option[];
//   onAnswer: (value: number) => void;
//   onNext: () => void;
//   isLastQuestion: boolean;
// }

const QuizQuestion = ({
  questionNumber,
  questionText,
  options,
  onAnswer,
  onNext,
  isLastQuestion
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    setIsAnswered(true);
    
    // Find the selected option to get its value
    const option = options.find(opt => opt.id === value);
    if (option) {
      onAnswer(option.value);
    }
  };

  const handleNext = () => {
    onNext();
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="bg-oasis-primary text-white text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center mr-3">
            {questionNumber}
          </span>
          <h3 className="text-xl font-medium text-gray-800">Question {questionNumber} of 10</h3>
        </div>
        <p className="text-xl text-gray-700 font-medium">{questionText}</p>
      </div>

      <RadioGroup
        value={selectedOption || ""}
        onValueChange={handleOptionChange}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedOption === option.id
                ? 'border-oasis-primary bg-oasis-primary/5'
                : 'border-gray-200 hover:border-oasis-primary/50'
            }`}
          >
            <RadioGroupItem
              value={option.id}
              id={option.id}
              className="mr-3"
            />
            <Label
              htmlFor={option.id}
              className="flex-grow cursor-pointer text-gray-700"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-8 flex justify-between">
        <div>
          {/* This space can be used for a Back button if needed */}
        </div>
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="bg-oasis-primary hover:bg-oasis-primary/90 min-w-[120px]"
        >
          {isLastQuestion ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestion;
