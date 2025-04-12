import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoChat from "@/components/therapists/VideoChat";
import { useToast } from "@/hooks/use-toast";

/**
 * @typedef {Object} Therapist
 * @property {string} id
 * @property {string} name
 * @property {number} age
 * @property {string} image
 * @property {string} specialization
 */

// Mock data for therapists

const SESSION_DURATION = 10; // Session duration in minutes (reduced for demo purposes)

const TherapistSession = () => {
  const { id } = useParams(); 
  
  const [therapist, setTherapist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading therapist data

    const fetchTherapist = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:5001/api/therapist/all-therapists");
        const data = await res.json();
        const foundTherapist = data.therapists.find((t) => t.id === id);

        if (foundTherapist) {
          setTherapist(foundTherapist);
        } else {
          toast({
            title: "Therapist not found",
            description: "The requested therapist could not be found.",
            variant: "destructive",
          });
          navigate("/therapists");
        }
      } catch (error) {
        console.error("Error loading therapist:", error);
        toast({
          title: "Error",
          description: "There was an error loading the therapist information.",
          variant: "destructive",
        });
        navigate("/therapists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTherapist();
  }, [id, navigate, toast]);

  const handleEndCall = () => {
    setSessionEnded(true);

    toast({
      title: "Session ended",
      description:
        "Your therapy session has ended. Thank you for using ZenZone.",
    });
  };

  const handleReturnToTherapists = () => {
    navigate("/therapists");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-oasis-primary mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">
            Connecting to your session...
          </h2>
          <p className="text-gray-500">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (sessionEnded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Complete
          </h2>
          <p className="text-gray-600 mb-6">
            Your therapy session with {therapist && therapist.name} has ended.
            We hope it was helpful for your mental wellness journey.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleReturnToTherapists}
              className="w-full bg-oasis-primary hover:bg-oasis-primary/90 text-white font-medium py-2 px-4 rounded-md transition-all"
            >
              Return to Therapists
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-oasis-primary text-oasis-primary hover:bg-oasis-primary hover:text-white font-medium py-2 px-4 rounded-md transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {therapist && (
        <VideoChat
          therapistName={therapist.name}
          therapistImage={therapist.image}
          sessionDuration={SESSION_DURATION}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  );
};

export default TherapistSession;
