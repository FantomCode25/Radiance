
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TherapistSignupForm from '../components/auth/TherapistSignupForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <TherapistSignupForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>By creating an account, you agree to our </span>
            <Link to="/terms" className="font-medium text-oasis-primary hover:underline">
              Terms of Service
            </Link>
            <span> and </span>
            <Link to="/privacy" className="font-medium text-oasis-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
