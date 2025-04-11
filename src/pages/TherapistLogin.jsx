
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';
import TherapistLoginForm from '../components/auth/TherapistLoginForm';

const TherapistLogin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <TherapistLoginForm />
          <div className="mt-6 text-center text-sm text-gray-600">
            <span>By signing in, you agree to our </span>
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

export default TherapistLogin;